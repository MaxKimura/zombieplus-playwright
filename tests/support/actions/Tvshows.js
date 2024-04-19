const {expect} = require ('@playwright/test')

export class Tvshows {

    constructor(page){
        this.page = page
    }

    async goTvshow(){
        await this.page.locator('a[href$="tvshows"]').click()
    }

    async goForm(){
        
        await this.page.locator('a[href$="register"]').click()
    }

    async submit(){
        await this.page.getByRole('button', {name: 'Cadastrar'}).click()
    }

    async create(tvshow){
        await this.goTvshow()
        await this.goForm()

        await this.page.locator('#title').fill(tvshow.title)
        await this.page.locator('#overview').fill(tvshow.overview)

        await this.page.locator('#select_company_id .react-select__indicator ').click()

        //obter html no momento do click para elemento flutuante
        const htmlTvshows = await this.page.content()
        console.log(htmlTvshows)

        await this.page.locator('.react-select__option').filter({hasText: tvshow.company }).click()

        await this.page.locator('#select_year .react-select__indicator ').click()
        await this.page.locator('.react-select__option').filter({hasText: tvshow.release_year}).click()

        await this.page.locator('#seasons').fill(tvshow.seasons)

        await this.page.locator('#cover').setInputFiles('tests/support/fixtures' + tvshow.cover)

        if(tvshow.featured) {
            await this.page.locator('.react-switch-handle').check()
        }

        await this.submit()

    }

    async remove(title) {
        await this.goTvshow()
        await this.page.getByRole('row', {name:title}).getByRole('button').click()
        await this.page.locator('.confirm-removal').click()
    }

    async alertHaveText(message) {
        await expect(this.page.locator('.alert')).toHaveText(message)
    }

    async search(target) {
        await this.page.getByPlaceholder('Busque pelo nome')
            .fill(target)

        await this.page.click('.actions button')
    }

    async tableHave(content) {
        const rows = this.page.getByRole('row')
        await expect(rows).toContainText(content)
    }

}