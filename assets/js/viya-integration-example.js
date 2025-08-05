/**
 * Exemplo de integração com SAS Viya seguindo o padrão do código funcional
 */

// Configuração igual ao exemplo funcional
const url = 'https://sesa.viya.saude.es.gov.br'; // Substitua pela sua URL

// Criar instância seguindo exatamente o padrão
const sasAuthInstance = sasAuthBrowser.createCookieAuthenticationCredential({
    url,
});

// Função principal seguindo exatamente o padrão do código funcional
async function callViyaApi() {
    try {
        await sasAuthInstance.checkAuthenticated();
        console.log('Usuário autenticado, pronto para fazer chamadas à API');
        // Start making rest calls!
        return true;
    } catch {
        console.log('Usuário não autenticado, abrindo popup de login...');
        // Note: If the user closes the popup an uncaught exception will occur.
        await sasAuthInstance.loginPopup();
        console.log('Login concluído, pronto para fazer chamadas à API');
        // Start making rest calls!
        return true;
    }
}

// Função para testar a integração
async function testViyaIntegration() {
    try {
        await callViyaApi();
        console.log('Integração com Viya funcionando corretamente');
        return true;
    } catch (error) {
        console.error('Erro na integração com Viya:', error);
        return false;
    }
}

// Exportar para uso global
window.ViyaIntegration = {
    callViyaApi,
    testViyaIntegration,
    sasAuthInstance
};