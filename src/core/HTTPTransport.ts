import { queryStringify } from '../utils/helpers/queryStringify'

export const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const

export type HTTPMethod = (typeof HTTP_METHOD)[keyof typeof HTTP_METHOD]

export interface RequestOptions {
  method?: HTTPMethod
  data?: unknown
  headers?: Record<string, string>
  timeout?: number
}

export class HTTPTransport {
  private readonly baseUrl: string

  constructor(baseUrl = '') {
    this.baseUrl = baseUrl
  }

  get<T = unknown>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: HTTP_METHOD.GET })
  }

  post<T = unknown>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: HTTP_METHOD.POST })
  }

  put<T = unknown>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: HTTP_METHOD.PUT })
  }

  delete<T = unknown>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: HTTP_METHOD.DELETE })
  }

  private request<T>(url: string, options: RequestOptions): Promise<T> {
    const {
      method = HTTP_METHOD.GET,
      data,
      headers = {},
      timeout = 5000,
    } = options

    return new Promise<T>((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      let fullUrl = `${this.baseUrl}${url}`

      if (method === HTTP_METHOD.GET && data && typeof data === 'object') {
        const query = queryStringify(data as Record<string, unknown>)
        if (query) {
          const sep = fullUrl.includes('?') ? '&' : '?'
          fullUrl += sep + query
        }
      }

      xhr.open(method, fullUrl, true)

      xhr.timeout = timeout
      xhr.withCredentials = true

      xhr.onload = () => {
        const contentType = xhr.getResponseHeader('Content-Type') ?? ''
        let response: unknown = xhr.responseText

        if (contentType.includes('application/json') && xhr.responseText) {
          try {
            response = JSON.parse(xhr.responseText)
          } catch (error) {
            console.error('HTTP error:', error)
          }
        }

        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(response as T)
        } else {
          reject({
            status: xhr.status,
            data: response,
          })
        }
      }

      xhr.onabort = () => reject(new Error('Request aborted'))
      xhr.onerror = () => reject(new Error('Network error'))
      xhr.ontimeout = () => reject(new Error('Request timeout'))

      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value)
      })

      if (method === HTTP_METHOD.GET || data == null) {
        xhr.send()
      } else if (data instanceof FormData) {
        xhr.send(data)
      } else {
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(data))
      }
    })
  }
}
