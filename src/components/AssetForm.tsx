import type { NewAssetDetails } from '../types'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { Controller, useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { useEffect, useState } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'

export default function AssetForm({
	onSubmit,
}: {
	onSubmit: SubmitHandler<NewAssetDetails>
}) {
	const [useDebug, setUseDebug] = useState<boolean>(false)
	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<NewAssetDetails>({
		defaultValues: {
			acquisition_date: dayjs(),
		},
	})

	useEffect(() => {
		if (import.meta.env['VITE_DEBUG_ENABLED'] == "1") {
			setUseDebug(true)
		}
	}, [])

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
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
							multiline
							id="description"
							label="Asset description"
							variant="standard"
							error={Boolean(errors.description)}
							{...register('description')}
						/>
					</FormControl>
					<FormControl>
						<Controller
							name="acquisition_date"
							control={control}
							render={({ field }) => (
								<DatePicker
									onChange={(date) => {
										field.onChange(date)
									}}
									label="Acquisition date"
									format="YYYY/MM/DD"
									value={dayjs(field.value)}
									inputRef={field.ref}
								/>
							)}
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
		</LocalizationProvider>
	)
}
