import Layout from './components/Layout'
import { AuthProvider } from './context/AuthContext'
import AssetTypes from './pages/AssetTypes'
import CheckAsset from './pages/CheckAsset'
import Home from './pages/Home'
import Login from './pages/Login'
import PrivateRoute from './pages/PrivateRoute'
import TakeStock from './pages/TakeStock'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { BrowserRouter, Route, Routes } from 'react-router'

function App() {
	const theme = createTheme({
		palette: {
			mode: 'light',
			background: {
				default: '#F2F0EF',
			},
		},
		colorSchemes: {
			dark: true,
		},
	})
	return (
		<>
			<ThemeProvider theme={theme}>
				<CssBaseline enableColorScheme />
				<BrowserRouter>
					<AuthProvider>
						<Routes>
							<Route path="/login" element={<Login />} />
							<Route element={<PrivateRoute />}>
								<Route path="/" element={<Layout />}>
									<Route path="" element={<Home />} />
									<Route
										path="/check-asset"
										element={<CheckAsset />}
									/>
									<Route
										path="/asset-types"
										element={<AssetTypes />}
									/>
									<Route
										path="/take-stock/:assetTypeId"
										element={<TakeStock />}
									/>
								</Route>
							</Route>
						</Routes>
					</AuthProvider>
				</BrowserRouter>
			</ThemeProvider>
		</>
	)
}

export default App
