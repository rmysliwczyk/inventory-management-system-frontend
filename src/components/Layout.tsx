import { AuthContext } from '../context/AuthContext'
import MenuIcon from '@mui/icons-material/Menu'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useContext, useState } from 'react'
import { Outlet } from 'react-router'

const pages = ['Check inventory', 'Add assets']

export default function Layout() {
	const auth = useContext(AuthContext)
	const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget)
	}

	const handleCloseNavMenu = () => {
		setAnchorElNav(null)
	}

	function logout() {
		if (auth) {
			auth.logoutAction()
		}
	}

	return (
		<>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position="static">
					<Container maxWidth="lg">
						<Toolbar disableGutters>
							<Typography
								variant="h5"
								noWrap
								component="a"
								sx={{
									mr: 2,
									display: { xs: 'none', md: 'flex' },
									color: 'inherit',
									fontWeight: 700,
									textDecoration: 'none',
								}}
							>
								Inventory Management System
							</Typography>
							<Box
								sx={{
									flexGrow: 1,
									display: { xs: 'flex', md: 'none' },
								}}
							>
								<IconButton
									size="large"
									edge="start"
									color="inherit"
									aria-label="menu"
									onClick={handleOpenNavMenu}
									sx={{ mr: 2 }}
								>
									<MenuIcon />
								</IconButton>
								<Menu
									id="menu-appbar"
									anchorEl={anchorElNav}
									anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'left',
									}}
									keepMounted
									transformOrigin={{
										vertical: 'top',
										horizontal: 'left',
									}}
									open={Boolean(anchorElNav)}
									onClose={handleCloseNavMenu}
									sx={{
										display: { xs: 'block', md: 'none' },
									}}
								>
									{pages.map((page) => (
										<MenuItem
											key={page}
											onClick={handleCloseNavMenu}
										>
											<Typography
												sx={{ textAlign: 'center' }}
											>
												{page}
											</Typography>
										</MenuItem>
									))}
								</Menu>
							</Box>
							<Box
								sx={{
									flexGrow: 1,
									display: { xs: 'none', md: 'flex' },
								}}
							>
								{pages.map((page) => (
									<Button
										key={page}
										onClick={handleCloseNavMenu}
										sx={{
											my: 2,
											color: 'white',
											display: 'block',
										}}
									>
										{page}
									</Button>
								))}
							</Box>
							<Typography
								variant="h5"
								noWrap
								component="a"
								sx={{
									display: { xs: 'flex', md: 'none' },
									flexGrow: 1,
									color: 'inherit',
									fontWeight: 700,
									textDecoration: 'none',
								}}
							>
								Inventory Management System
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
