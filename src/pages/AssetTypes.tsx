import useFetch from '../hooks/useFetch'
import usePost from '../hooks/usePost'
import type { AssetTypeDetails, NewAssetTypeDetails } from '../types'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import fontkit from '@pdf-lib/fontkit'
import { PDFDocument, rgb } from 'pdf-lib'
import QRCode from 'qrcode'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import AssetTypeForm from '../components/AssetTypeForm'
import Modal from '@mui/material/Modal'

export default function AssetTypes() {
	const navigate = useNavigate()
	const [openForm, setOpenForm] = useState<boolean>(false)
	const [assetTypes, setAssetTypes] = useState<AssetTypeDetails[] | []>()
	const [fetchUrl, setFetchUrl] = useState<string>('/asset-types')
	const [labelsError, setLabelsError] = useState<string>()
	const { refetch, data, error, loading } = useFetch<AssetTypeDetails[]>(fetchUrl)
	const { post, data: postData, error: postError, loading: postLoading } = usePost<NewAssetTypeDetails>()

	useEffect(() => {
		if (data) {
			setAssetTypes(data)
		}
	}, [data])

	useEffect(() => {
		if(postData) {
			handleCloseForm()
			refetch()
		}
	}, [postData])

	function handleOpenForm() {
		setOpenForm(true)
	}

	function handleCloseForm() {
		setOpenForm(false)
	}

	function handleSubmit(data: NewAssetTypeDetails) {
		post("/asset-types", data)
	}

	async function printLabels(assetType: AssetTypeDetails) {
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

	return (
		<>
			<Modal
				open={openForm}
				onClose={handleCloseForm}
				aria-labelledby="modal-title"
				aria-describedby="modal-description"
			>
				<Box sx={{
						position: 'absolute',
						top: '40%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						bgcolor: 'background.paper',
						padding: '20px',
						borderRadius: '15px',
						minWidth: {
							xs: 200,
							sm: 300,
						},
						minHeight: {
							xs: 100,
							sm: 200
						}
					}}
				>
					<Typography id="modal-title" sx={{textAlign: "center"}} variant="h5">
						Add asset type
					</Typography>
					<Box id="modal-description" sx={{mt: 4}}>
						<AssetTypeForm onSubmit={handleSubmit} />
					</Box>
				</Box>
			</Modal>
			<Box
				component={Card}
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: '15px',
					padding: '20px',
					overflow: 'auto',
					width: '95%',
					minHeight: '70vh',
				}}
			>
				<Typography variant="h5">Asset types:</Typography>
				{labelsError && <Alert severity="info">{labelsError}</Alert>}
				<Button variant="outlined" onClick={handleOpenForm}>Add asset type</Button>
				{loading ? (
					<Box
						sx={{
							width: '100%',
							height: '100%',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<CircularProgress />
					</Box>
				) : error ? (
					<Alert severity="error">{error}</Alert>
				) : assetTypes ? (
					assetTypes.map((element) => (
						<Grid
							component={Card}
							key={element.id}
							container
							spacing={1}
							sx={{
								alignItems: 'left',
								width: '90%',
								padding: '10px',
							}}
						>
							{Object.entries(element).map(
								([key, value]) =>
									key !== 'assets' && (
										<Grid size={{ xs: 4, sm: 3 }} key={key}>
											<Typography variant="h6">
												{key.toUpperCase()}
											</Typography>
											<Typography variant="body2">
												{value}
											</Typography>
										</Grid>
									)
							)}
							<Grid size={{ xs: 12, sm: 3 }}>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'row',
										justifyContent: 'center',
										gap: '5px',
										height: '100%',
									}}
								>
									<Button variant="outlined" fullWidth={true}>
										Take stock
									</Button>
									<Button
										variant="outlined"
										fullWidth={true}
										onClick={function () {
											printLabels(element)
										}}
									>
										Print labels
									</Button>
								</Box>
							</Grid>
						</Grid>
					))
				) : (
					''
				)}
			</Box>
		</>
	)
}
