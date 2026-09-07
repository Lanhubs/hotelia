import { config } from '../config'
import { mockRequest } from '../mock/adapter'

export class ApiError extends Error {
  status: number
  constructor(message: string, status = 500) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type HttpOptions = {
  params?: Record<string, string | number | boolean | undefined>
  body?: unknown
  method?: HttpMethod
  idempotencyKey?: string
}

function buildQuery(params?: HttpOptions['params']): string {
  if (!params) return ''
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) search.set(key, String(value))
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

async function fetchJson<T>(path: string, options: HttpOptions = {}): Promise<T> {
  const url = `${config.apiBaseUrl}${path}${buildQuery(options.params)}`
  const method: HttpMethod = options.method ?? (options.body ? 'POST' : 'GET')

  const headers: Record<string, string> = {}
  if (options.body) headers['Content-Type'] = 'application/json'
  if (options.idempotencyKey) headers['Idempotency-Key'] = options.idempotencyKey
  // Unique request ID for tracing
  headers['X-Request-ID'] = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  const response = await fetch(url, {
    method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    let message = `Request failed (${response.status})`
    try {
      const data = (await response.json()) as { message?: string; error?: string }
      if (data.error) message = data.error
      else if (data.message) message = data.message
    } catch { /* ignore */ }
    throw new ApiError(message, response.status)
  }

  return (await response.json()) as T
}

export async function apiGet<T>(path: string, params?: HttpOptions['params']): Promise<T> {
  if (config.useMock) return mockRequest<T>(path, { params })
  return fetchJson<T>(path, { params })
}

export async function apiPost<T>(path: string, body: unknown, idempotencyKey?: string): Promise<T> {
  if (config.useMock) return mockRequest<T>(path, { body })
  return fetchJson<T>(path, { body, method: 'POST', idempotencyKey })
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  return fetchJson<T>(path, { body, method: 'PUT' })
}

export async function apiDelete<T>(path: string): Promise<T> {
  return fetchJson<T>(path, { method: 'DELETE' })
}