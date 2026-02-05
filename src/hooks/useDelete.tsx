import { AuthContext } from '../context/AuthContext'
import { parseApiError } from '../utils/apiErrorParser'
import customFetch from '../utils/customFetch'
import { useState, useContext } from 'react'

type DeleteState = {
	error: string | null
	loading: boolean
}

function useDelete<T = unknown>() {
	const [state, setState] = useState<DeleteState>({
		error: null,
		loading: false
	})
	const auth = useContext(AuthContext)

	const deletereq = async (
		url: string,
		options?: RequestInit
	): Promise<void> => {
		setState({ error: null, loading: true })

		try {
			const headers = new Headers(options?.headers || {})
			headers.set('Content-Type', 'application/json')

			const res = await customFetch(url, {
				method: 'DELETE',
				headers,
			})

			if (!res.ok) {
				if (res.status == 401) {
					auth?.logoutAction()
				}
				throw res
			}

			setState({ error: null, loading: false })
		} catch (err: any) {
			const errorMessage = await parseApiError(err)
			setState({ error: errorMessage || 'Unknown error', loading: false })
			throw err
		}
	}

	return { deletereq, ...state }
}

export default useDelete
