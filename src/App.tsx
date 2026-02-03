import Layout from './components/Layout'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import CheckAsset from './pages/CheckAsset'
import AssetTypes from './pages/AssetTypes'
import PrivateRoute from './pages/PrivateRoute'
import { BrowserRouter, Routes, Route } from 'react-router'
import { createTheme, ThemeProvider } from '@mui/material/styles'

function App() {
	const theme = createTheme({})
	return (
		<ThemeProvider theme={theme}>
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route element={<PrivateRoute />}>
						<Route path="/" element={<Layout />}>
							<Route path="" element={<Home />} />
							<Route path="/check-asset" element={<CheckAsset />} />
							<Route path="/asset-types" element={<AssetTypes />} />
						</Route>
					</Route>
				</Routes>
			</AuthProvider>
		</BrowserRouter>
		</ThemeProvider>
	)
}

export default App
