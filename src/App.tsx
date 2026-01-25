import Layout from './components/Layout'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import PrivateRoute from './pages/PrivateRoute'
import { BrowserRouter, Routes, Route } from 'react-router'

function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route element={<PrivateRoute />}>
						<Route path="/" element={<Layout />}>
							<Route path="" element={<Home />} />
						</Route>
					</Route>
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	)
}

export default App
