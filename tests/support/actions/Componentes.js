const {expect} = require('@playwright/test')

export class PopUp {

    constructor(page) {
        this.page = page
    }
    
    async haveText(message) {
        const element = this.page.locator('.swal2-html-container')

        await expect(element).toHaveText(message)

        await this.page.locator('.swal2-confirm.swal2-styled').click()
  }
}
