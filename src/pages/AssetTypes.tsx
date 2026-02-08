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
import { printLabels } from '../utils/printLabels'
import { useNavigate } from 'react-router'

export default function AssetTypes() {
	const navigate = useNavigate()
	const [openAddAssetTypeForm, setOpenAddAssetTypeForm] =
		useState<boolean>(false)
	const [openEditAssetTypeForm, setOpenEditAssetTypeForm] = useState<boolean>(false)
	const [openAddAssetForm, setOpenAddAssetForm] = useState<boolean>(false)
	const [openConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false)
	const [assetTypeToEdit, setAssetTypeToEdit] = useState<AssetTypeDetails | null>(null)
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
			handleCloseAddAssetTypeForm()
			refetch()
		}
	}, [postDataAssetType])

	useEffect(() => {
		if (putDataAssetType) {
			handleCloseEditAssetTypeForm()
			refetch()
		}
	}, [putDataAssetType])

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
	
	function handleOpenEditAssetTypeForm(element: AssetTypeDetails) {
		setAssetTypeToEdit(element)
		setOpenEditAssetTypeForm(true)
	}

	function handleCloseEditAssetTypeForm() {
		setOpenEditAssetTypeForm(false)
		setAssetTypeToEdit(null)
		putAssetTypeReset()
	}

	function handleOpenAddAssetForm(element: AssetTypeDetails) {
		setAssetTypeToAddAssetTo(element)
		setOpenAddAssetForm(true)
	}

	function handleCloseAddAssetForm() {
		setOpenAddAssetForm(false)
		setAssetTypeToAddAssetTo(null)
		postAssetReset()
	}

	function handleOpenConfirmDelete(element: AssetTypeDetails) {
		setOpenConfirmDelete(true)
		setAssetTypeIdToDelete(element.id)
	}

	function handleCloseConfirmDelete() {
		setOpenConfirmDelete(false)
		setAssetTypeIdToDelete(null)
	}

	function handleSubmitPostAssetType(data: NewAssetTypeDetails) {
		postAssetType('/asset-types', data)
	}

	function handleSubmitPutAssetType(data: NewAssetTypeDetails) {
		putAssetType(`/asset-types/${assetTypeToEdit?.id}`, data)
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
						{postErrorAssetType ? (
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
									onClick={handleCloseAddAssetTypeForm}
								>
									Ok
								</Button>
							</Box>
						) : (
							<AssetTypeForm onSubmit={handleSubmitPostAssetType} submitButtonText="Add"/>
						)}
					</Box>
				</Box>
			</Modal>
			<Modal
				open={openEditAssetTypeForm}
				onClose={handleCloseEditAssetTypeForm}
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
						Edit asset type
					</Typography>
					<Box id="modal-description" sx={{ mt: 4 }}>
						{putErrorAssetType ? (
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
									onClick={handleCloseEditAssetTypeForm}
								>
									Ok
								</Button>
							</Box>
						) : (
							<AssetTypeForm onSubmit={handleSubmitPutAssetType} submitButtonText="Update" assetTypeToEdit={assetTypeToEdit!}/>
						)}
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
							<Box
								sx={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									gap: '5px',
								}}
							>
								<Alert severity="error">{postErrorAsset}</Alert>
								<Button variant="contained">Ok</Button>
							</Box>
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
					assetTypes.map((element) => (
						<Grid
							container
							component={Card}
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
							<Grid
								container
								size={{ xs: 12, sm: 12, md: 12, lg: 6 }}
								gap="5px"
							>
								<Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
									<Box
										sx={{
											display: 'flex',
											flexDirection: 'row',
											justifyContent: 'center',
											gap: '5px',
											height: '100%',
										}}
									>

										{auth?.user?.role == 'ADMIN' && (<Button
											variant="outlined"
											fullWidth={true}
											onClick={function () {
												handleOpenAddAssetForm(element)
											}}
										>
											Add asset
										</Button>
										)}
										<Button
											variant="outlined"
											fullWidth={true}
											onClick={function() {navigate(`/take-stock/${element.id}`)}}
										>
											Take stock
										</Button>
									</Box>
								</Grid>
								<Grid size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
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
												printLabels(element, setLabelsError)
											}}
										>
											Print labels
										</Button>
										<Button
											variant="outlined"
											fullWidth={true}
											onClick={function() {
												handleOpenEditAssetTypeForm(
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
													handleOpenConfirmDelete(
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
				) : (
					''
				)}
			</Box>
		</>
	)
}
