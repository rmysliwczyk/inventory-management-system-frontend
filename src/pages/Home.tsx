import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'

export default function Home() {
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
					Welcome to Inventory Management System. Please select the desired page from the navbar.
				</Typography>
			</Box>
		</>
	)
}
