import assert from 'assert'
import { Browser, Builder, By } from 'selenium-webdriver'

describe('Basic functionality', function () {
	let driver
	before(async function () {
		driver = await new Builder().forBrowser(Browser.CHROME).build()
		await driver.manage().setTimeouts({ implicit: 5000 })
	})

	it('Title is as expected', async function() {
		await driver.get('http://127.0.0.1:8000/login');
		let title = await driver.getTitle();
		assert.equal("Inventory Management System", title);
		});

	it('User can log in', async function () {
		let usernameTextBox = await driver.findElement(By.name('username'))
		let passwordTextBox = await driver.findElement(By.name('password'))
		let submitButton = await driver.findElement(By.css('button'))

		await usernameTextBox.sendKeys('user')
		await passwordTextBox.sendKeys('user')
		await submitButton.click()

		let message = await driver.findElement(By.css('h5'))
		let messageText = await message.getText()
		assert.equal(
			'Welcome to Inventory Management System. Please select the desired page from the navbar.',
			messageText
		)
	})

	it('User can navigate to Asset Type page', async function () {
		let buttons = await driver.findElements(By.css('button'))
		let assetTypePageButton
		for (let button of buttons) {
			if ((await button.getText()) == 'ASSET TYPE') {
				assetTypePageButton = button
				await assetTypePageButton.click()
				let message = await driver.findElement(By.css('h5'))
				let messageText = await message.getText()
				assert.equal('Asset types:', messageText)
			}
		}
	})

	after(async () => await driver.quit())
})
