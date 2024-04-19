const {test, expec} = require('../support')

const data = require('../support/fixtures/tvshows.json')
const {executeSQL} = require('../support/database')

test.beforeAll(async() => {
    await executeSQL(`DELETE from tvshows`)
})


test ('deve cadastrar uma nova serie', async({page}) => {
    const tvshow = data.create

    await page.login.do("admin@zombieplus.com", "pwd123", 'Admin')

    await page.tvshows.create(tvshow)
    await page.popup.haveText(`A série '${tvshow.title}' foi adicionada ao catálogo.`)

    await new Promise(resolve => setTimeout(resolve, 2000))

})

test('deve poder remover uma série', async({page, request}) => {
    const tvshow = data.to_remove
    await request.api.postTvshow(tvshow)

    await page.login.do("admin@zombieplus.com", "pwd123", 'Admin')
    await page.tvshows.remove(tvshow.title)
    await page.popup.haveText('Série removida com sucesso.')

    await new Promise(resolve => setTimeout(resolve, 2000))
})

test('não deve cadastrar série já existente', async({page,request}) => {
    const tvshow = data.duplicate
    await request.api.postTvshow(tvshow)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.create(tvshow)
    await page.popup.haveText(`O título '${tvshow.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`)

    await new Promise(resolve => setTimeout(resolve, 2000))
})

test('não deve cadastrar série quando campos obrigatórios não forem preenchidos', async({page}) => {
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.goTvshow()

    await page.tvshows.goForm()
    await page.tvshows.submit()
    await page.tvshows.alertHaveText([
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório (apenas números)'
    ])

    await new Promise(resolve => setTimeout(resolve, 2000))
})

test('deve realizar a busca por séries com termo zumbi', async({page, request}) => {
    const tvshow = data.search

    tvshow.data.forEach(async (t) => {
        await request.api.postTvshow(t)
        console.log(t.title)
    })

    await page.login.do("admin@zombieplus.com", "pwd123", 'Admin')
    await page.tvshows.goTvshow()
    await page.tvshows.search(tvshow.input)

    await page.tvshows.tableHave(tvshow.outputs)

    await new Promise(resolve => setTimeout(resolve, 2000))
})

