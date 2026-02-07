import type { NewAssetTypeDetails } from '../types'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'

export default function AssetTypeForm({
	onSubmit,
	submitButtonText,
	assetTypeToEdit,
}: {
	onSubmit: SubmitHandler<NewAssetTypeDetails>
	submitButtonText: string
	assetTypeToEdit?: NewAssetTypeDetails
}) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<NewAssetTypeDetails>({
		defaultValues: { ...assetTypeToEdit },
	})

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						gap: '15px',
					}}
				>
					<FormControl>
						<TextField
							id="name"
							label="Asset name"
							variant="standard"
							error={Boolean(errors.name)}
							helperText={errors.name && 'Field required'}
							{...register('name', { required: true })}
						/>
					</FormControl>
					<FormControl>
						<Button
							type="submit"
							variant="outlined"
							loading={false}
						>
							{submitButtonText}
						</Button>
					</FormControl>
				</Box>
			</form>
		</>
	)
}
