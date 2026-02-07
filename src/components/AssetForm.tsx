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

export default function AssetForm({
	onSubmit,
}: {
	onSubmit: SubmitHandler<NewAssetDetails>
}) {
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
				</Box>
			</form>
		</LocalizationProvider>
	)
}
