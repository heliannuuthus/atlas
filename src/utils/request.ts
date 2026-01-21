import { message } from 'antd'
import type { AxiosResponse, AxiosError } from 'axios'
import axios from 'axios'
import { env } from '@/config/env'
import { useAuthStore } from '@/store/auth'

export interface ApiResponse<T = unknown> {
  code?: number
  message?: string
  data?: T
  [key: string]: unknown
}

const request = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

request.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
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
  },
  (error: AxiosError<ApiResponse>) => {
    if (error.response) {
      const { status, data } = error.response
      let errorMsg = '请求失败'

      switch (status) {
        case 401:
          errorMsg = '未授权，请重新登录'
          useAuthStore.getState().clearTokens()
          window.location.href = '/login'
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
)

export default request
