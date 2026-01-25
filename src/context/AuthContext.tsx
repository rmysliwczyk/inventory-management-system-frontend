import type { User } from '../types'
import { createContext, useState, useEffect } from 'react'
import customFetch from '../utils/customFetch'
import { useNavigate } from 'react-router'

interface Error {
	message: string
}

interface AuthContext {
	user: User | null
	error: Error | null
	loginInProgress: boolean
	contextLoading: boolean
	loginAction: (username: string, password: string) => void
	logoutAction: () => void
}

export const AuthContext = createContext<AuthContext | null>(null)

export function AuthProvider({ children }: { children: any }) {
	const navigate = useNavigate()
	const [user, setUser] = useState<User | null>(null)
	const [error, setError] = useState<Error | null>(null)
	const [loginInProgress, setLoginInProgress] = useState<boolean>(false)
	const [contextLoading, setContextLoading] = useState<boolean>(true)

	async function loginAction(username: string, password: string) {
		setLoginInProgress(true)

		// Getting the token
		const tokenResponse = await fetch(
			import.meta.env['VITE_API_URL'] + '/auth/token',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: new URLSearchParams({
					username: username,
					password: password,
				}),
			}
		)
		if (!tokenResponse.ok) {
			setError({ message: (await tokenResponse.json()).detail })
			setUser(null)
		} else {
			const tokenData = await tokenResponse.json()

			// Getting the user data
			const userResponse = await fetch(
				import.meta.env['VITE_API_URL'] + '/users/me',
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${tokenData.access_token}`,
					},
				}
			)
			if (!userResponse.ok) {
				setError({ message: (await userResponse.json()).detail })
				setUser(null)
			} else {
				const userData = await userResponse.json()
				const userObject = {
					username: userData.username,
					token: tokenData.access_token,
				}
				window.localStorage.setItem('user', JSON.stringify(userObject))
				setError(null)
				setUser(userObject)
			}
		}

		setLoginInProgress(false)
	}

	async function logoutAction() {
		window.localStorage.removeItem('user')
		setUser(null)
		navigate("/login")
	}

	async function checkTokenIsValid() {
		const response = await customFetch("/users/me");
		if(response.status == 401) {
			logoutAction();
		}
	}

	useEffect(() => {
		if (error) {
			window.localStorage.removeItem('user')
		}
	}, [error])

	useEffect(() => {
		async function loadStoredUser() {
			const userData = window.localStorage.getItem('user')
			if (userData) {
				setUser(JSON.parse(userData))
			} else {
				setUser(null)
			}
			setContextLoading(false)
		}

		loadStoredUser()
	}, [])

	useEffect(() => {
		if (user) {
			checkTokenIsValid();
		}
	}, [user])

	return (
		<AuthContext
			value={{
				user,
				error,
				loginInProgress,
				contextLoading,
				loginAction,
				logoutAction,
			}}
		>
			{children}
		</AuthContext>
	)
}
