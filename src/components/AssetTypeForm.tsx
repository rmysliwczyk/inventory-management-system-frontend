import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import type { NewAssetTypeDetails } from '../types'



export default function AssetTypeForm({onSubmit} : {onSubmit: SubmitHandler<NewAssetTypeDetails>}) {
	const {
		register,
		handleSubmit,
		formState: { errors},
	} = useForm<NewAssetTypeDetails>()

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						gap: "15px"
					}}
				>
					<FormControl>
						<TextField
							id="name"
							label="Asset name"
							variant="standard"
							error={Boolean(errors.name)}
							helperText={errors.name && "Field required"}
							{...register("name", {required: true})}
						/>
					</FormControl>
					<FormControl>
						<Button
							type="submit"
							variant="outlined"
							loading={false}
						>
							Add
						</Button>
					</FormControl>
				</Box>
			</form>
		</>
	)
}
