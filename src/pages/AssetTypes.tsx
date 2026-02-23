import AssetForm from '../components/AssetForm'
import AssetTypeForm from '../components/AssetTypeForm'
import { AuthContext } from '../context/AuthContext'
import useDelete from '../hooks/useDelete'
import useFetch from '../hooks/useFetch'
import usePost from '../hooks/usePost'
import usePut from '../hooks/usePut'
import type {
	AssetTypeDetails,
	NewAssetDetails,
	NewAssetTypeDetails,
} from '../types'
import { printLabels } from '../utils/printLabels'
import DeleteIcon from '@mui/icons-material/Delete'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import Dayjs from 'dayjs'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

type ModalContent =
	| 'addAssetType'
	| 'editAssetType'
	| 'addAsset'
	| 'confirmDelete'
	| 'noAssetsForLabels'

export default function AssetTypes() {
	const navigate = useNavigate()
	const [openModal, setOpenModal] = useState<boolean>(false)
	const [modalContent, setModalContent] = useState<ModalContent | null>(null)

	const [assetTypeToEdit, setAssetTypeToEdit] =
		useState<AssetTypeDetails | null>(null)
	const [assetTypeToAddAssetTo, setAssetTypeToAddAssetTo] =
		useState<AssetTypeDetails | null>(null)
	const [assetTypeIdToDelete, setAssetTypeIdToDelete] = useState<
		string | null
	>(null)
	const [assetTypes, setAssetTypes] = useState<AssetTypeDetails[] | []>()
	const [fetchUrl] = useState<string>('/asset-types')
	const [labelsError, setLabelsError] = useState<string>()
	const auth = useContext(AuthContext)
	const { refetch, data, error, loading } =
		useFetch<AssetTypeDetails[]>(fetchUrl)
	const {
		post: postAssetType,
		reset: postAssetTypeReset,
		data: postDataAssetType,
		error: postErrorAssetType,
	} = usePost<NewAssetTypeDetails>()
	const {
		put: putAssetType,
		reset: putAssetTypeReset,
		data: putDataAssetType,
		error: putErrorAssetType,
	} = usePut<NewAssetTypeDetails>()
	const {
		post: postAsset,
		reset: postAssetReset,
		data: postDataAsset,
		error: postErrorAsset,
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
			handleCloseModal()
			refetch()
		}
	}, [postDataAssetType])

	useEffect(() => {
		if (putDataAssetType) {
			handleCloseModal()
			refetch()
		}
	}, [putDataAssetType])

	useEffect(() => {
		if (postDataAsset) {
			handleCloseModal()
			setLabelsError('')
			refetch()
		}
	}, [postDataAsset])

	useEffect(() => {
		if (!deleteLoading) {
			if (!deleteError) {
				handleCloseModal()
				refetch()
			}
		}
	}, [deleteError, deleteLoading])

	useEffect(() => {
		if (labelsError) {
			handleOpenModal('noAssetsForLabels')
		}
	}, [labelsError])

	function handleOpenModal(
		desiredContent: ModalContent,
		element?: AssetTypeDetails
	) {
		setModalContent(desiredContent)

		if (desiredContent == 'editAssetType') {
			setAssetTypeToEdit(element!)
		} else if (desiredContent == 'addAsset') {
			setAssetTypeToAddAssetTo(element!)
		} else if (desiredContent == 'confirmDelete') {
			setAssetTypeIdToDelete(element!.id)
		}

		setOpenModal(true)
	}

	function handleCloseModal() {
		setOpenModal(false)

		if (modalContent == 'addAssetType') {
			postAssetTypeReset()
		} else if (modalContent == 'editAssetType') {
			setAssetTypeToEdit(null)
			putAssetTypeReset()
		} else if (modalContent == 'addAsset') {
			setAssetTypeToAddAssetTo(null)
			postAssetReset()
		} else if (modalContent == 'confirmDelete') {
			setAssetTypeIdToDelete(null)
		} else if (modalContent == 'noAssetsForLabels') {
			setLabelsError('')
		}

		setModalContent(null)
	}

	function handleSubmitPostAssetType(data: NewAssetTypeDetails) {
		if (data.debugOptions) {
			console.log('Debugging options enabled for AssetType POST request')

			if (data.debugOptions.tooManyCharacters) {
				data.name = 'A'.repeat(129)
			}

			if (data.debugOptions.badEndpoint) {
				console.log('Simulating a request to a non-existent endpoint')
				postAssetType('/made-up-endpoint', data)
			} else {
				postAssetType('/asset-types', data)
			}
		} else {
			postAssetType('/asset-types', data)
		}
	}

	function handleSubmitPutAssetType(data: NewAssetTypeDetails) {
		if (data.debugOptions) {
			console.log('Debugging options enabled for AssetType POST request')

			if (data.debugOptions.tooManyCharacters) {
				data.name = 'A'.repeat(129)
			}

			if (data.debugOptions.badEndpoint) {
				console.log('Simulating a request to a non-existent endpoint')
				putAssetType(`/made-up-endpoint/${assetTypeToEdit?.id}`, data)
			} else {
				putAssetType(`/asset-types/${assetTypeToEdit?.id}`, data)
			}
		} else {
			putAssetType(`/asset-types/${assetTypeToEdit?.id}`, data)
		}
	}

	function handleSubmitAsset(data: NewAssetDetails) {
		if (data.acquisition_date instanceof Dayjs && assetTypeToAddAssetTo) {
			data.acquisition_date = data.acquisition_date.format('YYYY-MM-DD')
			data.asset_type_id = assetTypeToAddAssetTo?.id

			if (data.debugOptions) {
				console.log('Debugging options enabled for Asset POST request')

				if (data.debugOptions.tooManyCharacters) {
					data.description = 'A'.repeat(2057)
				}

				if (data.debugOptions.badEndpoint) {
					console.log(
						'Simulating a request to a non-existent endpoint'
					)
					postAsset('/made-up-endpoint', data)
				} else {
					postAsset('/assets', data)
				}
			} else {
				postAsset('/assets', data)
			}
		}
	}

	function handleDelete() {
		setAssetTypes([])
		deletereq(`/asset-types/${assetTypeIdToDelete}`)
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
						{modalContent == 'addAssetType'
							? 'Add asset type'
							: modalContent == 'editAssetType'
								? 'Edit asset type'
								: modalContent == 'addAsset'
									? 'Add asset'
									: modalContent == 'confirmDelete'
										? 'Are you sure?'
										: modalContent == 'noAssetsForLabels' &&
											'No labels to print'}
					</Typography>
					<Box id="modal-description" sx={{ mt: 4 }}>
						{modalContent == 'addAssetType' ? (
							postErrorAssetType ? (
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										gap: '5px',
									}}
								>
									<Alert severity="error">
										{postErrorAssetType}
									</Alert>
									<Button
										variant="contained"
										onClick={handleCloseModal}
									>
										Ok
									</Button>
								</Box>
							) : (
								<AssetTypeForm
									onSubmit={handleSubmitPostAssetType}
									submitButtonText="Add"
								/>
							)
						) : modalContent == 'editAssetType' ? (
							putErrorAssetType ? (
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										gap: '5px',
									}}
								>
									<Alert severity="error">
										{putErrorAssetType}
									</Alert>
									<Button
										variant="contained"
										onClick={handleCloseModal}
									>
										Ok
									</Button>
								</Box>
							) : (
								<AssetTypeForm
									onSubmit={handleSubmitPutAssetType}
									submitButtonText="Update"
									assetTypeToEdit={assetTypeToEdit!}
								/>
							)
						) : modalContent == 'addAsset' ? (
							postErrorAsset ? (
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										gap: '5px',
									}}
								>
									<Alert severity="error">
										{postErrorAsset}
									</Alert>
									<Button
										variant="contained"
										onClick={handleCloseModal}
									>
										Ok
									</Button>
								</Box>
							) : (
								<AssetForm onSubmit={handleSubmitAsset} />
							)
						) : modalContent == 'confirmDelete' ? (
							deleteError ? (
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
											onClick={handleCloseModal}
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
											This action will delete asset type
											with ID:
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
											onClick={handleCloseModal}
										>
											No
										</Button>
									</Box>
								</>
							)
						) : modalContent == 'noAssetsForLabels' ? (
							<>
								<Box sx={{ mb: 2 }}>
									<Alert severity="info">{labelsError}</Alert>
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
										onClick={handleCloseModal}
									>
										Ok
									</Button>
								</Box>
							</>
						) : (
							''
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
					gap: '10px',
					padding: '10px',
					overflow: 'auto',
					width: '95%',
					minHeight: '70vh',
				}}
			>
				<Typography variant="h5">Asset types:</Typography>
				{auth?.user?.role == 'ADMIN' && (
					<Button
						variant="outlined"
						id="add-asset-type-button"
						onClick={function () {
							handleOpenModal('addAssetType')
						}}
					>
						Add asset type
					</Button>
				)}
				{loading || !data ? (
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
					data.length == 0 ? (
						<Typography>
							👀 No asset types to see here. Add some with the
							"ADD ASSET TYPE" button above.
						</Typography>
					) : (
						assetTypes.map((element) => (
							<Grid
								container
								component={Card}
								id={`${element.name}-card-${element.id}`}
								key={element.id}
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
													lg: 2,
												}}
												key={key}
												sx={{
													textAlign: 'center',
													minHeight: '80px',
												}}
											>
												<Typography variant="subtitle2">
													{key.toUpperCase()}
												</Typography>
												<Typography
													id={`${element.name}-name-tag-${element.id}`}
													variant="body2"
												>
													{value}
												</Typography>
											</Grid>
										)
								)}
								<Grid
									container
									size={{ xs: 12, sm: 12, md: 12, lg: 6 }}
									gap="5px"
								>
									<Grid
										size={{ xs: 12, sm: 6, md: 6, lg: 6 }}
									>
										<Box
											sx={{
												display: 'flex',
												flexDirection: 'row',
												justifyContent: 'center',
												gap: '5px',
												height: '100%',
											}}
										>
											{auth?.user?.role == 'ADMIN' && (
												<Button
													variant="outlined"
													fullWidth={true}
													onClick={function () {
														handleOpenModal(
															'addAsset',
															element
														)
													}}
												>
													Add asset
												</Button>
											)}
											<Button
												variant="outlined"
												fullWidth={true}
												onClick={function () {
													navigate(
														`/take-stock/${element.id}`
													)
												}}
											>
												Take stock
											</Button>
										</Box>
									</Grid>
									<Grid
										size={{ xs: 12, sm: 6, md: 6, lg: 6 }}
									>
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
													printLabels(
														element,
														setLabelsError
													)
												}}
											>
												Print labels
											</Button>
											<Button
												variant="outlined"
												fullWidth={true}
												id={`${element.name}-edit-button-${element.id}`}
												onClick={function () {
													handleOpenModal(
														'editAssetType',
														element
													)
												}}
											>
												Edit name
											</Button>
											{auth?.user?.role == 'ADMIN' && (
												<Button
													variant="outlined"
													fullWidth={true}
													onClick={function () {
														handleOpenModal(
															'confirmDelete',
															element
														)
													}}
												>
													<DeleteIcon />
												</Button>
											)}
										</Box>
									</Grid>
								</Grid>
							</Grid>
						))
					)
				) : (
					''
				)}
			</Box>
		</>
	)
}
