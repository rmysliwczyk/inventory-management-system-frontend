import { AuthContext } from '../context/AuthContext'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Container from '@mui/material/Container'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useState, useEffect, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router'

export default function Login() {
	const navigate = useNavigate()
	const auth = useContext(AuthContext)
	const [username, setUsername] = useState<string | null>(null)
	const [password, setPassword] = useState<string | null>(null)

	function loginHandler(event: React.FormEvent) {
		event.preventDefault()
		const formData = new FormData(event.target as HTMLFormElement)
		setUsername(formData.get('username') as string)
		setPassword(formData.get('password') as string)
	}

	useEffect(() => {
		if (username && password) {
			auth?.loginAction(username, password)
		}
	}, [username, password])

	useEffect(() => {
		if (auth?.user) {
			navigate('/')
		}
	}, [auth?.user])

	return (
		<>
			<Container
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100vh',
				}}
			>
				<Box
					component={Card}
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: '30px',
						maxWidth: '300px',
						padding: '20px',
						overflow: 'auto',
					}}
				>
					<Box>
						<Typography variant="h4">
							Inventory Management System
						</Typography>
					</Box>
					<Box
						component="form"
						onSubmit={loginHandler}
						noValidate
						sx={{
							display: 'flex',
							flexDirection: 'column',
							gap: '20px',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<FormControl>
							<TextField
								id="username"
								name="username"
								label="Username"
								variant="standard"
							/>
						</FormControl>
						<FormControl>
							<TextField
								id="password"
								name="password"
								label="Password"
								variant="standard"
								type="password"
							/>
						</FormControl>
						<FormControl>
							<Button
								type="submit"
								loading={auth?.loginInProgress}
							>
								Login
							</Button>
						</FormControl>
						{auth?.error && (
							<Alert severity="error">
								Login failed. {auth.error.message}
							</Alert>
						)}
					</Box>
				</Box>
			</Container>
		</>
	)
}
