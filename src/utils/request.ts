import { message } from 'antd'
import type { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { getServiceUrl, apiEndpoints, type ServiceName } from '@/config/env'
import { useAuthStore } from '@/store/auth'
import { getAuth } from '@/config/auth'

const tokenCache: Record<string, string | null> = {}

function refreshAllTokens() {
  const auth = getAuth()
  const audiences = Object.keys(serviceAudienceMap)
  for (const aud of audiences) {
    auth
      .getAccessToken(aud)
      .then(token => {
        tokenCache[aud] = token
      })
      .catch(() => {})
  }
}

let prevAuthenticated = false
useAuthStore.subscribe(state => {
  if (state.isAuthenticated === prevAuthenticated) return
  prevAuthenticated = state.isAuthenticated
  if (state.isAuthenticated) {
    refreshAllTokens()
  } else {
    Object.keys(tokenCache).forEach(k => {
      delete tokenCache[k]
    })
  }
})

function getTokenForAudience(audience?: string): string | null {
  if (audience) return tokenCache[audience] ?? null
  return tokenCache['_default'] ?? null
}

/** 服务名 → audience 映射 */
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

const request = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * 创建针对特定服务的请求实例
 * @param service 服务名称: 'hermes' | 'zwei' | 'auth'
 */
export function createServiceRequest(service: ServiceName) {
  const audience = serviceAudienceMap[service]

  const instance = axios.create({
    baseURL: apiEndpoints[service],
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  instance.interceptors.request.use(
    config => {
      const token = getTokenForAudience(audience)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    error => Promise.reject(error)
  )

  instance.interceptors.response.use(responseSuccessHandler, responseErrorHandler)

  return instance
}

// 预创建各服务的请求实例
export const hermesRequest = createServiceRequest('hermes')
export const zweiRequest = createServiceRequest('zwei')
export const chaosRequest = createServiceRequest('chaos')
export const authRequest = createServiceRequest('auth')

// 响应成功处理器
function responseSuccessHandler(response: AxiosResponse<ApiResponse>) {
  const { data } = response
  if (data.code !== undefined && data.code !== 0 && data.code !== 200) {
    const errorMsg = data.message || '请求失败'
    message.error(errorMsg)
    return Promise.reject(new Error(errorMsg))
  }
  if (data.data !== undefined) {
    return { ...response, data: data.data } as AxiosResponse<ApiResponse>
  }
  return response
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
        if (audience) {
          delete tokenCache[audience]
          getAuth()
            .refreshToken(undefined, audience)
            .then(resp => {
              tokenCache[audience] = resp.access_token
            })
            .catch(() => {
              useAuthStore.getState().logout()
            })
        } else {
          useAuthStore.getState().logout()
        }
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

// 默认请求实例的拦截器 - 支持动态路由
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.url) {
      // 从原始 URL 前缀推断服务和 audience
      const originalPath = config.url.startsWith('/') ? config.url.slice(1) : config.url
      const service = originalPath.split('/')[0] as string
      const audience = serviceAudienceMap[service]

      const { baseUrl, servicePath } = getServiceUrl(config.url)
      config.baseURL = baseUrl
      config.url = servicePath

      const token = getTokenForAudience(audience)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } else {
      const token = getTokenForAudience()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(responseSuccessHandler, responseErrorHandler)

// 便捷的 HTTP 方法封装
export async function get<T = unknown>(url: string, params?: Record<string, unknown>): Promise<T> {
  const response = await request.get<T>(url, { params })
  return response.data
}

export async function post<T = unknown>(url: string, data?: unknown): Promise<T> {
  const response = await request.post<T>(url, data)
  return response.data
}

export async function put<T = unknown>(url: string, data?: unknown): Promise<T> {
  const response = await request.put<T>(url, data)
  return response.data
}

export async function del<T = unknown>(url: string, data?: unknown): Promise<T> {
  const response = await request.delete<T>(url, { data })
  return response.data
}

export async function patch<T = unknown>(url: string, data?: unknown): Promise<T> {
  const response = await request.patch<T>(url, data)
  return response.data
}

export default request
