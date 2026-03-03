/**
 * Aegis Auth 配置
 */

import { Auth } from '@aegis/sdk'
import { apiEndpoints } from './env'

/** Auth 配置 */
export const authConfig = {
  /** Aegis 认证服务器地址（必填） */
  endpoint: apiEndpoints.auth.replace('/api', ''),
  /** 应用 Client ID（必填） */
  clientId: import.meta.env.VITE_AUTH_CLIENT_ID || 'atlas',
  /** 回调地址（可选，需要前端换取 token 时才需要） */
  redirectUri: import.meta.env.VITE_AUTH_REDIRECT_URI || `${window.location.origin}/auth/callback`,
}

/** 默认 scope 列表 */
const defaultScopes = ['openid', 'profile', 'email']
const defaultScopeString = defaultScopes.join(' ')

/** 默认授权选项 */
export const defaultAuthorizeOptions = {
  scopes: defaultScopes,
  audiences: {
    hermes: { scope: defaultScopeString },
    zwei: { scope: defaultScopeString },
    chaos: { scope: defaultScopeString },
  } as Record<string, { scope?: string }>,
}

/** Auth 单例 */
let authInstance: Auth | null = null

/**
 * 获取 Auth 实例
 */
export function getAuth(): Auth {
  if (!authInstance) {
    authInstance = new Auth({
      endpoint: authConfig.endpoint,
      clientId: authConfig.clientId,
      redirectUri: authConfig.redirectUri,
    })
  }
  return authInstance
}

/**
 * 重置 Auth（用于测试或重新初始化）
 */
export function resetAuth(): void {
  authInstance = null
}

