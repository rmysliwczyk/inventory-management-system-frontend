import AssetForm from '../components/AssetForm'
import AssetTypeForm from '../components/AssetTypeForm'
import { AuthContext } from '../context/AuthContext'
import useDelete from '../hooks/useDelete'
import useFetch from '../hooks/useFetch'
import usePost from '../hooks/usePost'
import type {
	AssetTypeDetails,
	NewAssetDetails,
	NewAssetTypeDetails,
} from '../types'
import DeleteIcon from '@mui/icons-material/Delete'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import fontkit from '@pdf-lib/fontkit'
import Dayjs from 'dayjs'
import { PDFDocument, rgb } from 'pdf-lib'
import QRCode from 'qrcode'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

export default function AssetTypes() {
	const navigate = useNavigate()
	const [openAddAssetTypeForm, setOpenAddAssetTypeForm] =
		useState<boolean>(false)
	const [openAddAssetForm, setOpenAddAssetForm] = useState<boolean>(false)
	const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false)
	const [assetTypeIdToDelete, setAssetTypeIdToDelete] = useState<
		string | null
	>(null)
	const [assetTypeToAddAssetTo, setAssetTypeToAddAssetTo] =
		useState<AssetTypeDetails | null>(null)
	const [assetTypes, setAssetTypes] = useState<AssetTypeDetails[] | []>()
	const [fetchUrl, setFetchUrl] = useState<string>('/asset-types')
	const [labelsError, setLabelsError] = useState<string>()
	const auth = useContext(AuthContext)
	const { refetch, data, error, loading } =
		useFetch<AssetTypeDetails[]>(fetchUrl)
	const {
		post: postAssetType,
		reset: postAssetTypeReset,
		data: postDataAssetType,
		error: postErrorAssetType,
		loading: postLoadingAssetType,
	} = usePost<NewAssetTypeDetails>()
	const {
		post: postAsset,
		reset: postAssetReset,
		data: postDataAsset,
		error: postErrorAsset,
		loading: postLoadingAsset,
	} = usePost<NewAssetDetails>()
	const {
		deletereq,
		error: deleteError,
		loading: deleteLoading,
	} = useDelete()

	useEffect(() => {
		if (data) {
			setAssetTypes(data)
		}
	}, [data])

	useEffect(() => {
		if (postDataAssetType) {
			handleCloseAddAssetTypeForm()
			refetch()
		}
	}, [postDataAssetType])

	useEffect(() => {
		if (postDataAsset) {
			handleCloseAddAssetForm()
			refetch()
		}
	}, [postDataAsset])

	useEffect(() => {
		if (!deleteLoading) {
			if (!deleteError) {
				handleCloseConfirmDelete()
				refetch()
			}
		}
	}, [deleteError, deleteLoading])

	function handleOpenAddAssetTypeForm() {
		setOpenAddAssetTypeForm(true)
	}

	function handleCloseAddAssetTypeForm() {
		setOpenAddAssetTypeForm(false)
		postAssetTypeReset()
	}

	function handleOpenAddAssetForm(element: AssetTypeDetails) {
		setAssetTypeToAddAssetTo(element)
		setOpenAddAssetForm(true)
	}

	function handleCloseAddAssetForm() {
		setOpenAddAssetForm(false)
		postAssetReset()
		setAssetTypeToAddAssetTo(null)
	}

	function handleOpenConfirmDelete(element: AssetTypeDetails) {
		setOpenConfirmDelete(true)
		setAssetTypeIdToDelete(element.id)
	}

	function handleCloseConfirmDelete() {
		setOpenConfirmDelete(false)
		setAssetTypeIdToDelete(null)
	}

	function handleSubmitAssetType(data: NewAssetTypeDetails) {
		setAssetTypes([])
		postAssetType('/asset-types', data)
	}

	function handleSubmitAsset(data: NewAssetDetails) {
		if (data.acquisition_date instanceof Dayjs && assetTypeToAddAssetTo) {
			data.acquisition_date = data.acquisition_date.format('YYYY-MM-DD')
			data.asset_type_id = assetTypeToAddAssetTo?.id
			postAsset('/assets', data)
		}
	}

	function handleDelete() {
		setAssetTypes([])
		deletereq(`/asset-types/${assetTypeIdToDelete}`)
	}

	async function printLabels(assetType: AssetTypeDetails) {
		if (assetType?.assets?.length) {
			setLabelsError('')
			try {
				const pdfDoc = await PDFDocument.create()
				const url = 'https://pdf-lib.js.org/assets/ubuntu/Ubuntu-R.ttf'
				const fontBytes = await fetch(url).then((res) =>
					res.arrayBuffer()
				)

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
					const qrCodeImageBytes = await fetch(qrDataURL).then(
						(res) => res.arrayBuffer()
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
					page.drawText(
						`Acquisition date: ${asset.acquisition_date}`,
						{
							x: rectX + qrWidth + qrMargin,
							y: rectY + (qrHeight + qrMargin) / 2 - 10,
							font: ubuntuFont,
							size: 10,
						}
					)
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
				open={openAddAssetTypeForm}
				onClose={handleCloseAddAssetTypeForm}
				aria-labelledby="modal-title"
				aria-describedby="modal-description"
			>
				<Box
					sx={{
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
							sm: 200,
						},
					}}
				>
					<Typography
						id="modal-title"
						sx={{ textAlign: 'center' }}
						variant="h5"
					>
						Add asset type
					</Typography>
					<Box id="modal-description" sx={{ mt: 4 }}>
						<AssetTypeForm onSubmit={handleSubmitAssetType} />
					</Box>
				</Box>
			</Modal>
			<Modal
				open={openAddAssetForm}
				onClose={handleCloseAddAssetForm}
				aria-labelledby="modal-title"
				aria-describedby="modal-description"
			>
				<Box
					sx={{
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
					}}
				>
					<Typography
						id="modal-title"
						sx={{ textAlign: 'center' }}
						variant="h5"
					>
						Add asset
					</Typography>
					<Box id="modal-description" sx={{ mt: 4 }}>
						{postErrorAsset ? (
							<Alert severity="error">{postErrorAsset}</Alert>
						) : (
							<AssetForm onSubmit={handleSubmitAsset} />
						)}
					</Box>
				</Box>
			</Modal>
			<Modal
				open={openConfirmDelete}
				onClose={handleCloseConfirmDelete}
				aria-labelledby="modal-title"
				aria-describedby="modal-description"
			>
				<Box
					sx={{
						position: 'absolute',
						top: '40%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						bgcolor: 'background.paper',
						padding: '20px',
						borderRadius: '15px',
						maxWidth: 400,
					}}
				>
					<Typography
						id="modal-title"
						sx={{ textAlign: 'center' }}
						variant="h5"
					>
						Are you sure?
					</Typography>
					<Box id="modal-description" sx={{ mt: 4 }}>
						{deleteError ? (
							<>
								<Box sx={{ mb: 2 }}>
									<Alert severity="error">
										{deleteError}
									</Alert>
								</Box>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'row',
										justifyContent: 'center',
										gap: '5px',
									}}
								>
									<Button
										variant="contained"
										onClick={handleCloseConfirmDelete}
									>
										Ok
									</Button>
								</Box>
							</>
						) : (
							<>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										minWidth: 300,
										mb: 2,
									}}
								>
									<Typography>
										This action will delete asset type with
										ID:
									</Typography>
									<Typography
										variant="subtitle2"
										sx={{ textAlign: 'center' }}
									>
										{assetTypeIdToDelete}
									</Typography>
								</Box>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'row',
										justifyContent: 'center',
										gap: '5px',
									}}
								>
									<Button
										variant="contained"
										onClick={handleDelete}
									>
										Yes
									</Button>
									<Button
										variant="outlined"
										onClick={handleCloseConfirmDelete}
									>
										No
									</Button>
								</Box>
							</>
						)}
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
				<Button variant="outlined" onClick={handleOpenAddAssetTypeForm}>
					Add asset type
				</Button>
				{loading || postLoadingAssetType || deleteLoading || !data ? (
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
								width: '100%',
								padding: '10px',
								mb: 1,
							}}
						>
							{Object.entries(element).map(
								([key, value]) =>
									key !== 'assets' && (
										<Grid
											size={{
												xs: 4,
												sm: 4,
												md: 4,
												lg: 3,
											}}
											key={key}
											sx={{ textAlign: 'center' }}
										>
											<Typography>
												{key.toUpperCase()}
											</Typography>
											<Typography variant="body2">
												{value}
											</Typography>
										</Grid>
									)
							)}
							<Grid size={{ xs: 12, sm: 12, md: 12, lg: 3 }}>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'row',
										justifyContent: 'center',
										gap: '5px',
										height: '100%',
									}}
								>
									<Button
										variant="outlined"
										fullWidth={true}
										onClick={function () {
											handleOpenAddAssetForm(element)
										}}
									>
										Add asset
									</Button>
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
									{auth?.user?.role == 'ADMIN' && (
										<Button
											variant="outlined"
											fullWidth={true}
											onClick={function () {
												handleOpenConfirmDelete(element)
											}}
										>
											<DeleteIcon />
										</Button>
									)}
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
