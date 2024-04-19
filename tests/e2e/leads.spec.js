const { test, expect } = require("../support")
const { faker } = require('@faker-js/faker')
const { executeSQL } = require('../support/database')

test.beforeAll(async() => {
  await executeSQL(`DELETE from leads`)
})

test('deve cadastrar um lead na fila de espera', async ({ page }) => {
  const leadName = faker.person.fullName()
  const leadEmail = faker.internet.email()

  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm(leadName, leadEmail)
  
  const message = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato.'
  await page.popup.haveText(message)

});

test('não deve cadastrar quando o email já existe', async ({ page, request }) => {
  const leadName = faker.person.fullName()
  const leadEmail = faker.internet.email()
  
  // cria uma const com o envio da requisição para gerar os dados name e email
  const newLead = await request.post('http://localhost:3333/leads', {
    data: {
      name: leadName,
      email: leadEmail
    }
  })

  //verifica o status code é da familia 200 (sucesso) e verdadeiro
  await expect(newLead.ok()).toBeTruthy()

  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm(leadName, leadEmail)
  
  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm(leadName, leadEmail)

  const message = 'Verificamos que o endereço de e-mail fornecido já consta em nossa lista de espera. Isso significa que você está um passo mais perto de aproveitar nossos serviços.'

  await page.popup.haveText(message)

});

test("não deve cadastrar com email incorreto", async ({ page }) => {
  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm('Maxwell Kimura', 'maxwell.com')

  await page.leads.alertHaveText('Email incorreto')
});

test("não deve cadastrar sem nome", async ({ page }) => {
  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm('', 'maxwell@email.com')

  await page.leads.alertHaveText('Campo obrigatório')
});

test("não deve cadastrar sem email", async ({ page }) => {
  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm('Maxwell Kimura', '')

  await page.leads.alertHaveText('Campo obrigatório')
});

test("não deve cadastrar sem campos obrigatórios preenchidos", async ({page}) => {
  await page.leads.visit()
  await page.leads.openLeadModal()
  await page.leads.submitLeadForm('', '')

  // alert para nome e email, faz um array para esperar que contenha o texto duas vezes
  await page.leads.alertHaveText([
    "Campo obrigatório",
    "Campo obrigatório",
  ])
})


//REVE AULA 9