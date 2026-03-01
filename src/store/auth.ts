import { create } from 'zustand'
import type { TokenResponse } from '@aegis/sdk'
import { getAuth, defaultAuthorizeOptions, isAllowedAuthUrl } from '@/config/auth'

interface AuthState {
  /** 是否已认证 */
  isAuthenticated: boolean
  /** 是否正在加载 */
  isLoading: boolean
  /** 用户信息 */
  user: Record<string, unknown> | null
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
  /** 获取 Access Token */
  getAccessToken: () => Promise<string | null>
  /** 刷新用户信息 */
  refreshUserInfo: () => Promise<void>
  /** 清除错误 */
  clearError: () => void
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  isAuthenticated: false,
  isLoading: true,
  user: null,
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
        const claims = await auth.getClaims()
        set({ isAuthenticated: true, user: claims, isLoading: false })
      } else {
        console.log('[Auth] initialize: not authenticated, setting isAuthenticated=false')
        set({ isAuthenticated: false, user: null, isLoading: false })
      }
    } catch (error) {
      console.error('[Auth] Initialize failed:', error)
      set({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },

  login: async () => {
    const auth = getAuth()
    try {
      set({ error: null })

      // 发起授权，指定目标服务和 scope
      const { url } = await auth.authorize({
        audience: defaultAuthorizeOptions.audience,
        scopes: defaultAuthorizeOptions.scopes,
      })

      // 验证跳转 URL 是否在白名单内，防止恶意配置篡改
      if (!isAllowedAuthUrl(url)) {
        console.error('[Auth] Blocked redirect to untrusted URL:', url)
        // 跳转到空白页，阻止恶意跳转
        window.location.href = 'about:blank'
        return
      }

      // 跳转到认证页面
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
      set({ isAuthenticated: false, user: null, error: null })
    } catch (error) {
      console.error('[Auth] Logout failed:', error)
      // 即使登出 API 失败，也清除本地状态
      set({ isAuthenticated: false, user: null })
    }
  },

  getAccessToken: async () => {
    const auth = getAuth()
    try {
      const token = await auth.getAccessToken()
      if (!token && get().isAuthenticated) {
        // Token 失效，更新状态
        set({ isAuthenticated: false, user: null })
      }
      return token
    } catch (error) {
      console.error('[Auth] Get access token failed:', error)
      return null
    }
  },

  refreshUserInfo: async () => {
    const auth = getAuth()
    try {
      const claims = await auth.getClaims()
      set({ user: claims })
    } catch (error) {
      console.error('[Auth] Refresh user info failed:', error)
    }
  },

  clearError: () => set({ error: null }),
}))
