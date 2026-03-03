import { create } from 'zustand'
import type { TokenResponse } from '@aegis/sdk'
import { getAuth, defaultAuthorizeOptions } from '@/config/auth'

interface AuthState {
  /** 是否已认证 */
  isAuthenticated: boolean
  /** 是否正在加载 */
  isLoading: boolean
  /** 错误信息 */
  error: string | null

  /** 初始化认证状态 */
  initialize: () => Promise<void>
  /** 发起登录 */
  login: () => Promise<void>
  /** 处理登录回调 */
  handleCallback: (code: string, state?: string) => Promise<TokenResponse>
  /** 登出 */
  logout: () => Promise<void>
  /** 获取 Access Token（可指定 audience） */
  getAccessToken: (audience?: string) => Promise<string | null>
  /** 清除错误 */
  clearError: () => void
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  isAuthenticated: false,
  isLoading: true,
  error: null,

  initialize: async () => {
    if (get().isAuthenticated) {
      set({ isLoading: false })
      return
    }
    const auth = getAuth()
    try {
      set({ isLoading: true, error: null })
      const authenticated = await auth.isAuthenticated()
      console.log('[Auth] initialize: isAuthenticated =', authenticated)

      if (authenticated) {
        set({ isAuthenticated: true, isLoading: false })
      } else {
        set({ isAuthenticated: false, isLoading: false })
      }
    } catch (error) {
      console.error('[Auth] Initialize failed:', error)
      set({
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },

  login: async () => {
    const auth = getAuth()
    try {
      set({ error: null })

      const { url } = await auth.authorize({
        scopes: defaultAuthorizeOptions.scopes,
        audiences: defaultAuthorizeOptions.audiences,
      })

      window.location.href = url
    } catch (error) {
      console.error('[Auth] Login failed:', error)
      set({ error: error instanceof Error ? error.message : 'Login failed' })
      throw error
    }
  },

  handleCallback: async (code: string, state?: string) => {
    const auth = getAuth()
    try {
      set({ isLoading: true, error: null })
      const tokens = await auth.handleCallback(code, state)
      set({ isAuthenticated: true, isLoading: false })
      return tokens
    } catch (error) {
      console.error('[Auth] Callback handling failed:', error)
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Callback failed',
      })
      throw error
    }
  },

  logout: async () => {
    const auth = getAuth()
    try {
      await auth.logout()
      set({ isAuthenticated: false, error: null })
    } catch (error) {
      console.error('[Auth] Logout failed:', error)
      set({ isAuthenticated: false })
    }
  },

  getAccessToken: async (audience?: string) => {
    const auth = getAuth()
    try {
      const token = await auth.getAccessToken(audience)
      if (!token && !audience && get().isAuthenticated) {
        set({ isAuthenticated: false })
      }
      return token
    } catch (error) {
      console.error('[Auth] Get access token failed:', error)
      return null
    }
  },

  clearError: () => set({ error: null }),
}))
