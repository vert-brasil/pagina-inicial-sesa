/**
 * CIEGES-ES - Centro de Inteligência Estratégica para a Gestão Estadual do SUS
 * JavaScript principal para funcionalidades da página
 */

// Configurações
const CONFIG = {
    ANIMATION_DURATION: 300
};

// Estado da aplicação
const state = {
    currentPage: 'home',
    previousPage: null,
    parentPage: null, // Nova propriedade para rastrear a página pai
    navigationHistory: ['home']
};

// Elementos DOM
const elements = {
    navHome: null, navPublic: null, navRestricted: null,
    mobileNavHome: null, mobileNavPublic: null, mobileNavRestricted: null,
    pageHome: null, pagePublic: null, pageRestricted: null, pageRegulation: null, pageJudicial: null, pageMjPublic: null,
    breadcrumbLevel1: null, breadcrumbLevel2: null, breadcrumbLevel3: null,
    breadcrumbSeparator1: null, breadcrumbSeparator2: null,
    groupButtons: [],
    backButtons: [],
    accessRequestButton: null
};

/**
 * Inicialização da aplicação
 */
const init = () => {
    console.log('Inicializando CIEGES-ES...');
    
    // Obter elementos DOM
    cacheElements();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Configurar acessibilidade
    setupAccessibility();
    
    // Inicializar página atual
    showPage(state.currentPage);
    
    console.log('CIEGES-ES inicializado com sucesso!');
};

/**
 * Cache dos elementos DOM para melhor performance
 */
const cacheElements = () => {
    // Navegação
    elements.navHome = document.getElementById('nav-home');
    elements.navPublic = document.getElementById('nav-public');
    elements.navRestricted = document.getElementById('nav-restricted');
    
    // Navegação Mobile
    elements.mobileNavHome = document.getElementById('mobile-nav-home');
    elements.mobileNavPublic = document.getElementById('mobile-nav-public');
    elements.mobileNavRestricted = document.getElementById('mobile-nav-restricted');
    
    // Páginas
    elements.pageHome = document.getElementById('page-home');
    elements.pagePublic = document.getElementById('page-public');
    elements.pageRestricted = document.getElementById('page-restricted');
    elements.pageRegulation = document.getElementById('page-regulation');
    elements.pageJudicial = document.getElementById('page-judicial');
    elements.pageMjPublic = document.getElementById('page-mj-public');
    
    // Breadcrumb
    elements.breadcrumbLevel1 = document.getElementById('breadcrumb-level-1');
    elements.breadcrumbLevel2 = document.getElementById('breadcrumb-level-2');
    elements.breadcrumbLevel3 = document.getElementById('breadcrumb-level-3');
    elements.breadcrumbSeparator1 = document.getElementById('breadcrumb-separator-1');
    elements.breadcrumbSeparator2 = document.getElementById('breadcrumb-separator-2');
    
    // Botões
    elements.groupButtons = document.querySelectorAll('.group-button');
    elements.backButtons = document.querySelectorAll('.back-link a');
    elements.accessRequestButton = document.querySelector('.access-request-button');
    
    // Verificar elementos críticos
    if (!elements.pageHome || !elements.pagePublic || !elements.pageRestricted) {
        console.error('Páginas não encontradas!');
    }
};

/**
 * Configurar event listeners
 */
const setupEventListeners = () => {
    // Navegação principal
    if (elements.navHome) {
        elements.navHome.addEventListener('click', () => navigateToPage('home'));
    }
    if (elements.navPublic) {
        elements.navPublic.addEventListener('click', () => navigateToPage('public'));
    }
    if (elements.navRestricted) {
        elements.navRestricted.addEventListener('click', () => navigateToPage('restricted'));
    }
    
    // Navegação mobile
    if (elements.mobileNavHome) {
        elements.mobileNavHome.addEventListener('click', () => navigateToPage('home'));
    }
    if (elements.mobileNavPublic) {
        elements.mobileNavPublic.addEventListener('click', () => navigateToPage('public'));
    }
    if (elements.mobileNavRestricted) {
        elements.mobileNavRestricted.addEventListener('click', () => navigateToPage('restricted'));
    }
    
    // Botão de solicitar acesso
    if (elements.accessRequestButton) {
        elements.accessRequestButton.addEventListener('click', handleAccessRequest);
    }
    
    // Botões dos grupos
    elements.groupButtons.forEach(button => {
        button.addEventListener('click', handleGroupAccess);
    });
    
    // Botões de voltar
    elements.backButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            goBack();
        });
    });
    
    // Event listeners para navegação por teclado
    setupKeyboardNavigation();
    
    // Event listeners para analytics
    setupAnalytics();
    
    console.log('Event listeners configurados');
};

const setupKeyboardNavigation = () => {
    // Navegação por teclado nos links
    const navLinks = [elements.navHome, elements.navPublic, elements.navRestricted];
    
    navLinks.forEach(link => {
        if (link) {
            link.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    link.click();
                }
            });
        }
    });
    
    // Navegação por teclado nos botões
    const allButtons = [...elements.groupButtons];
    allButtons.forEach(button => {
        button.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                button.click();
            }
        });
    });
    
    // Navegação por teclado no botão de acesso restrito
    if (elements.accessRequestButton) {
        elements.accessRequestButton.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                elements.accessRequestButton.click();
            }
        });
    }
};

/**
 * Configurar recursos de acessibilidade
 */
const setupAccessibility = () => {
    // Adicionar suporte para navegação por teclado
    const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.setAttribute('data-focused', 'true');
        });
        
        element.addEventListener('blur', () => {
            element.removeAttribute('data-focused');
        });
    });
    
    // Adicionar aria-live para anúncios dinâmicos
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'announcements';
    document.body.appendChild(liveRegion);
};

/**
 * Navegar para uma página específica
 */
const navigateToPage = async (pageName) => {
    console.log(`Navegando para: ${pageName}`);
    
    // Verificar se a página atual é diferente
    if (state.currentPage === pageName) {
        console.log('Já está na página solicitada');
        return;
    }
    
    // Atualizar histórico de navegação
    state.previousPage = state.currentPage;
    state.currentPage = pageName;
    
    // Adicionar à navegação se não for uma navegação de volta
    if (pageName !== 'home' || state.navigationHistory.length === 0) {
        state.navigationHistory.push(pageName);
    }
    
    // Mostrar a página
    showPage(pageName);
    
    // Atualizar navegação ativa
    updateActiveNavigation(pageName);
    
    // Atualizar breadcrumb
    updateBreadcrumb(pageName);
    
    // Anunciar mudança para leitores de tela
    const pageTitle = getPageTitle(pageName);
    announceToScreenReader(`Navegou para ${pageTitle}`);
    
    // Rastrear evento
    trackEvent('Navigation', 'Page Change', pageName);
    
    console.log(`Navegação concluída para: ${pageName}`);
};

/**
 * Voltar para a página anterior
 */
const goBack = () => {
    if (state.navigationHistory.length > 1) {
        state.navigationHistory.pop();
        const previousPage = state.navigationHistory[state.navigationHistory.length - 1];
        console.log(`Voltando para página: ${previousPage}`);
        
        // Se estamos voltando de uma página de grupo, limpar a página pai
        if (state.currentPage === 'regulation' || state.currentPage === 'judicial' || state.currentPage === 'mj-public') {
            state.parentPage = null;
        }
        
        navigateToPage(previousPage);
    } else {
        navigateToPage('home');
    }
};

/**
 * Mostrar página específica
 */
const showPage = (pageName) => {
    // Esconder todas as páginas
    const pages = [elements.pageHome, elements.pagePublic, elements.pageRestricted, elements.pageRegulation, elements.pageJudicial, elements.pageMjPublic];
    pages.forEach(page => {
        if (page) {
            page.classList.add('hidden');
        }
    });
    
    // Mostrar página selecionada
    const targetPage = getPageElement(pageName);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        
        // Focar no primeiro elemento focável da página
        setTimeout(() => {
            const firstFocusable = targetPage.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }, 100);
    }
};

/**
 * Obter elemento da página
 */
const getPageElement = (pageName) => {
    const pageMap = {
        'home': elements.pageHome,
        'public': elements.pagePublic,
        'restricted': elements.pageRestricted,
        'regulation': elements.pageRegulation,
        'judicial': elements.pageJudicial,
        'mj-public': elements.pageMjPublic
    };
    return pageMap[pageName];
};

/**
 * Obter título da página
 */
const getPageTitle = (pageName) => {
    const titleMap = {
        'home': 'Página Inicial',
        'public': 'Acesso Público',
        'restricted': 'Acesso Restrito',
        'regulation': 'Regulação Ambulatorial',
        'judicial': 'Mandados Judiciais',
        'mj-public': 'MJ Painel Público'
    };
    return titleMap[pageName] || 'Página Inicial';
};

/**
 * Atualizar navegação ativa
 */
const updateActiveNavigation = (pageName) => {
    // Remover classe active de todos os links
    const navLinks = [elements.navHome, elements.navPublic, elements.navRestricted];
    const mobileNavButtons = [elements.mobileNavHome, elements.mobileNavPublic, elements.mobileNavRestricted];
    
    navLinks.forEach(link => {
        if (link) {
            link.classList.remove('active');
        }
    });
    
    mobileNavButtons.forEach(button => {
        if (button) {
            button.classList.remove('active');
        }
    });
    
    // Determinar qual link deve ficar ativo baseado na página
    let activePage = pageName;
    
    // Se estamos em uma página de grupo, usar a página pai
    if (pageName === 'regulation' || pageName === 'judicial' || pageName === 'mj-public') {
        activePage = state.parentPage || 'public'; // Fallback para 'public' se não houver página pai
    }
    
    // Adicionar classe active ao link correto (desktop)
    const activeLink = getNavElement(activePage);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Adicionar classe active ao botão correto (mobile)
    const activeMobileButton = getMobileNavElement(activePage);
    if (activeMobileButton) {
        activeMobileButton.classList.add('active');
    }
};

/**
 * Obter elemento de navegação
 */
const getNavElement = (pageName) => {
    const navMap = {
        'home': elements.navHome,
        'public': elements.navPublic,
        'restricted': elements.navRestricted
    };
    return navMap[pageName];
};

/**
 * Obter elemento de navegação mobile
 */
const getMobileNavElement = (pageName) => {
    const mobileNavMap = {
        'home': elements.mobileNavHome,
        'public': elements.mobileNavPublic,
        'restricted': elements.mobileNavRestricted
    };
    return mobileNavMap[pageName];
};

/**
 * Atualizar breadcrumb
 */
const updateBreadcrumb = (pageName) => {
    // Esconder todos os níveis e separadores primeiro
    if (elements.breadcrumbLevel2) elements.breadcrumbLevel2.classList.add('hidden');
    if (elements.breadcrumbLevel3) elements.breadcrumbLevel3.classList.add('hidden');
    if (elements.breadcrumbSeparator1) elements.breadcrumbSeparator1.classList.add('hidden');
    if (elements.breadcrumbSeparator2) elements.breadcrumbSeparator2.classList.add('hidden');
    
    // Definir breadcrumb baseado na página
    switch (pageName) {
        case 'home':
            if (elements.breadcrumbLevel1) elements.breadcrumbLevel1.textContent = 'Página Inicial';
            break;
            
        case 'public':
            if (elements.breadcrumbLevel1) elements.breadcrumbLevel1.textContent = 'Acesso Público';
            break;
            
        case 'restricted':
            if (elements.breadcrumbLevel1) elements.breadcrumbLevel1.textContent = 'Acesso Restrito';
            break;
            
        case 'regulation':
            if (elements.breadcrumbLevel1) elements.breadcrumbLevel1.textContent = 'Acesso Público';
            if (elements.breadcrumbSeparator1) elements.breadcrumbSeparator1.classList.remove('hidden');
            if (elements.breadcrumbLevel2) {
                elements.breadcrumbLevel2.textContent = 'Regulação Ambulatorial';
                elements.breadcrumbLevel2.classList.remove('hidden');
            }
            break;
            
        case 'judicial':
            if (elements.breadcrumbLevel1) elements.breadcrumbLevel1.textContent = 'Acesso Público';
            if (elements.breadcrumbSeparator1) elements.breadcrumbSeparator1.classList.remove('hidden');
            if (elements.breadcrumbLevel2) {
                elements.breadcrumbLevel2.textContent = 'Mandados Judiciais';
                elements.breadcrumbLevel2.classList.remove('hidden');
            }
            break;
            
        case 'mj-public':
            if (elements.breadcrumbLevel1) elements.breadcrumbLevel1.textContent = 'Acesso Público';
            if (elements.breadcrumbSeparator1) elements.breadcrumbSeparator1.classList.remove('hidden');
            if (elements.breadcrumbLevel2) {
                elements.breadcrumbLevel2.textContent = 'MJ Painel Público';
                elements.breadcrumbLevel2.classList.remove('hidden');
            }
            break;
            
        default:
            if (elements.breadcrumbLevel1) elements.breadcrumbLevel1.textContent = 'Página Inicial';
    }
};

/**
 * Manipulador de acesso aos grupos
 */
const handleGroupAccess = (event) => {
    const button = event.currentTarget;
    const groupCard = button.closest('.group-card');
    const groupName = groupCard.querySelector('h3').textContent;
    
    console.log(`Acessando grupo: ${groupName}`);
    
    // Registrar evento de analytics
    trackEvent('group_access', 'button_click', groupName);
    
    // Anunciar para leitores de tela
    announceToScreenReader(`Acessando grupo ${groupName}`);
    
    // Definir a página pai baseada na página atual
    state.parentPage = state.currentPage;
    
    // Determinar para qual página navegar baseado no nome do grupo
    let targetPage = 'home';
    if (groupName === 'Regulação Ambulatorial') {
        targetPage = 'regulation';
    } else if (groupName === 'Mandados Judiciais') {
        targetPage = 'judicial';
    } else if (groupName === 'MJ Painel Público') {
        targetPage = 'mj-public';
    }
    
    // Navegar para a página do grupo
    navigateToPage(targetPage);
};

/**
 * Manipulador de solicitação de acesso restrito
 */
const handleAccessRequest = () => {
    console.log('Solicitando acesso restrito...');
    announceToScreenReader('Solicitando acesso restrito...');
    showInfoMessage('Solicitação de acesso restrito enviada com sucesso!');
};

/**
 * Mostrar mensagem informativa
 */
const showInfoMessage = (message) => {
    console.info('ℹ️', message);
    announceToScreenReader(message);
    
    // Implementar toast notification no futuro
    alert(message);
};

/**
 * Anunciar mensagem para leitores de tela
 */
const announceToScreenReader = (message) => {
    const announcements = document.getElementById('announcements');
    if (announcements) {
        announcements.textContent = message;
        
        // Limpar após 5 segundos
        setTimeout(() => {
            if (announcements.textContent === message) {
                announcements.textContent = '';
            }
        }, 5000);
    }
};

/**
 * Configurar analytics (Google Analytics, Adobe Analytics, etc.)
 */
const setupAnalytics = () => {
    // Implementar quando necessário
    console.log('Analytics configurado');
};

/**
 * Rastrear evento para analytics
 */
const trackEvent = (category, action, label = null) => {
    try {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label,
                page_title: document.title,
                page_location: window.location.href
            });
        }
        
        // Adobe Analytics (quando implementado)
        if (typeof s !== 'undefined' && s.tl) {
            s.tl(true, 'o', `${category}:${action}:${label}`);
        }
        
        console.log(`Evento rastreado: ${category} > ${action} > ${label}`);
        
    } catch (error) {
        console.warn('Erro ao rastrear evento:', error);
    }
};

/**
 * Verificar suporte do navegador
 */
const checkBrowserSupport = () => {
    const isSupported = 
        'addEventListener' in window &&
        'querySelector' in document &&
        'classList' in document.createElement('div') &&
        'Promise' in window;
    
    if (!isSupported) {
        console.warn('Navegador não suportado completamente');
        alert('Seu navegador pode não suportar todas as funcionalidades. Considere atualizá-lo.');
    }
    
    return isSupported;
};

/**
 * Event listeners para quando o DOM estiver carregado
 */
document.addEventListener('DOMContentLoaded', () => {
    // Verificar suporte do navegador
    checkBrowserSupport();
    
    // Inicializar aplicação
    init();
});

/**
 * Event listener para quando a página estiver completamente carregada
 */
window.addEventListener('load', () => {
    console.log('Página CIEGES-ES carregada completamente!');
    
    // Registrar carregamento da página
    trackEvent('page_load', 'complete', 'cieges_home');
});

/**
 * Event listener para erros não capturados
 */
window.addEventListener('error', (event) => {
    console.error('Erro não capturado:', event.error);
    trackEvent('error', 'uncaught_error', event.error?.message || 'unknown');
});

/**
 * Event listener para promises rejeitadas
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rejeitada:', event.reason);
    trackEvent('error', 'unhandled_promise_rejection', event.reason?.message || 'unknown');
});

// Exportar funções para uso global (se necessário)
window.CIEGES = {
    init,
    navigateToPage,
    trackEvent,
    CONFIG,
    state
}; 