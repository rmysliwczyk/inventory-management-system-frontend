import { QrScanner } from '../components/QrScanner'
import useFetch from '../hooks/useFetch'
import type { AssetDetails, AssetTypeDetails } from '../types'
import DoneOutlineIcon from '@mui/icons-material/DoneOutline'
import PriorityHighIcon from '@mui/icons-material/PriorityHigh'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CircularProgress from '@mui/material/CircularProgress'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import type * as ReactQrScanner from '@yudiel/react-qr-scanner'
import { useContext, useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { useParams } from 'react-router'

export default function TakeStock() {
	const { assetTypeId } = useParams()
	const [takingStockFinished, setTakingStockFinished] =
		useState<boolean>(false)
	const [openModal, setOpenModal] = useState<boolean>(false)
	const [qrCodeError, setQrCodeError] = useState<string | null>(null)
	const [lastScannedAsset, setLastScannedAsset] =
		useState<AssetDetails | null>(null)
	const [scannedAssets, setScannedAssets] = useState<AssetDetails[]>([])
	const [assetsLeftToScan, setAssetsLeftToScan] = useState<AssetDetails[]>([])
	const [assetTypeDetails, setAssetTypeDetails] = useState<AssetTypeDetails>()
	const [assetDetails, setAssetDetails] = useState<AssetDetails>()
	const [fetchAssetUrl, setFetchAssetUrl] = useState<string>('')
	const {
		data: assetTypeData,
		error: assetTypeError,
		loading: assetTypeLoading,
	} = useFetch<AssetTypeDetails>(`/asset-types/${assetTypeId}`)
	const {
		data: assetData,
		error: assetError,
		loading: assetLoading,
	} = useFetch<AssetDetails>(fetchAssetUrl)

	useEffect(() => {
		if (assetTypeData) {
			setAssetTypeDetails(assetTypeData)
			if (assetTypeData.assets) {
				setAssetsLeftToScan(assetTypeData.assets)
			}
		}
	}, [assetTypeData])

	useEffect(() => {
		if (assetTypeDetails && assetTypeDetails.quantity > 0) {
			if (scannedAssets.length == assetTypeDetails.quantity) {
				setTakingStockFinished(true)
			}
		}
	}, [scannedAssets, assetsLeftToScan])

	function handleScan(result: ReactQrScanner.IDetectedBarcode[]) {
		let scannedAsset = assetsLeftToScan.find(
			(asset) => asset.id == result[0].rawValue
		)
		if (scannedAsset) {
			setScannedAssets((prev) => [...prev, scannedAsset])
			setAssetsLeftToScan((prev) =>
				prev.filter((asset) => asset.id != result[0].rawValue)
			)
			setLastScannedAsset({
				id: scannedAsset.id,
				description: scannedAsset.description,
				acquisition_date: scannedAsset.acquisition_date,
			})
			setOpenModal(true)
		} else {
			setQrCodeError(
				"Qr code not recognized. It's not the Qr code of this asset type."
			)
			setOpenModal(true)
		}
	}

	function handleCloseModal() {
		setOpenModal(false)
		setQrCodeError(null)
		setLastScannedAsset(null)
	}

	return (
		<>
			<Modal
				open={openModal}
				onClose={handleCloseModal}
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
							xs: 250,
							sm: 300,
						},
					}}
				>
					<Typography
						id="modal-title"
						sx={{ textAlign: 'center' }}
						variant="h5"
					>
						{qrCodeError
							? 'Qr Code Error'
							: 'Scanned Asset Details'}
					</Typography>
					<Box
						id="modal-description"
						sx={{
							mt: 4,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							gap: '5px',
						}}
					>
						{qrCodeError ? (
							<Alert severity="error">
								The scanned Qr code does not belong to an asset
								of this asset type
							</Alert>
						) : (
							lastScannedAsset &&
							Object.entries(lastScannedAsset).map(
								([key, value]) => (
									<Box
										key={key}
										sx={{
											display: 'flex',
											alignItems: 'flex-start',
											gap: '10px',
											width: '100%',
										}}
									>
										<Typography
											variant="subtitle2"
											sx={{ flexGrow: '1' }}
										>
											{key
												.toUpperCase()
												.replace('_', ' ')}
										</Typography>
										<Typography
											variant="body2"
											sx={{ flexGrow: '1' }}
										>
											{value ? value : 'None'}
										</Typography>
									</Box>
								)
							)
						)}
						<Button variant="contained" onClick={handleCloseModal}>
							Ok
						</Button>
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
				{!isMobile ? (
					<Alert severity="info">
						This page is only available on a mobile device
					</Alert>
				) : assetTypeError ? (
					<Alert severity="error">{assetTypeError}</Alert>
				) : assetTypeDetails?.quantity == 0 ? (
					<Alert severity="error">
						This asset type has no assets. Add some first
					</Alert>
				) : takingStockFinished ? (
					<>
						<Typography variant="h6" sx={{ textAlign: 'Center' }}>
							Finished taking stock of asset:
						</Typography>
						<Typography variant="h4">
							{assetTypeDetails
								? assetTypeDetails?.name
								: 'Loading...'}
						</Typography>
						<Typography variant="subtitle2">
							Scanned {scannedAssets.length} out of{' '}
							{assetTypeDetails
								? assetTypeDetails.quantity
								: 'Loading...'}{' '}
							total assets
						</Typography>
						{scannedAssets.length == assetTypeDetails?.quantity ? (
							<Typography
								variant="h5"
								color="success"
								sx={{ textAlign: 'center' }}
							>
								<DoneOutlineIcon /> All assets accounted for
							</Typography>
						) : (
							<Typography
								variant="h5"
								color="warning"
								sx={{ textAlign: 'center' }}
							>
								<PriorityHighIcon /> Not all assets were scanned
							</Typography>
						)}
					</>
				) : (
					<>
						<Typography variant="h6">
							Taking stock of asset type:
						</Typography>
						<Typography variant="h4">
							{assetTypeDetails
								? assetTypeDetails?.name
								: 'Loading...'}
						</Typography>
						<Typography variant="subtitle2">
							Scanned {scannedAssets.length} out of{' '}
							{assetTypeDetails
								? assetTypeDetails.quantity
								: 'Loading...'}{' '}
							total assets
						</Typography>
						<Box>
							{assetTypeDetails ? (
								<QrScanner
									onScan={handleScan}
									paused={
										qrCodeError != null ||
										lastScannedAsset != null
									}
								/>
							) : (
								<CircularProgress />
							)}
						</Box>
						{scannedAssets.length > 0 && (
							<Button
								variant="contained"
								onClick={function () {
									setTakingStockFinished(true)
								}}
							>
								{' '}
								Finish taking stock{' '}
							</Button>
						)}
					</>
				)}
			</Box>
		</>
	)
}
