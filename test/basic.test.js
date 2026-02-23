import assert from 'assert'
import { Browser, Builder, By } from 'selenium-webdriver'

describe('Basic functionality', function () {
	let driver
	const timestamp = Date.now()
	before(async function () {
		driver = await new Builder().forBrowser(Browser.CHROME).build()
		await driver.manage().setTimeouts({ implicit: 3000 })
	})

	it('Title is as expected', async function () {
		await driver.get('http://127.0.0.1:8000/login')
		let title = await driver.getTitle()
		assert.equal('Inventory Management System', title)
	})

	it('Admin can log in', async function () {
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

	it('Admin can navigate to Asset Type page', async function () {
		let assetTypePageButton = await driver.findElement(
			By.id('asset-types-button')
		)
		await assetTypePageButton.click()
		let addAssetTypeButton = await driver.findElement(
			By.id('add-asset-type-button')
		)
		assert.notEqual(addAssetTypeButton, undefined)
	})

	it('Admin can add new Asset Type', async function () {
		let expectedAssetTypeName = `TestAssetType-${timestamp}`
		let addAssetTypeButton = await driver.findElement(
			By.id('add-asset-type-button')
		)
		await addAssetTypeButton.click()
		let assetNameTextField = await driver.findElement(By.name('name'))
		await assetNameTextField.sendKeys(expectedAssetTypeName)
		let submitButton = await driver.findElement(
			By.name('asset-type-form-submit-button')
		)
		await submitButton.click()
		await driver.sleep(3000)
		let assetTypeCard = await driver.findElement(
			By.css(`[id^=${expectedAssetTypeName}]`)
		)
		let pTag = await assetTypeCard.findElement(
			By.css(`[id^=${expectedAssetTypeName}-name-tag]`)
		)
		let assetTypeName = await pTag.getText()
		assert.equal(expectedAssetTypeName, assetTypeName)
	})

	it('Admin can edit the Asset Type name', async function () {
		let oldAssetTypeName = `TestAssetType-${timestamp}`
		let newAssetTypeName = `NewTestAssetType-${timestamp}`
		let assetTypeCard = await driver.findElement(
			By.css(`[id^=${oldAssetTypeName}]`)
		)
		let editAssetTypeButton = await assetTypeCard.findElement(
			By.css(`[id^=${oldAssetTypeName}-edit-button]`)
		)
		await editAssetTypeButton.click()
		let assetNameTextField = await driver.findElement(By.name('name'))
		await assetNameTextField.clear()
		await assetNameTextField.sendKeys(newAssetTypeName)
		let submitButton = await driver.findElement(
			By.name('asset-type-form-submit-button')
		)
		await submitButton.click()
		await driver.sleep(3000)
		let newAssetTypeCard = await driver.findElement(
			By.css(`[id^=${newAssetTypeName}]`)
		)
		let pTag = await newAssetTypeCard.findElement(By.css('p'))
		let assetTypeName = await pTag.getText()
		assert.equal(newAssetTypeName, assetTypeName)
	})

	it('Admin can delete the Asset Type', async function () {
		let assetTypeName = `NewTestAssetType-${timestamp}`
		let assetTypeCard = await driver.findElement(By.css(`[id^=${assetTypeName}]`))
		let deleteAssetTypeButton = await assetTypeCard.findElement(By.css(`[id^=${assetTypeName}-delete-button]`))
		await deleteAssetTypeButton.click()
		let submitButton = await driver.findElement(By.id('confirm-delete-button'))
		await submitButton.click()
		await driver.sleep(3000)
		let elementExists = driver.findElements(By.css(`[id^=${assetTypeName}]`)).length == 0
		assert.equal(elementExists, false)
	})

	after(async () => await driver.quit())
})
