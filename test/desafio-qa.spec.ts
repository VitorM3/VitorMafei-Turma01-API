import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker';
import * as fakerBr from 'faker-br'

describe('Desafio QA', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://api-desafio-qa.onrender.com';
  p.request.setDefaultTimeout(30000);
  let id = '';
  let productId = '';
  let employeeId = ''

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('Company API', () => {
    const urlApi = `${baseUrl}/company`
    it('New Company', async () => {
        const companyName = faker.internet.userName()
        const company = await p
          .spec()
          .post(`${urlApi}`)
          .expectStatus(201)
          .withJson({
            name: companyName,
            cnpj: fakerBr.br.cnpj(),
            state: "SC",
            city: 'CRICIUMA',
            address: 'Rua Luiz Gonzaga Cavanholi,65',
            sector: 'Administrativo'
          }).expectBodyContains(companyName)
          id = company.body.id
    });

    it('List Companies', async () => {
        await p
          .spec()
          .get(`${urlApi}`)
          .expectStatus(StatusCodes.OK)
    });

    it('Update Company', async () => {
        const companyName = faker.internet.userName()
        await p
          .spec()
          .put(`${urlApi}/${id}`)
          .expectStatus(StatusCodes.OK)
          .withJson({
            name: companyName,
            cnpj: fakerBr.br.cnpj(),
            state: "SC",
            city: 'CRICIUMA',
            address: 'Rua Luiz Gonzaga Cavanholi,65',
            sector: 'Administrativo'
          })
          .expectBodyContains(companyName)
    });

    it('Get One Company', async () => {
        await p
          .spec()
          .get(`${urlApi}/${id}`)
          .expectStatus(StatusCodes.OK)
    });

    it('Add Product in company', async () => {
        const productName = faker.commerce.product()
        const product = await p
          .spec()
          .post(`${urlApi}/${id}/products`)
          .expectStatus(201)
          .withJson({
                "productName": productName,
                "productDescription": "Bem legal",
                "price": 20
          }).expectBodyContains(productName)
          productId = product.body.product.productId
    });

    it('Get Products in Company', async () => {
        await p
          .spec()
          .get(`${urlApi}/${id}/products/`)
          .expectStatus(StatusCodes.OK)
    });

    it('Should returns not found in find one product of company by id product', async () => {
        await p
          .spec()
          .get(`${urlApi}/${id}/products/${productId}`)
          .expectStatus(StatusCodes.NOT_FOUND)
    });

    it('Should returns not found in update one product of company by id product', async () => {
        const productName = faker.commerce.product()
        await p
          .spec()
          .put(`${urlApi}/${id}/products/${productId}`)
          .expectStatus(StatusCodes.NOT_FOUND)
          .withJson({
            "productName": productName,
            "productDescription": "Bem legal",
            "price": 20
      })
    });

    it('Should returns not found in delete one product of company by id product', async () => {
        await p
          .spec()
          .delete(`${urlApi}/${id}/products/${productId}`)
          .expectStatus(StatusCodes.NOT_FOUND)
    });

    it('Create Employee in Company', async () => {
        const employeeName = faker.internet.userName()
       const response = await p
          .spec()
          .post(`${urlApi}/${id}/employees`)
          .withBody({
            "name": employeeName,
            "position": "Funcionário",
            "email": faker.internet.email()
          })
          .expectStatus(201)
          .expectBodyContains(employeeName)
          employeeId = response.body.employees.employeeId
    });

    it('Should returns not found in get one employee of company by id employee', async () => {
        await p
          .spec()
          .get(`${urlApi}/${id}/employees/${employeeId}`)
          .expectStatus(StatusCodes.NOT_FOUND)
    });

    it('Should returns not found in update one employee of company by id employee', async () => {
        await p
          .spec()
          .put(`${urlApi}/${id}/employees/${employeeId}`)
          .withBody({
            "name": faker.internet.userName(),
            "position": "Funcionário",
            "email": faker.internet.email()
          })
          .expectStatus(StatusCodes.NOT_FOUND)
    });

    it('Should returns not found in delete one employee of company by id employee', async () => {
        await p
          .spec()
          .delete(`${urlApi}/${id}/employees/${employeeId}`)
          .expectStatus(StatusCodes.NOT_FOUND)
    });


    it('List all employees of company', async () => {
        await p
          .spec()
          .get(`${urlApi}/${id}/employees`)
          .expectStatus(StatusCodes.OK)
    });




    it('Delete Company', async () => {
        await p
          .spec()
          .delete(`${urlApi}/${id}`)
          .expectStatus(StatusCodes.OK)
    });
  })
})