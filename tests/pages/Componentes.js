const {expect} = require('@playwright/test')

export class Toast {

    constructor(page) {
        this.page = page
    }
    
    async containText(messageModal) {
        const toast = this.page.locator(".toast");

        await expect(toast).toContainText(messageModal);
        await expect(toast).not.toBeVisible({ timeout: 5000 }); //o modal da classe toast tem que sumir (tobehidden) em até 5 segundos
  }
}
