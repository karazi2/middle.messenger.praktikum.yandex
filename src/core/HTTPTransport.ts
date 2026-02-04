type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

type Options = {
	method?: HTTPMethod
	data?: unknown
	headers?: Record<string, string>
	timeout?: number
}

export class HTTPError extends Error {
	status: number
	reason: string

	constructor(status: number, reason: string) {
		super(reason)
		this.status = status
		this.reason = reason
	}
}

const API_BASE = 'https://ya-praktikum.tech/api/v2'

function queryStringify(data: Record<string, unknown>) {
	const params: string[] = []

	Object.entries(data).forEach(([key, value]) => {
		if (value === undefined || value === null) return
		params.push(
			`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
		)
	})

	return params.length ? `?${params.join('&')}` : ''
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null
}

export default class HTTPTransport {
	get<T = unknown>(url: string, options: Options = {}) {
		return this.request<T>(url, { ...options, method: 'GET' })
	}

	post<T = unknown>(url: string, options: Options = {}) {
		return this.request<T>(url, { ...options, method: 'POST' })
	}

	put<T = unknown>(url: string, options: Options = {}) {
		return this.request<T>(url, { ...options, method: 'PUT' })
	}

	delete<T = unknown>(url: string, options: Options = {}) {
		return this.request<T>(url, { ...options, method: 'DELETE' })
	}

	request<T = unknown>(url: string, options: Options): Promise<T> {
		const { method = 'GET', data, headers = {}, timeout = 5000 } = options

		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest()
			let fullUrl = `${API_BASE}${url}`

			if (method === 'GET' && data && isRecord(data)) {
				fullUrl += queryStringify(data)
			}

			xhr.open(method, fullUrl)
			xhr.withCredentials = true
			xhr.timeout = timeout

			const isFormData = data instanceof FormData

			if (!isFormData && !headers['Content-Type']) {
				xhr.setRequestHeader('Content-Type', 'application/json')
			}
			Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v))

			xhr.onload = () => {
				const status = xhr.status
				const contentType = xhr.getResponseHeader('Content-Type') || ''
				const responseText = xhr.responseText

				let parsed: unknown = null
				if (responseText) {
					if (contentType.includes('application/json')) {
						try {
							parsed = JSON.parse(responseText) as unknown
						} catch {
							parsed = responseText
						}
					} else {
						parsed = responseText
					}
				}

				if (status >= 200 && status < 300) {
					resolve(parsed as T)
					return
				}

				// ✅ корректно вытаскиваем reason из unknown
				let reason: unknown = parsed
				if (isRecord(parsed) && typeof parsed.reason === 'string') {
					reason = parsed.reason
				}

				reject(new HTTPError(status, String(reason || `HTTP ${status}`)))
			}

			xhr.onabort = () => reject(new HTTPError(0, 'Request aborted'))
			xhr.onerror = () => reject(new HTTPError(0, 'Network error'))
			xhr.ontimeout = () => reject(new HTTPError(0, 'Request timeout'))

			if (method === 'GET' || data === undefined) {
				xhr.send()
				return
			}

			if (isFormData) {
				xhr.send(data)
				return
			}

			xhr.send(JSON.stringify(data))
		})
	}
}
