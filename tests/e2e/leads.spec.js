const { test, expect } = require("../support")
const { faker } = require('@faker-js/faker')

test('deve cadastrar um lead na fila de espera', async ({ page }) => {
  const leadName = faker.person.fullName()
  const leadEmail = faker.internet.email()

  await page.landing.visit()
  await page.landing.openLeadModal()
  await page.landing.submitLeadForm(leadName, leadEmail)

  const messageModal = 'Agradecemos por compartilhar seus dados conosco. Em breve, nossa equipe entrará em contato!'// variavel com o texto, espera-se que na classe toast, tenha o texto com a variavel

  await page.toast.containText(messageModal)

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

  await page.landing.visit()
  await page.landing.openLeadModal()
  await page.landing.submitLeadForm(leadName, leadEmail)
  
  await page.landing.visit()
  await page.landing.openLeadModal()
  await page.landing.submitLeadForm(leadName, leadEmail)

  const messageModal = 'O endereço de e-mail fornecido já está registrado em nossa fila de espera.'// variavel com o texto, espera-se que na classe toast, tenha o texto com a variavel

  await page.toast.containText(messageModal)

});

test("não deve cadastrar com email incorreto", async ({ page }) => {
  await page.landing.visit()
  await page.landing.openLeadModal()
  await page.landing.submitLeadForm('Maxwell Kimura', 'maxwell.com')

  await page.landing.alertHaveText('Email incorreto')
});

test("não deve cadastrar sem nome", async ({ page }) => {
  await page.landing.visit()
  await page.landing.openLeadModal()
  await page.landing.submitLeadForm('', 'maxwell@email.com')

  await page.landing.alertHaveText('Campo obrigatório')
});

test("não deve cadastrar sem email", async ({ page }) => {
  await page.landing.visit()
  await page.landing.openLeadModal()
  await page.landing.submitLeadForm('Maxwell Kimura', '')

  await page.landing.alertHaveText('Campo obrigatório')
});

test("não deve cadastrar sem campos obrigatórios preenchidos", async ({page}) => {
  await page.landing.visit()
  await page.landing.openLeadModal()
  await page.landing.submitLeadForm('', '')

  // alert para nome e email, faz um array para esperar que contenha o texto duas vezes
  await page.landing.alertHaveText([
    "Campo obrigatório",
    "Campo obrigatório",
  ])
})


//REVE AULA 9