/**
 * Módulo de Autenticação SAS para CIEGES-ES
 * Gerencia autenticação baseada em cookies usando sas-auth-browser
 */

// Configuração da autenticação SAS
const SAS_CONFIG = {
    // URL do servidor SAS Viya - SUBSTITUA pela URL real do seu ambiente
    url: 'https://sesa.viya.saude.es.gov.br',
    guest: false, // Não permitir login automático como guest
    maxRetries: 3,
    retryDelay: 1000
};

// Estado da autenticação
const authState = {
    isAuthenticated: false,
    isGuest: false,
    userInfo: null,
    sasAuthInstance: null,
    lastCheck: null,
    checkInterval: 5 * 60 * 1000 // 5 minutos
};

/**
 * Inicializar o sistema de autenticação SAS
 */
const initSASAuth = async () => {
    try {
        console.log('Inicializando autenticação SAS...');
        
        // Verificar se a biblioteca sas-auth-browser está disponível
        if (typeof sasAuthBrowser === 'undefined') {
            throw new Error('Biblioteca sas-auth-browser não encontrada');
        }
        
        // Criar instância de autenticação
        authState.sasAuthInstance = sasAuthBrowser.createCookieAuthenticationCredential({
            url: SAS_CONFIG.url,
            guest: SAS_CONFIG.guest
        });
        
        console.log('Instância SAS Auth criada com sucesso');
        
        // Verificar status inicial de autenticação
        await checkAuthenticationStatus();
        
        // Configurar verificação periódica
        setupPeriodicAuthCheck();
        
        return true;
        
    } catch (error) {
        console.error('Erro ao inicializar autenticação SAS:', error);
        showAuthError('Erro na inicialização do sistema de autenticação');
        return false;
    }
};

/**
 * Verificar status de autenticação
 */
const checkAuthenticationStatus = async () => {
    if (!authState.sasAuthInstance) {
        console.warn('Instância SAS Auth não inicializada');
        return false;
    }
    
    try {
        console.log('Verificando status de autenticação...');
        
        await authState.sasAuthInstance.checkAuthenticated();
        
        // Se chegou até aqui, o usuário está autenticado
        authState.isAuthenticated = true;
        authState.lastCheck = Date.now();
        
        console.log('Usuário autenticado com sucesso');
        
        // Tentar obter informações do usuário se disponível
        await getUserInfo();
        
        return true;
        
    } catch (error) {
        console.log('Usuário não autenticado:', error.message);
        authState.isAuthenticated = false;
        authState.isGuest = false;
        authState.userInfo = null;
        authState.lastCheck = Date.now();
        
        return false;
    }
};

/**
 * Obter informações do usuário autenticado
 */
const getUserInfo = async () => {
    try {
        // Fazer uma requisição para obter informações do usuário
        const response = await fetch(`${SAS_CONFIG.url}/identities/users/@currentUser`, {
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const userInfo = await response.json();
            authState.userInfo = userInfo;
            
            // Verificar se é usuário guest
            authState.isGuest = userInfo.name === 'guest' || userInfo.id === 'guest';
            
            console.log('Informações do usuário obtidas:', userInfo.name);
        }
        
    } catch (error) {
        console.warn('Não foi possível obter informações do usuário:', error);
    }
};

/**
 * Realizar login via popup
 */
const loginWithPopup = async () => {
    if (!authState.sasAuthInstance) {
        throw new Error('Sistema de autenticação não inicializado');
    }
    
    try {
        console.log('Iniciando processo de login...');
        showAuthMessage('Abrindo janela de login...');
        
        await authState.sasAuthInstance.loginPopup();
        
        console.log('Login realizado com sucesso');
        
        // Verificar status após login
        await checkAuthenticationStatus();
        
        showAuthMessage('Login realizado com sucesso!', 'success');
        
        return true;
        
    } catch (error) {
        console.error('Erro no processo de login:', error);
        
        if (error.message.includes('popup')) {
            showAuthError('Login cancelado ou janela de login foi fechada');
        } else {
            showAuthError('Erro no processo de login. Tente novamente.');
        }
        
        return false;
    }
};

/**
 * Realizar logout
 */
const logout = async () => {
    if (!authState.sasAuthInstance) {
        console.warn('Sistema de autenticação não inicializado');
        return;
    }
    
    try {
        console.log('Realizando logout...');
        showAuthMessage('Encerrando sessão...');
        
        await authState.sasAuthInstance.logout();
        
        // Limpar estado local
        authState.isAuthenticated = false;
        authState.isGuest = false;
        authState.userInfo = null;
        authState.lastCheck = Date.now();
        
        console.log('Logout realizado com sucesso');
        showAuthMessage('Logout realizado com sucesso!', 'success');
        
        // Redirecionar para página inicial
        if (typeof navigateToPage === 'function') {
            navigateToPage('home');
        }
        
    } catch (error) {
        console.error('Erro no processo de logout:', error);
        showAuthError('Erro ao fazer logout. Tente novamente.');
    }
};

/**
 * Invalidar cache de autenticação
 */
const invalidateAuthCache = () => {
    if (authState.sasAuthInstance) {
        authState.sasAuthInstance.invalidateCache();
        authState.lastCheck = null;
        console.log('Cache de autenticação invalidado');
    }
};

/**
 * Verificar se o acesso restrito é permitido
 */
const checkRestrictedAccess = async () => {
    // Verificar se a autenticação ainda é válida
    const isValid = await checkAuthenticationStatus();
    
    if (!isValid) {
        return {
            allowed: false,
            reason: 'not_authenticated',
            message: 'É necessário fazer login para acessar esta área'
        };
    }
    
    // Verificar se é usuário guest
    if (authState.isGuest) {
        return {
            allowed: false,
            reason: 'guest_user',
            message: 'Usuários convidados não têm acesso a esta área restrita'
        };
    }
    
    return {
        allowed: true,
        reason: 'authenticated',
        message: 'Acesso autorizado'
    };
};

/**
 * Configurar verificação periódica de autenticação
 */
const setupPeriodicAuthCheck = () => {
    setInterval(async () => {
        if (authState.lastCheck && (Date.now() - authState.lastCheck < authState.checkInterval)) {
            return; // Ainda dentro do intervalo
        }
        
        console.log('Verificação periódica de autenticação...');
        await checkAuthenticationStatus();
        
    }, authState.checkInterval);
};

/**
 * Mostrar mensagem de autenticação
 */
const showAuthMessage = (message, type = 'info') => {
    console.log(`[AUTH ${type.toUpperCase()}]`, message);
    
    // Anunciar para leitores de tela
    if (typeof announceToScreenReader === 'function') {
        announceToScreenReader(message);
    }
    
    // Implementar notificação visual se necessário
    showNotification(message, type);
};

/**
 * Mostrar erro de autenticação
 */
const showAuthError = (message) => {
    showAuthMessage(message, 'error');
};

/**
 * Mostrar notificação visual
 */
const showNotification = (message, type = 'info') => {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.className = `auth-notification auth-notification--${type}`;
    notification.innerHTML = `
        <div class="auth-notification__content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="auth-notification__close" aria-label="Fechar notificação">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Adicionar ao DOM
    document.body.appendChild(notification);
    
    // Configurar fechamento automático
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Configurar botão de fechar
    const closeButton = notification.querySelector('.auth-notification__close');
    closeButton.addEventListener('click', () => {
        notification.remove();
    });
    
    // Animar entrada
    setTimeout(() => {
        notification.classList.add('auth-notification--show');
    }, 100);
};

/**
 * Obter ícone para notificação
 */
const getNotificationIcon = (type) => {
    const icons = {
        info: 'info-circle',
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle'
    };
    return icons[type] || 'info-circle';
};

/**
 * Obter status de autenticação atual
 */
const getAuthStatus = () => {
    return {
        isAuthenticated: authState.isAuthenticated,
        isGuest: authState.isGuest,
        userInfo: authState.userInfo,
        lastCheck: authState.lastCheck
    };
};

// Exportar funções para uso global
window.SASAuth = {
    init: initSASAuth,
    checkStatus: checkAuthenticationStatus,
    checkRestrictedAccess,
    login: loginWithPopup,
    logout,
    invalidateCache: invalidateAuthCache,
    getStatus: getAuthStatus
};

// Auto-inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pouco para garantir que outras dependências foram carregadas
    setTimeout(initSASAuth, 500);
}); 