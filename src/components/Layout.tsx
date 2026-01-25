import { AuthContext } from '../context/AuthContext'
import MenuIcon from '@mui/icons-material/Menu'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useContext } from 'react'
import { Outlet, useNavigate } from 'react-router'

export default function Layout() {
	const auth = useContext(AuthContext)

	function logout() {
		if (auth) {
			console.log('Logout')
			auth.logoutAction()
		}
	}

	return (
		<>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position="static">
					<Container maxWidth="lg">
						<Toolbar disableGutters>
							<IconButton
								size="large"
								edge="start"
								color="inherit"
								aria-label="menu"
								sx={{ mr: 2 }}
							>
								<MenuIcon />
							</IconButton>
							<Typography
								variant="h6"
								component="div"
								sx={{ flexGrow: 1 }}
							>
								Inventory Management System (Navbar TODO - Make
								repsonsive menu)
							</Typography>
							<Button color="inherit" onClick={logout}>
								Logout
							</Button>
						</Toolbar>
					</Container>
				</AppBar>
			</Box>
			<Container
				sx={{
					padding: '20px',
				}}
			>
				<Outlet />
			</Container>
		</>
	)
}
