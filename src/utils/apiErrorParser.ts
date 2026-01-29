/**
 * Parses API errors from FastAPI and other sources into user-friendly messages
 */
export const parseApiError = async (res: Response | Error): Promise<string> => {
	if (res instanceof Error) {
		return res.message
	}
	const body = await res.json()

	// Handle FastAPI validation errors with detail array
	if (body?.detail && Array.isArray(body.detail)) {
		return body.detail
			.map((err: any) => {
				const location = err.loc?.slice(1).join('.') || 'field'
				return `${location}: ${err.msg}`
			})
			.join(', ')
	}

	// Handle string detail (simple FastAPI errors)
	if (body?.detail && typeof body.detail === 'string') {
		return body.detail
	}

	// Handle array-format errors
	if (Array.isArray(body)) {
		return body
			.map((e) => `${e.loc?.join('.') ?? 'field'}: ${e.msg}`)
			.join(', ')
	}

	// Default to statusText for other errors
	return res.status + res.statusText || 'Unknown error'
}
