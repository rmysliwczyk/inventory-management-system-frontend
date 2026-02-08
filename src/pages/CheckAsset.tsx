import { QrScanner } from '../components/QrScanner'
import { AuthContext } from '../context/AuthContext'
import useDelete from '../hooks/useDelete'
import useFetch from '../hooks/useFetch'
import type { AssetDetails } from '../types'
import DeleteIcon from '@mui/icons-material/Delete'
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

export default function CheckAsset() {
	const [showScanner, setShowScanner] = useState<boolean>(true)
	const [assetDetails, setAssetDetails] = useState<AssetDetails | null>(null)
	const [fetchUrl, setFetchUrl] = useState<string>('')
	const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false)
	const auth = useContext(AuthContext)
	const { data, error, loading } = useFetch<AssetDetails>(fetchUrl)
	const {
		deletereq,
		error: deleteError,
		loading: deleteLoading,
	} = useDelete()

	useEffect(() => {
		if (data) {
			setAssetDetails({
				id: data.id,
				description: data.description,
				acquisition_date: data.acquisition_date,
			})
		} else {
			setAssetDetails(null)
		}
	}, [data])

	useEffect(() => {
		if (!deleteLoading) {
			if (!deleteError) {
				handleCloseConfirmDelete()
				setAssetDetails(null)
				setShowScanner(true)
			}
		}
	}, [deleteError, deleteLoading])

	function handleScan(result: ReactQrScanner.IDetectedBarcode[]) {
		setFetchUrl(`/assets/${result[0].rawValue}`)
		setShowScanner(false)
	}

	function handleDelete() {
		deletereq(`/assets/${assetDetails?.id}`)
		setFetchUrl('')
	}

	function resetScanner() {
		setShowScanner(true)
		setAssetDetails(null)
		setFetchUrl('')
	}

	function handleOpenConfirmDelete() {
		setOpenConfirmDelete(true)
	}

	function handleCloseConfirmDelete() {
		setOpenConfirmDelete(false)
	}

	if (!isMobile) {
		return (
			<Box
				component={Card}
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: '20px',
					padding: '20px',
					overflow: 'auto',
					maxWidth: '95%',
				}}
			>
				<Alert severity="info">
					This page is only available on a mobile device
				</Alert>
			</Box>
		)
	} else if (showScanner) {
		return (
			<>
				<Box
					component={Card}
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: '30px',
						padding: '20px',
						overflow: 'auto',
					}}
				>
					<Typography variant="h6">
						Please scan the asset tag
					</Typography>
					<Box>
						<QrScanner onScan={handleScan} />
					</Box>
				</Box>
			</>
		)
	} else {
		return (
			<>
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
									<Box sx={{ minWidth: 200, mb: 2 }}>
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
											minWidth: 240,
											mb: 2,
										}}
									>
										<Typography>
											This action will delete asset with
											ID:
										</Typography>
										<Typography
											variant="subtitle2"
											sx={{ textAlign: 'center' }}
										>
											{assetDetails?.id}
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
						gap: '20px',
						padding: '20px',
						overflow: 'auto',
						maxWidth: '95%',
					}}
				>
					<Typography variant="h5">Asset details:</Typography>
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
					) : assetDetails ? (
						Object.entries(assetDetails).map(([key, value]) => (
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
									{key.toUpperCase().replace('_', ' ')}
								</Typography>
								<Typography
									variant="body2"
									sx={{ flexGrow: '1' }}
								>
									{value ? value : 'None'}
								</Typography>
							</Box>
						))
					) : (
						''
					)}

					<Button onClick={resetScanner}>Scan another</Button>
					{assetDetails && auth?.user?.role == 'ADMIN' && (
						<Button
							color="error"
							variant="outlined"
							onClick={handleOpenConfirmDelete}
							startIcon={<DeleteIcon />}
						>
							Delete
						</Button>
					)}
				</Box>
			</>
		)
	}
}
