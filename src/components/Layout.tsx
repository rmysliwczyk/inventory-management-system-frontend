import { AuthContext } from '../context/AuthContext'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import MenuIcon from '@mui/icons-material/Menu'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Icon from '@mui/material/Icon'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useColorScheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useContext, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router'

const pages = [
	{ label: 'Check asset', path: '/check-asset', id: 'check-asset' },
	{ label: 'Asset types', path: '/asset-types', id: 'asset-types' },
]

export default function Layout() {
	const navigate = useNavigate()
	const auth = useContext(AuthContext)
	const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
	const { mode, setMode } = useColorScheme()
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

	useEffect(() => {
		if (prefersDarkMode) {
			setMode('dark')
		} else {
			setMode('light')
		}
	}, [prefersDarkMode])

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

	function toggleColorSchemeMode() {
		if (mode == 'system') {
			if (prefersDarkMode) {
				setMode('light')
			} else {
				setMode('dark')
			}
		} else if (mode == 'light') {
			setMode('dark')
		} else {
			setMode('light')
		}
	}

	return (
		<>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position="static">
					<Container maxWidth="lg">
						<Toolbar disableGutters>
							<Icon
								sx={{
									display: { xs: 'none', md: 'flex' },
									width: '40px',
									height: '40px',
									mr: 2,
								}}
							>
								<Box
									component="img"
									sx={{
										width: '100%',
										height: '100%',
									}}
									src="logo.svg"
								/>
							</Icon>
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
									cursor: 'pointer',
								}}
								onClick={function () {
									navigate('/')
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
											key={page.label}
											id={`${page.id}-menuitem`}
											onClick={function () {
												handleCloseNavMenu()
												navigate(page.path)
											}}
										>
											<Typography
												sx={{ textAlign: 'center' }}
											>
												{page.label}
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
										key={page.label}
										id={`${page.id}-button`}
										onClick={function () {
											handleCloseNavMenu()
											navigate(page.path)
										}}
										sx={{
											my: 2,
											color: 'white',
											display: 'block',
										}}
									>
										{page.label}
									</Button>
								))}
							</Box>
							<Icon
								sx={{
									display: { xs: 'flex', md: 'none' },
									width: '40px',
									height: '40px',
									mr: 2,
								}}
							>
								<Box
									component="img"
									sx={{
										width: '100%',
										height: '100%',
									}}
									src="logo.svg"
								/>
							</Icon>
							<Typography
								variant="h6"
								component="a"
								sx={{
									display: { xs: 'flex', md: 'none' },
									flexGrow: 1,
									color: 'inherit',
									fontWeight: 700,
									textDecoration: 'none',
									cursor: 'pointer',
								}}
								onClick={function () {
									navigate('/')
								}}
							>
								Inventory Management System
							</Typography>
							<Button
								color="inherit"
								onClick={toggleColorSchemeMode}
							>
								<DarkModeIcon />
							</Button>
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
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Outlet />
			</Container>
		</>
	)
}
