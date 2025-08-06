# CIEGES-ES - Centro de Inteligência Estratégica para a Gestão Estadual do SUS

Sistema web desenvolvido para a Secretaria de Estado da Saúde do Espírito Santo (SESA-ES), oferecendo acesso centralizado a painéis e relatórios estratégicos de saúde.

## Funcionalidades

### Navegação
- **Página Inicial**: Visão geral do sistema e acesso rápido aos principais recursos
- **Acesso Público**: Relatórios e painéis de acesso livre
- **Acesso Restrito**: Relatórios que requerem autenticação específica

### Grupos de Relatórios

#### Acesso Público
- **Observatório da Saúde**: Indicadores gerais de saúde do estado
- **Mandados Judiciais Públicos**: Histórico, situação e indicadores judiciais e financeiros

#### Acesso Restrito
- **Regulação Ambulatorial**: Gestão de acesso, filas, oferta e logística médica
- **Mandados Judiciais Restritos**: Acompanhamento de processos e judicialização da saúde
- 
### Design Responsivo
- Interface adaptável para desktop, tablet e mobile
- Navegação mobile otimizada
- Layout flexível e moderno

## Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Estilização**: CSS Custom Properties, Flexbox, Grid
- **Ícones**: Font Awesome 6
- **Fontes**: Google Fonts (Inter)

## Estrutura do Projeto

```
pagina-inicial-sesa/
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── images/
│   │   ├── 00 - Navbar Lateral Esquerda/
│   │   └── 01 - Página Inicial/
│   └── js/
│       └── main.js
├── index.html
└── README.md
```

## Configuração e Instalação

### Pré-requisitos
- Servidor web (Apache, Nginx, ou servidor local)
- Navegador moderno (Chrome, Firefox, Safari, Edge)

### Instalação
1. Clone ou baixe o repositório
2. Coloque os arquivos em um servidor web
3. Acesse via navegador

### Funções Principais
- `init()`: Inicialização da aplicação
- `navigateToPage()`: Navegação entre páginas
- `setupEventListeners()`: Configuração de event listeners
- `setupAccessibility()`: Configuração de acessibilidade

### Modificar Configurações
- **Animações**: Altere `ANIMATION_DURATION` em `CONFIG`
- **Estilos**: Modifique as variáveis CSS em `:root`

## Licença

Desenvolvido para a Secretaria de Estado da Saúde do Espírito Santo (SESA-ES).
