import { AuthContext } from '../context/AuthContext'
import { parseApiError } from '../utils/apiErrorParser'
import customFetch from '../utils/customFetch'
import { useState, useContext } from 'react'

type PostState<T> = {
	data: T | null
	error: string | null
	loading: boolean
}

function usePost<T = unknown>() {
	const [state, setState] = useState<PostState<T>>({
		data: null,
		error: null,
		loading: false,
	})
	const auth = useContext(AuthContext)

	const post = async (
		url: string,
		payload: any,
		options?: RequestInit
	): Promise<T | null> => {
		setState({ data: null, error: null, loading: true })

		try {
			const headers = new Headers(options?.headers || {})
			headers.set('Content-Type', 'application/json')

			const res = await customFetch(url, {
				method: 'POST',
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
			setState({ data, error: null, loading: false })
			return data
		} catch (err: any) {
			const errorMessage = await parseApiError(err)
			setState({
				data: null,
				error: errorMessage || 'Unknown error',
				loading: false,
			})
			return null
		}
	}

	return { post, ...state }
}

export default usePost
