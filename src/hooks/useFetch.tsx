import { AuthContext } from '../context/AuthContext'
import customFetch from '../utils/customFetch'
import { useState, useEffect, useContext } from 'react'
import { parseApiError } from '../utils/apiErrorParser'

type FetchState<T> = {
	data: T | null
	loading: boolean
	error: string | null
	refetch?: () => void
}

function useFetch<T = unknown>(url: string, options?: RequestInit) {
	const [state, setState] = useState<FetchState<T>>({
		data: null,
		loading: true,
		error: null,
	})
	const [refetchIndex, setRefetchIndex] = useState(0)
	const auth = useContext(AuthContext)

	function refetch() {
		setRefetchIndex((prevRefetchIndex) => prevRefetchIndex + 1)
	}

	useEffect(() => {
		if (url !== '') {
			let isCancelled = false

			const fetchData = async () => {
				setState({ data: null, loading: true, error: null })
				try {
					const headers = new Headers(options?.headers || {})

					const res = await customFetch(
						url,
						{
							...options,
							headers,
						}
					)

					if (!res.ok) {
						if (res.status == 401) {
							auth?.logoutAction()
						}
						throw res
					}

					const data: T = await res.json()
					if (!isCancelled) {
						setState({ data, loading: false, error: null })
					}
				} catch (error: any) {
					const errorMessage = await parseApiError(error)
					if (!isCancelled) {
						setState({
							data: null,
							loading: false,
							error: errorMessage || 'Unknown error',
						})
					}
				}
			}

			fetchData()

			return () => {
				isCancelled = true
			}
		}
	}, [url, JSON.stringify(options), auth?.user, refetchIndex])

	return { ...state, refetch }
}

export default useFetch
