import { message } from 'antd'
import type { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { getServiceUrl, apiEndpoints, type ServiceName } from '@/config/env'
import { useAuthStore } from '@/store/auth'

// 用于存储当前的 access token（同步获取）
let cachedAccessToken: string | null = null

// 订阅 auth store 变化来更新缓存的 token
useAuthStore.subscribe((state) => {
  // 当认证状态变化时，尝试刷新 token
  if (state.isAuthenticated) {
    state.getAccessToken().then((token) => {
      cachedAccessToken = token
    })
  } else {
    cachedAccessToken = null
  }
})

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
  const instance = axios.create({
    baseURL: apiEndpoints[service],
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // 复用相同的拦截器逻辑
  instance.interceptors.request.use(
    (config) => {
      if (cachedAccessToken) {
        config.headers.Authorization = `Bearer ${cachedAccessToken}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  instance.interceptors.response.use(
    responseSuccessHandler,
    responseErrorHandler
  )

  return instance
}

// 预创建各服务的请求实例
export const hermesRequest = createServiceRequest('hermes')
export const zweiRequest = createServiceRequest('zwei')
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

// 响应错误处理器
function responseErrorHandler(error: AxiosError<ApiResponse>) {
  if (error.response) {
    const { status, data } = error.response
    let errorMsg = '请求失败'

    switch (status) {
      case 401:
        errorMsg = '未授权，请重新登录'
        useAuthStore.getState().logout()
        break
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
    if (cachedAccessToken) {
      config.headers.Authorization = `Bearer ${cachedAccessToken}`
    }

    // 根据 URL 路径动态设置 baseURL
    if (config.url) {
      const { baseUrl, servicePath } = getServiceUrl(config.url)
      config.baseURL = baseUrl
      config.url = servicePath
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  responseSuccessHandler,
  responseErrorHandler
)

export default request
