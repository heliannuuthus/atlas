import { message } from 'antd'
import type { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { getServiceUrl, apiEndpoints, type ServiceName } from '../config/env'
import { getAuth } from '../config/auth'

const serviceAudienceMap: Record<string, string> = {
  hermes: 'hermes',
  zwei: 'zwei',
  chaos: 'chaos',
}

export interface ApiResponse<T = unknown> {
  code?: number
  message?: string
  data?: T
  [key: string]: unknown
}

async function injectToken(config: InternalAxiosRequestConfig, audience?: string) {
  const auth = getAuth()
  const token = await auth.getAccessToken(audience)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function responseSuccessHandler(response: AxiosResponse<ApiResponse>): any {
  const { data } = response
  if (data && typeof data === 'object' && !Array.isArray(data) && data.code !== undefined && data.code !== 0 && data.code !== 200) {
    const errorMsg = data.message || '请求失败'
    message.error(errorMsg)
    return Promise.reject(new Error(errorMsg))
  }
  if (data && typeof data === 'object' && !Array.isArray(data) && data.data !== undefined) {
    return data.data
  }
  return data
}

function resolveAudienceFromError(error: AxiosError): string | undefined {
  const url = error.config?.baseURL || error.config?.url || ''
  for (const [service, audience] of Object.entries(serviceAudienceMap)) {
    if (url.includes(service)) return audience
  }
  return undefined
}

function responseErrorHandler(error: AxiosError<ApiResponse>) {
  if (error.response) {
    const { status, data } = error.response
    let errorMsg = '请求失败'

    switch (status) {
      case 401: {
        errorMsg = '未授权，请重新登录'
        const audience = resolveAudienceFromError(error)
        getAuth().refreshToken(undefined, audience).catch(() => {
          getAuth().logout()
        })
        break
      }
      case 403:
        errorMsg = '拒绝访问'
        break
      case 404:
        errorMsg = '请求地址不存在'
        break
      case 500:
        errorMsg = '服务器内部错误'
        break
      default:
        errorMsg = data?.message || `请求失败 (${status})`
    }

    message.error(errorMsg)
    return Promise.reject(new Error(errorMsg))
  }

  if (error.request) {
    message.error('网络错误，请检查网络连接')
    return Promise.reject(new Error('网络错误'))
  }

  message.error('请求失败，请稍后重试')
  return Promise.reject(error)
}

export interface ServiceRequest {
  get<T = unknown>(url: string, config?: import('axios').AxiosRequestConfig): Promise<T>
  post<T = unknown>(url: string, data?: unknown, config?: import('axios').AxiosRequestConfig): Promise<T>
  put<T = unknown>(url: string, data?: unknown, config?: import('axios').AxiosRequestConfig): Promise<T>
  patch<T = unknown>(url: string, data?: unknown, config?: import('axios').AxiosRequestConfig): Promise<T>
  delete<T = unknown>(url: string, config?: import('axios').AxiosRequestConfig): Promise<T>
}

export function createServiceRequest(service: ServiceName): ServiceRequest {
  const audience = serviceAudienceMap[service]

  const instance = axios.create({
    baseURL: apiEndpoints[service],
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' },
  })

  instance.interceptors.request.use(
    (config) => injectToken(config, audience),
    (error) => Promise.reject(error)
  )

  instance.interceptors.response.use(responseSuccessHandler, responseErrorHandler)

  return instance as unknown as ServiceRequest
}

export const hermesRequest = createServiceRequest('hermes')
export const zweiRequest = createServiceRequest('zwei')
export const chaosRequest = createServiceRequest('chaos')
export const authRequest = createServiceRequest('auth')

const request = axios.create({
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.url) {
      const originalPath = config.url.startsWith('/') ? config.url.slice(1) : config.url
      const service = originalPath.split('/')[0] as string
      const audience = serviceAudienceMap[service]

      const { baseUrl, servicePath } = getServiceUrl(config.url)
      config.baseURL = baseUrl
      config.url = servicePath

      return injectToken(config, audience)
    }
    return injectToken(config)
  },
  (error) => Promise.reject(error)
)

request.interceptors.response.use(responseSuccessHandler, responseErrorHandler)

export async function get<T = unknown>(url: string, params?: Record<string, unknown>): Promise<T> {
  return request.get(url, { params })
}

export async function post<T = unknown>(url: string, data?: unknown): Promise<T> {
  return request.post(url, data)
}

export async function put<T = unknown>(url: string, data?: unknown): Promise<T> {
  return request.put(url, data)
}

export async function del<T = unknown>(url: string, data?: unknown): Promise<T> {
  return request.delete(url, { data })
}

export async function patch<T = unknown>(url: string, data?: unknown): Promise<T> {
  return request.patch(url, data)
}

export default request
