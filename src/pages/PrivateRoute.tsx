import { AuthContext } from '../context/AuthContext'
import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router'

export default function PrivateRoute() {
	const auth = useContext(AuthContext)

	if (auth?.contextLoading) {
		return <></>
	}

	if (!auth?.user) {
		return <Navigate to="/login" />
	} else {
		return <Outlet />
	}
}
