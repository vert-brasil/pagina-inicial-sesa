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

## Uso

### Navegação Básica
1. **Página Inicial**: Visão geral e acesso rápido
2. **Acesso Público**: Relatórios de acesso livre
3. **Acesso Restrito**: Relatórios que requerem autenticação

### Acesso a Relatórios
- **Relatórios Públicos**: Clique direto para abrir
- **Relatórios Restritos**: Acesso direto (autenticação gerenciada pelo SAS)

### Navegação por Teclado
- Use `Tab` para navegar entre elementos
- Use `Enter` ou `Espaço` para ativar links e botões

### Navegação Hierárquica
O botão "Voltar" respeita a hierarquia de páginas:
- **Painéis** → **Grupo** (Acesso Público/Restrito)
- **Grupo** → **Página Inicial**
- **Página Inicial** → Não há para onde voltar

**Exemplo de fluxo:**
```
Página Inicial → Acesso Público → Regulação Ambulatorial
     ↑              ↑                    ↑
   (TOPO)      (TOPO GRUPO)        (BASE/PAINÉIS)
```

## Desenvolvimento

### Funções Principais
- `init()`: Inicialização da aplicação
- `navigateToPage()`: Navegação entre páginas
- `setupEventListeners()`: Configuração de event listeners
- `setupAccessibility()`: Configuração de acessibilidade

### Modificar Configurações
- **Animações**: Altere `ANIMATION_DURATION` em `CONFIG`
- **Estilos**: Modifique as variáveis CSS em `:root`

## Changelog

### Versão 1.6.0 (Atual)
- **Nova Funcionalidade**: Navegação hierárquica no botão voltar
- **Melhoria**: Botão voltar respeita estrutura de páginas em vez do histórico
- **Estrutura**: TOPO → TOPO GRUPO → BASE/PAINÉIS
- **UX**: Navegação mais intuitiva e previsível

### Versão 1.5.0
- **Atualização**: Links atualizados para ambiente de homologação (HML)
- **Atualização**: Link de solicitação de acesso atualizado para e-flow
- **Melhoria**: Botão de acesso restrito convertido para link funcional
- **Limpeza**: Código JavaScript simplificado

### Versão 1.4.0
- **Remoção**: Funcionalidade de autenticação SAS Viya
- **Remoção**: Loading overlay entre páginas
- **Simplificação**: Comportamento normal dos links
- **Limpeza**: Código simplificado e otimizado

## Licença

Desenvolvido para a Secretaria de Estado da Saúde do Espírito Santo (SESA-ES).
Responsável Gustavo Aguiar.

**Versão**: 1.6.0  
**Última Atualização**: Janeiro 2025
