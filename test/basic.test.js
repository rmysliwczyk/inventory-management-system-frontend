import assert from 'assert'
import { Browser, Builder, By } from 'selenium-webdriver'

describe('Basic functionality', function () {
	let driver
	const timestamp = Date.now()
	before(async function () {
		driver = await new Builder().forBrowser(Browser.CHROME).build()
		await driver.manage().setTimeouts({ implicit: 10000 })
	})

	it('Title is as expected', async function () {
		await driver.get('http://127.0.0.1:8000/login')
		let title = await driver.getTitle()
		assert.equal('Inventory Management System', title)
	})

	it('User can log in', async function () {
		let usernameTextBox = await driver.findElement(By.name('username'))
		let passwordTextBox = await driver.findElement(By.name('password'))
		let submitButton = await driver.findElement(By.css('button'))

		await usernameTextBox.sendKeys('admin')
		await passwordTextBox.sendKeys('admin')
		await submitButton.click()

		let message = await driver.findElement(By.css('h5'))
		let messageText = await message.getText()
		assert.equal(
			'Welcome to Inventory Management System. Please select the desired page from the navbar.',
			messageText
		)
	})

	it('User can navigate to Asset Type page', async function () {
		let assetTypePageButton = await driver.findElement(
			By.id('asset-types-button')
		)
		await assetTypePageButton.click()
		let addAssetTypeButton = await driver.findElement(By.id('add-asset-type-button'))
		assert.notEqual(addAssetTypeButton, undefined)
	})

	it('User can add new Asset Type', async function () {
		let expectedAssetTypeName = `TestAssetType-${timestamp}`
		let addAssetTypeButton = await driver.findElement(By.id('add-asset-type-button'))
		await addAssetTypeButton.click()
		let assetNameTextField = await driver.findElement(By.name('name'))
		await assetNameTextField.sendKeys(expectedAssetTypeName)
		let submitButton = await driver.findElement(
			By.name('asset-type-form-submit-button')
		)
		await submitButton.click()
		await driver.sleep(3000)
		let assetTypeCard = await driver.findElement(By.css(`[id^=${expectedAssetTypeName}]`))
		let pTag = await assetTypeCard.findElement(By.css(`[id^=${expectedAssetTypeName}-name-tag]`))
		let assetTypeName = await pTag.getText()
		assert.equal(expectedAssetTypeName, assetTypeName)
	})

	it('User can edit the Asset Type name', async function () {
		let oldAssetTypeName = `TestAssetType-${timestamp}`
		let newAssetTypeName = `NewTestAssetType-${timestamp}`
		let assetTypeCard = await driver.findElement(By.css(`[id^=${oldAssetTypeName}]`))
		let editAssetTypeButton = await assetTypeCard.findElement(By.css(`[id^=${oldAssetTypeName}-edit-button]`))
		await editAssetTypeButton.click()
		let assetNameTextField = await driver.findElement(By.name('name'))
		await assetNameTextField.clear()
		await assetNameTextField.sendKeys(newAssetTypeName)
		let submitButton = await driver.findElement(By.name('asset-type-form-submit-button'))
		await submitButton.click()
		await driver.sleep(3000)
		let newAssetTypeCard = await driver.findElement(By.css(`[id^=${newAssetTypeName}]`))
		let pTag = await newAssetTypeCard.findElement(By.css('p'))
		let assetTypeName = await pTag.getText()
		assert(newAssetTypeName, assetTypeName)
	})

	after(async () => await driver.quit())
})
