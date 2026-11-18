const loginFixture = require('../../fixtures/login-api.json');

describe('Suite de Testes de API de Login /POST', () => {
    it('QA-05 - Efetuar login e verificar token de autorização', () => {
        cy.apiLogin(loginFixture.login_valido);
    });

    it('QA-06 - Efetuar login com email incorreto', () => {
        cy.env(['apiUrl']).then(({ apiUrl }) => {
            cy.request({
                method:'POST', 
                url:`${apiUrl}/auth/login`, 
                failOnStatusCode: false, 
                body: loginFixture.login_invalido_email_incorreto
            }).then((response) => {
                expect(response.status).to.eq(401);
                //Existe um problema na API de testes que informa informações sensíveis na resposta de erro 
            });
        });    
    });

    it('QA-06 - Efetuar login com senha incorreta', () => {
        cy.env(['apiUrl']).then(({ apiUrl }) => {    
            cy.request({
                method:'POST', 
                url:`${apiUrl}/auth/login`, 
                failOnStatusCode: false, 
                body: loginFixture.login_invalido_senha_incorreta
            }).then((response) => {
                expect(response.status).to.eq(401);
                //Existe um problema na API de testes que informa informações sensíveis na resposta de erro
            });
        });
    });


});
