describe('Suite de Testes de Produtos GET - /products', () => {
  it('QAProd-01 - Verificar contrato da API de produtos', () => {
    const schemaProdutos = require('../../schemas/get-produtos-schema.json');
    cy.env(['apiUrl']).then(({ apiUrl }) => {
      cy.request({ method: 'GET', url: `${apiUrl}/products/1`, failOnStatusCode: false }).then((response) => {
        expect(response.status).to.eq(200);
        cy.validateSchema(response.body,schemaProdutos);
      });
    });
  });

  it('QAProd-02 - Verificar se o campo moeda possui as moedas aceitas', () => {
    cy.env(['apiUrl']).then(({ apiUrl }) => {
      cy.request( `${apiUrl}/products/1`).its('body').then((response) =>{
        expect(response.data.currency).to.be.oneOf(['USD', 'EUR', 'GBP']);  
      });
    });
  });

  it('QAProd-03 - Verificar retorno código 200 na API de pesquisa de produtos', () => {
    cy.env(['apiUrl']).then(({ apiUrl }) => {
      cy.request({ method: 'GET', url: `${apiUrl}/products/1`, failOnStatusCode: false }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('data');
      });
    });
  });

  it('QAProd-04 - Verificar retorno código 404 quando um id de produto não é encontrado', () => {
    cy.env(['apiUrl']).then(({ apiUrl }) => {
      cy.request({ method: 'GET', url: `${apiUrl}/products/0`, failOnStatusCode: false }).then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.have.property('error');
        expect(response.body.error.message).to.be.eq('Product with id 0 was not found.');
      });
    });
  });

});  

describe('Suite de Testes de Produtos - POST /products', () => {
  const productFixture = require('../../fixtures/produto-api.json');

  //Está API possui um bug em que ele aceita valor número em campo string vice e versa

  it('QAProd05 - Verificar retorno ao adicionar produto na base de dados', () => {
    cy.env(['apiUrl']).then(({ apiUrl }) => {
      cy.request({ 
        method: 'POST', 
        url: `${apiUrl}/products`, 
        body: productFixture.produto_teclado, 
        failOnStatusCode: false }).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.have.property('data');
        });
    });
  });

  it('QAProd06 - Verificar cadastro de produto quando o campo nome não é informado', () => {
    cy.env(['apiUrl']).then(({ apiUrl }) => {
      cy.request({ 
        method: 'POST', 
        url: `${apiUrl}/products`, 
        body: productFixture.produto_faltando_campo_name, 
        failOnStatusCode: false }).then((response) => {
          expect(response.status).to.eq(422);
          expect(response.body).to.have.property('error');
          expect(response.body.error.message).to.be.eq('One or more fields failed validation.');
          expect(response.body.error.details[0].field).to.be.eq('name');
          expect(response.body.error.details[0].message).to.be.eq('name is required');
        });
    });
  });

  it('QAProd07 - Verificar cadastro de produto quando o campo preço não é informado', () => {
    cy.env(['apiUrl']).then(({ apiUrl }) => {
      cy.request({ 
        method: 'POST', 
        url: `${apiUrl}/products`, 
        body: productFixture.produto_faltando_campo_price, 
        failOnStatusCode: false }).then((response) => {
          expect(response.status).to.eq(422);
          expect(response.body).to.have.property('error');
          expect(response.body.error.message).to.be.eq('One or more fields failed validation.');
          expect(response.body.error.details[0].field).to.be.eq('price');
          expect(response.body.error.details[0].message).to.be.eq('price is required');
        });
    });
  });

  it('QAProd08 - Verificar cadastro com o campo nome vazio', () => {
    cy.env(['apiUrl']).then(({ apiUrl }) => {
      cy.request({ 
        method: 'POST', 
        url: `${apiUrl}/products`, 
        body: productFixture.produto_campo_name_vazio, 
        failOnStatusCode: false }).then((response) => {
          expect(response.status).to.eq(422);
          expect(response.body).to.have.property('error');
          expect(response.body.error.message).to.be.eq('One or more fields failed validation.');
          expect(response.body.error.details[0].field).to.be.eq('name');
          expect(response.body.error.details[0].message).to.be.eq('name is required');
        });
    });
  });

  it('QAProd09 - Executar POST com o campo preço vazio', () => {
    cy.env(['apiUrl']).then(({ apiUrl }) => {
      cy.request({ 
        method: 'POST', 
        url: `${apiUrl}/products`, 
        body: productFixture.produto_campo_price_vazio, 
        failOnStatusCode: false }).then((response) => {
          expect(response.status).to.eq(422);
          expect(response.body).to.have.property('error');
          expect(response.body.error.message).to.be.eq('One or more fields failed validation.');
          expect(response.body.error.details[0].field).to.be.eq('price');
          expect(response.body.error.details[0].message).to.be.eq('price is required');
        });
    });
  });

});

describe('Suite de Testes de Produtos - PUT /products', () => {
  const productFixture = require('../../fixtures/produto-api.json');
  
  it('QAProd10 - Alterar produto na base de dados alteração de todos os campos', () => {
    cy.env(['apiUrl']).then(({ apiUrl }) => {
      cy.request({ 
        method: 'PUT', 
        url: `${apiUrl}/products/3`, 
        body: productFixture.produto_teste_alteracao, 
        failOnStatusCode: false }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.data.id).to.be.eq(3);
          expect(response.body.data.name).to.be.eq(productFixture.produto_teste_alteracao.name);
          expect(response.body.data.price).to.be.eq(productFixture.produto_teste_alteracao.price);
          expect(response.body.data.category).to.be.eq(productFixture.produto_teste_alteracao.category);
          expect(response.body.data.stock).to.be.eq(productFixture.produto_teste_alteracao.stock);
        });
      });  
  });

  it('QAProd11 - Alterar produto na base de dados alteração de somente o nome ', () => {
    cy.env(['apiUrl']).then(({ apiUrl }) => {
      cy.request({ 
        method: 'PUT', 
        url: `${apiUrl}/products/3`, 
        body: productFixture.produto_teste_alteracao_somente_campo_name, 
        failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data.id).to.be.eq(3);
            expect(response.body.data.name).to.be.eq(productFixture.produto_teste_alteracao_somente_campo_name.name);
        });
      });
  });

  it('QAProd12 - Alterar produto na base de dados alteração de somente o preço ', () => {
    cy.env(['apiUrl']).then(({ apiUrl }) => {
      cy.request({ 
        method: 'PUT', 
        url: `${apiUrl}/products/3`, 
        body: productFixture.produto_teste_alteracao_somente_campo_price, 
        failOnStatusCode: false }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.data.id).to.be.eq(3);
            expect(response.body.data.price).to.be.eq(productFixture.produto_teste_alteracao_somente_campo_price.price);
        });
      });
  });

});

describe('Suite de Testes de Produtos - DELETE /products', () => {
  it('QAProd13 - Apagar produto da base de dados', () => {
    cy.env(['apiUrl']).then(({ apiUrl }) => {
      cy.request({ 
        method: 'DELETE', 
        url: `${apiUrl}/products/3`,  
        failOnStatusCode: false }).then((response) => {
          expect(response.status).to.eq(204);
        });
    });
  });

  it('QAProd14 - Id de produto não encontrado para deleção', () => {
    cy.env(['apiUrl']).then(({ apiUrl }) => {
      cy.request({ 
        method: 'DELETE', 
        url: `${apiUrl}/products/0`,  
        failOnStatusCode: false }).then((response) => {
          expect(response.status).to.eq(404);
        });
    });
  });

  it('QAProd15 - Sem permissão para deleção', () => {
    cy.env(['apiUrl']).then(({ apiUrl }) => {
      cy.request({ 
        method: 'DELETE', 
        url: `${apiUrl}/products/`,  
        failOnStatusCode: false }).then((response) => {
          expect(response.status).to.eq(405);
        });
    });
  });

});  

