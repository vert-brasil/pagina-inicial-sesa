# CIEGES-ES - Centro de Inteligência Estratégica para a Gestão Estadual do SUS

Sistema web desenvolvido para a Secretaria de Estado da Saúde do Espírito Santo (SESA-ES), oferecendo acesso centralizado a painéis e relatórios estratégicos de saúde.

## Funcionalidades

### Navegação Intuitiva
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

### Acessibilidade
- Navegação completa por teclado
- Suporte para leitores de tela
- Indicadores visuais claros
- Anúncios de status para usuários com deficiência visual

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

## Desenvolvimento

### Estrutura do Código
- **Modular**: Código organizado em funções específicas
- **Comentado**: Documentação inline para manutenção
- **Acessível**: Implementação de boas práticas de acessibilidade
- **Responsivo**: Design adaptável para diferentes dispositivos

### Funções Principais
- `init()`: Inicialização da aplicação
- `navigateToPage()`: Navegação entre páginas
- `setupEventListeners()`: Configuração de event listeners
- `setupAccessibility()`: Configuração de acessibilidade

## Manutenção

### Adicionar Novos Relatórios
1. Adicione o link no HTML
2. Configure o estilo conforme necessário
3. Teste o funcionamento

### Modificar Configurações
- **Animações**: Altere `ANIMATION_DURATION` em `CONFIG`
- **Estilos**: Modifique as variáveis CSS em `:root`

## Changelog

### Versão 1.4.0 (Atual)
- **Remoção**: Funcionalidade de autenticação SAS Viya
- **Remoção**: Loading overlay entre páginas
- **Simplificação**: Comportamento normal dos links
- **Limpeza**: Código simplificado e otimizado

### Versão 1.3.0
- **Nova Funcionalidade**: Solução de autenticação SAS Viya (Versão 2.0)
- **Melhoria**: Limpeza proativa de cache de identidade
- **Melhoria**: Timeout robusto para requisições
- **Melhoria**: Logs detalhados para debug
- **Melhoria**: Detecção de foco e visibilidade da página
- **Melhoria**: Tratamento melhorado de erros
- **Documentação**: Guias completos de implementação e teste

### Versão 1.2.0
- **Nova Funcionalidade**: Navegação mobile otimizada
- **Melhoria**: Breadcrumbs dinâmicos
- **Melhoria**: Animações suaves de transição
- **Correção**: Responsividade em dispositivos móveis

### Versão 1.1.0
- **Nova Funcionalidade**: Sistema de breadcrumbs
- **Melhoria**: Navegação por teclado
- **Melhoria**: Indicadores visuais de carregamento
- **Correção**: Acessibilidade para leitores de tela

### Versão 1.0.0
- **Lançamento Inicial**: Interface básica
- **Funcionalidade**: Navegação entre páginas
- **Funcionalidade**: Acesso a relatórios públicos e restritos

## Suporte

Para suporte técnico ou dúvidas sobre a implementação:
- Verifique os logs no console do navegador
- Consulte a documentação do código

## Licença

Desenvolvido para a Secretaria de Estado da Saúde do Espírito Santo (SESA-ES).

---

**Desenvolvido por**: Equipe de TI da SESA-ES  
**Versão**: 1.4.0  
**Última Atualização**: Janeiro 2025