import type { NewAssetTypeDetails } from '../types'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
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
	const [useDebug, setUseDebug] = useState<boolean>(false)
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<NewAssetTypeDetails>({
		defaultValues: { ...assetTypeToEdit },
	})

	useEffect(() => {
		if (import.meta.env['VITE_DEBUG_ENABLED'] == '1') {
			setUseDebug(true)
		}
	}, [])

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
					{useDebug && (
						<Box>
							<Typography>Debugging options</Typography>
							<FormControl>
								<FormControlLabel
									control={<Checkbox />}
									label="Send spoofed name of over 128 characters"
									{...register(
										'debugOptions.tooManyCharacters'
									)}
								/>
								<FormControlLabel
									control={<Checkbox />}
									label="Send to non-existent endpoint"
									{...register('debugOptions.badEndpoint')}
								/>
							</FormControl>
						</Box>
					)}
				</Box>
			</form>
		</>
	)
}
