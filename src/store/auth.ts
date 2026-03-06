import { create } from 'zustand'
import type { TokenResponse, IDTokenClaims } from '@aegis/sdk'
import { getAuth, defaultAuthorizeOptions } from '@/config/auth'

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  user: IDTokenClaims | null

  initialize: () => Promise<void>
  login: (returnTo?: string) => Promise<void>
  handleCallback: (code: string, state?: string) => Promise<TokenResponse>
  logout: () => Promise<void>
  getAccessToken: (audience?: string) => Promise<string | null>
  consumeReturnTo: () => Promise<string | null>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  isAuthenticated: false,
  isLoading: true,
  error: null,
  user: null,

  initialize: async () => {
    if (get().isAuthenticated) {
      set({ isLoading: false })
      return
    }
    const auth = getAuth()
    try {
      set({ isLoading: true, error: null })
      const authenticated = await auth.isAuthenticated()

      if (authenticated) {
        const user = await auth.getUser()
        set({ isAuthenticated: true, isLoading: false, user })
      } else {
        set({ isAuthenticated: false, isLoading: false, user: null })
      }
    } catch (error) {
      console.error('[Auth] Initialize failed:', error)
      set({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },

  login: async (returnTo?: string) => {
    const auth = getAuth()
    try {
      set({ error: null })

      if (returnTo) {
        await auth.saveReturnTo(returnTo)
      }

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
      const user = await auth.getUser()
      set({ isAuthenticated: true, isLoading: false, user })
      return tokens
    } catch (error) {
      console.error('[Auth] Callback handling failed:', error)
      set({
        isLoading: false,
        user: null,
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
      set({ isAuthenticated: false, user: null })
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

  consumeReturnTo: async () => {
    const auth = getAuth()
    return auth.consumeReturnTo()
  },

  clearError: () => set({ error: null }),
}))
