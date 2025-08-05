/**
 * Módulo de Autenticação SAS para CIEGES-ES
 * Compatível com a implementação padrão do sas-auth-browser
 */

// Configuração da autenticação SAS
const SAS_CONFIG = {
    // URL do servidor SAS Viya - SUBSTITUA pela URL real do seu ambiente
    url: 'https://sesa.viya.saude.es.gov.br',
    guest: false, // Permitir login automático como guest se necessário
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
    checkInterval: 5 * 60 * 1000, // 5 minutos
    isInitialized: false
};

/**
 * Inicializar o sistema de autenticação SAS
 */
const initSASAuth = async () => {
    try {
        console.log('Inicializando autenticação SAS...');
        
        // Aguardar a biblioteca estar disponível
        await waitForSASAuthLibrary();
        
        // Criar instância de autenticação usando a mesma abordagem do código funcional
        authState.sasAuthInstance = sasAuthBrowser.createCookieAuthenticationCredential({
            url: SAS_CONFIG.url,
            guest: SAS_CONFIG.guest
        });
        
        console.log('Instância SAS Auth criada com sucesso');
        authState.isInitialized = true;
        
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
 * Aguardar a biblioteca sas-auth-browser estar disponível
 */
const waitForSASAuthLibrary = () => {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 20; // 10 segundos
        
        const checkLibrary = () => {
            if (typeof sasAuthBrowser !== 'undefined') {
                resolve();
                return;
            }
            
            attempts++;
            if (attempts >= maxAttempts) {
                reject(new Error('Biblioteca sas-auth-browser não carregou'));
                return;
            }
            
            setTimeout(checkLibrary, 500);
        };
        
        checkLibrary();
    });
};

/**
 * Verificar status de autenticação - seguindo o padrão do código funcional
 */
const checkAuthenticationStatus = async () => {
    if (!authState.sasAuthInstance || !authState.isInitialized) {
        console.warn('Instância SAS Auth não inicializada');
        return false;
    }
    
    try {
        console.log('Verificando status de autenticação...');
        
        // Usar o método checkAuthenticated da biblioteca
        await authState.sasAuthInstance.checkAuthenticated();
        
        // Se chegou até aqui, o usuário está autenticado
        authState.isAuthenticated = true;
        authState.lastCheck = Date.now();
        
        console.log('Usuário autenticado com sucesso');
        
        // Tentar determinar se é usuário guest
        await determineUserType();
        
        return true;
        
    } catch (error) {
        console.log('Usuário não autenticado:', error);
        authState.isAuthenticated = false;
        authState.isGuest = false;
        authState.userInfo = null;
        authState.lastCheck = Date.now();
        
        return false;
    }
};

/**
 * Determinar se é usuário guest
 */
const determineUserType = async () => {
    try {
        // Tentar fazer uma requisição para obter informações do usuário
        const response = await fetch(`${SAS_CONFIG.url}/identities/users/@currentUser`, {
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        if (response.ok) {
            const userInfo = await response.json();
            authState.userInfo = userInfo;
            
            // Verificar se é usuário guest baseado no nome ou ID
            authState.isGuest = userInfo.name === 'guest' || 
                              userInfo.id === 'guest' ||
                              userInfo.name === 'sasguest' ||
                              userInfo.id === 'sasguest';
            
            console.log('Informações do usuário obtidas:', {
                name: userInfo.name,
                isGuest: authState.isGuest
            });
        } else {
            // Se não conseguir obter info do usuário, assumir que não é guest
            authState.isGuest = false;
            console.log('Não foi possível obter informações do usuário, assumindo usuário autenticado');
        }
        
    } catch (error) {
        console.warn('Erro ao determinar tipo de usuário:', error);
        // Em caso de erro, assumir que não é guest se está autenticado
        authState.isGuest = false;
    }
};

/**
 * Realizar login via popup - seguindo o padrão do código funcional
 */
const loginWithPopup = async () => {
    if (!authState.sasAuthInstance || !authState.isInitialized) {
        throw new Error('Sistema de autenticação não inicializado');
    }
    
    try {
        console.log('Iniciando processo de login...');
        showAuthMessage('Abrindo janela de login...', 'info');
        
        // Usar o método loginPopup da biblioteca (igual ao código funcional)
        await authState.sasAuthInstance.loginPopup();
        
        console.log('Login realizado com sucesso');
        
        // Verificar status após login
        const isAuthenticated = await checkAuthenticationStatus();
        
        if (isAuthenticated) {
            showAuthMessage('Login realizado com sucesso!', 'success');
            return true;
        } else {
            throw new Error('Falha na verificação pós-login');
        }
        
    } catch (error) {
        console.error('Erro no processo de login:', error);
        
        // Tratar diferentes tipos de erro
        if (error.message && error.message.includes('popup')) {
            showAuthError('Login cancelado ou janela de login foi fechada');
        } else if (error.message && error.message.includes('failed to log in')) {
            showAuthError('Falha no processo de login. Verifique suas credenciais.');
        } else {
            showAuthError('Erro no processo de login. Tente novamente.');
        }
        
        return false;
    }
};

/**
 * Realizar logout - usando o método da biblioteca
 */
const logout = async () => {
    if (!authState.sasAuthInstance || !authState.isInitialized) {
        console.warn('Sistema de autenticação não inicializado');
        return;
    }
    
    try {
        console.log('Realizando logout...');
        showAuthMessage('Encerrando sessão...', 'info');
        
        // Usar o método logout da biblioteca
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
            setTimeout(() => navigateToPage('home'), 1000);
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
    if (authState.sasAuthInstance && authState.isInitialized) {
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
    
    // Verificar se é usuário guest (se configurado para bloquear)
    if (authState.isGuest && !SAS_CONFIG.guest) {
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
 * Função auxiliar similar ao exemplo funcional
 */
const callViyaApi = async () => {
    if (!authState.sasAuthInstance || !authState.isInitialized) {
        throw new Error('Sistema de autenticação não inicializado');
    }
    
    try {
        await authState.sasAuthInstance.checkAuthenticated();
        console.log('Pronto para fazer chamadas à API do Viya');
        return true;
    } catch (error) {
        console.log('Usuário não autenticado, iniciando login...');
        await authState.sasAuthInstance.loginPopup();
        console.log('Login concluído, pronto para fazer chamadas à API');
        return true;
    }
};

/**
 * Configurar verificação periódica de autenticação
 */
const setupPeriodicAuthCheck = () => {
    setInterval(async () => {
        if (!authState.isInitialized) return;
        
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
    
    // Implementar notificação visual
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
        lastCheck: authState.lastCheck,
        isInitialized: authState.isInitialized
    };
};

// Exportar funções para uso global - seguindo padrão similar ao código funcional
window.SASAuth = {
    init: initSASAuth,
    checkStatus: checkAuthenticationStatus,
    checkRestrictedAccess,
    login: loginWithPopup,
    logout,
    invalidateCache: invalidateAuthCache,
    getStatus: getAuthStatus,
    callViyaApi // Função auxiliar similar ao exemplo
};

// Auto-inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pouco para garantir que a biblioteca foi carregada
    setTimeout(initSASAuth, 1000);
}); 