export function queryStringify(data: Record<string, unknown>): string {
	const params = Object.entries(data)
		.filter(([, value]) => value !== undefined && value !== null)
		.map(([key, value]) => {
			if (Array.isArray(value)) {
				return value
					.map(
						item =>
							`${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`
					)
					.join('&')
			}

			return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
		})

	return params.join('&')
}
