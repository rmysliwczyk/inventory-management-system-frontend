import { AuthContext } from '../context/AuthContext'
import { parseApiError } from '../utils/apiErrorParser'
import customFetch from '../utils/customFetch'
import { useContext, useState } from 'react'

type PutState<T> = {
	data: T | null
	loading: boolean
	error: string | null
}

function usePut<T = unknown>() {
	const [state, setState] = useState<PutState<T>>({
		data: null,
		loading: false,
		error: null,
	})
	const auth = useContext(AuthContext)

	const put = async (
		url: string,
		payload: any,
		options?: RequestInit
	): Promise<T> => {
		setState({ data: null, loading: true, error: null })

		try {
			const headers = new Headers(options?.headers || {})
			headers.set('Content-Type', 'application/json')

			const res = await customFetch(url, {
				method: 'put',
				headers,
				body: JSON.stringify(payload),
				...options,
			})

			if (!res.ok) {
				if (res.status == 401) {
					auth?.logoutAction()
				}
				throw res
			}

			const data: T = await res.json()
			setState({ data, loading: false, error: null })
			return data
		} catch (err: any) {
			const errorMessage = await parseApiError(err)
			setState({
				data: null,
				loading: false,
				error: errorMessage || 'Unknown error',
			})
			throw err
		}
	}

	const reset = async () => {
		setState({ data: null, error: null, loading: false })
	}

	return { put, reset, ...state }
}

export default usePut
