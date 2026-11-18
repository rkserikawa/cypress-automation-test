// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add('validateSchema', (responseBody, schema) => {
    const Ajv = require('ajv');
    const ajv = new Ajv({ allErrors: true, useDefaults: true, coerceTypes: true });

    // Valida se o esquema fornecido é válido
    if (!ajv.validateSchema(schema)) {
        const schemaErrors = ajv.errors.map(error => `Path: ${error.instancePath} - Error: ${error.message}`).join('\n');
        throw new Error(`O esquema é inválido:\n${schemaErrors}`);
    }

    // Compila o esquema e valida o corpo da resposta
    const validate = ajv.compile(schema);
    const valid = validate(responseBody);

    // Se houver erros na validação, lança uma exceção com os detalhes
    if (!valid) {
        const dataErrors = validate.errors.map(error => `Path: ${error.instancePath} - Error: ${error.message}`).join('\n');
        throw new Error(`Validação dos dados falhou:\n${dataErrors}`);
    }

    // Espera que a validação tenha sido bem-sucedida
    expect(valid).to.be.true;
});

const token = () => window.localStorage.getItem('token')
Cypress.Commands.add('apiLogin', (loginData) => {
    cy.request('POST', 'https://api.qaautomationlabs.com/v1/auth/login', loginData).then((login) => {
        const token = login.body.data.accessToken;
        cy.request({ 
            method: 'GET', 
            url: 'https://api.qaautomationlabs.com/v1/auth/me', 
            headers: { Authorization: `Bearer ${token}` },
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data).to.exist;
        });
    });
});