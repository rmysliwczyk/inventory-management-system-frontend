import type { AssetTypeDetails } from '../types'
import fontkit from '@pdf-lib/fontkit'
import { PDFDocument, rgb } from 'pdf-lib'
import QRCode from 'qrcode'

export async function printLabels(
	assetType: AssetTypeDetails,
	setLabelsError: React.Dispatch<React.SetStateAction<string | undefined>>
) {
	if (assetType?.assets?.length) {
		setLabelsError('')
		try {
			const pdfDoc = await PDFDocument.create()
			const url = 'https://pdf-lib.js.org/assets/ubuntu/Ubuntu-R.ttf'
			const fontBytes = await fetch(url).then((res) => res.arrayBuffer())

			pdfDoc.registerFontkit(fontkit)
			const ubuntuFont = await pdfDoc.embedFont(fontBytes)

			// A4 size in pdf-lib x,y
			const pageSizeX = 595.28
			const pageSizeY = 841.89

			let labelsDrawn = 0
			let rectX = 0
			let rectY = 0
			const labelsHorizontally = 2
			const labelsVertically = 6
			let rectW = pageSizeX / labelsHorizontally
			let rectH = pageSizeY / labelsVertically

			const qrMargin = 10
			const qrHeight = rectH - qrMargin * 2
			const qrWidth = qrHeight

			let page
			for (let asset of assetType.assets) {
				if (labelsDrawn % labelsVertically == 0) {
					rectX += rectW
					rectY = 0
				}
				if (
					labelsDrawn % (labelsHorizontally * labelsVertically) ==
						0 ||
					page === undefined
				) {
					page = pdfDoc.addPage()
					rectX = 0
					rectY = 0
				}
				page.drawRectangle({
					borderColor: rgb(0, 0, 0),
					x: rectX,
					y: rectY,
					width: rectW,
					height: rectH,
				})
				const qrDataURL = await QRCode.toDataURL(asset.id)
				const qrCodeImageBytes = await fetch(qrDataURL).then((res) =>
					res.arrayBuffer()
				)
				const qrCodeImage = await pdfDoc.embedPng(qrCodeImageBytes)

				page.drawImage(qrCodeImage, {
					width: qrWidth,
					height: qrHeight,
					x: rectX + qrMargin,
					y: rectY + qrMargin,
				})
				page.drawText(`${assetType.name}`, {
					x: rectX + qrWidth + qrMargin,
					y: rectY + (qrHeight + qrMargin) / 2,
					font: ubuntuFont,
					size: 10,
				})
				page.drawText(`Acquisition date: ${asset.acquisition_date}`, {
					x: rectX + qrWidth + qrMargin,
					y: rectY + (qrHeight + qrMargin) / 2 - 10,
					font: ubuntuFont,
					size: 10,
				})
				page.drawText(`${assetType.id}`, {
					x: rectX + qrWidth + qrMargin,
					y: rectY + (qrHeight + qrMargin) / 2 - 20,
					font: ubuntuFont,
					size: 6,
				})

				rectY += rectH
				labelsDrawn += 1
			}
			const pdfBytes = await pdfDoc.save()
			const blob = new Blob([new Uint8Array(pdfBytes)], {
				type: 'application/pdf',
			})
			const link = document.createElement('a')
			link.href = URL.createObjectURL(blob)
			link.download = `${assetType.id}-${new Date().toISOString()}.pdf`
			link.click()
		} catch (error) {
			if (error instanceof Error) {
				setLabelsError(`Couldn't print labels ${error.message}`)
			} else {
				setLabelsError("Couldn't print labels")
			}
		}
	} else {
		setLabelsError(
			"Can't print labels of this asset type. Add some assets first."
		)
	}
}
