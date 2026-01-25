import type { User } from '../types'

export default async function customFetch(
	input: RequestInfo | URL,
	init?: RequestInit
): Promise<Response> {
	let userData = window.localStorage.getItem('user')
	let user: User
	if (userData) {
		user = JSON.parse(userData)

		if (user?.token) {
			const headers = {
				...(init?.headers ?? {}),
				Authorization: `Bearer ${user.token}`,
			}

			init = {
				...init,
				headers: headers,
			}
		}
	}

	input = import.meta.env['VITE_API_URL'] + input;
	const res = await fetch(input, init)
	return res
}
