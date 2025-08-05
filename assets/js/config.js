/**
 * Configurações do Sistema CIEGES-ES
 * Atualizada para compatibilidade com implementação padrão do sas-auth-browser
 */

window.CIEGES_CONFIG = {
    // Configurações de Autenticação SAS - compatível com código funcional
    sas: {
        // URL do servidor SAS Viya - ALTERE PARA SEU AMBIENTE
        url: 'https://sesa.viya.saude.es.gov.br',
        
        // Permitir login automático como guest (igual ao código funcional)
        guest: false,
        
        // Configurações de retry
        maxRetries: 3,
        retryDelay: 1000,
        
        // Intervalo de verificação de autenticação (em milissegundos)
        checkInterval: 5 * 60 * 1000, // 5 minutos
        
        // Timeout para requisições (em milissegundos)
        requestTimeout: 10000, // 10 segundos
        
        // Endpoints específicos (baseados no código funcional)
        endpoints: {
            logon: '/SASVisualAnalytics/logon/index.html',
            logout: '/SASLogon/logout.do',
            userInfo: '/identities/users/@currentUser',
            reports: '/reports/'
        }
    },
    
    // Configurações de Interface
    ui: {
        // Duração das animações
        animationDuration: 300,
        
        // Tempo de exibição das notificações
        notificationDuration: 5000,
        
        // Mostrar indicador de status de autenticação
        showAuthStatus: true,
        
        // Posição do indicador de status
        authStatusPosition: 'bottom-right',
    },
    
    // Configurações de Segurança
    security: {
        // Páginas que requerem autenticação
        restrictedPages: ['restricted', 'regulation', 'judicial'],
        
        // Permitir acesso de usuários guest às páginas restritas
        allowGuestAccess: false,
        
        // Tempo limite de sessão inativa (em milissegundos)
        sessionTimeout: 30 * 60 * 1000, // 30 minutos
        
        // Nomes de usuários considerados guest
        guestUserNames: ['guest', 'sasguest', 'anonymous']
    },
    
    // Configurações de Analytics
    analytics: {
        // Habilitar rastreamento de eventos
        enabled: true,
        
        // Rastrear eventos de autenticação
        trackAuth: true,
        
        // Rastrear navegação entre páginas
        trackNavigation: true,
    },
    
    // Configurações de Acessibilidade
    accessibility: {
        // Anunciar mudanças para leitores de tela
        announceChanges: true,
        
        // Focar automaticamente em elementos principais
        autoFocus: true,
        
        // Respeitar preferências de movimento reduzido
        respectReducedMotion: true,
    },
    
    // Mensagens personalizáveis
    messages: {
        authRequired: 'Esta área requer autenticação. Você precisa fazer login para acessar os painéis restritos.',
        guestDenied: 'Usuários convidados não têm acesso às áreas restritas. Entre em contato com o administrador do sistema para obter as credenciais adequadas.',
        authError: 'Erro ao verificar permissões de acesso. Tente novamente ou entre em contato com o suporte técnico.',
        loginSuccess: 'Login realizado com sucesso!',
        logoutSuccess: 'Logout realizado com sucesso!',
        sessionExpired: 'Sua sessão expirou. Faça login novamente para continuar.',
        popupBlocked: 'Popup de login foi bloqueado. Permita popups para este site e tente novamente.',
        libraryNotLoaded: 'Biblioteca de autenticação não carregou. Verifique sua conexão com a internet.'
    }
}; 