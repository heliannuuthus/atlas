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

/** 默认授权选项 */
export const defaultAuthorizeOptions = {
  /** 目标服务 audience */
  audience: import.meta.env.VITE_AUTH_AUDIENCE || 'hermes',
  /** Scope */
  scopes: ['openid', 'profile', 'email'],
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
      debug: import.meta.env.DEV,
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

/** 允许跳转的认证域名白名单 */
const ALLOWED_AUTH_HOSTS = [
  'aegis.heliannuuthus.com',
  'localhost',
  '127.0.0.1',
]

/**
 * 验证跳转 URL 是否安全
 * 防止恶意配置篡改导致跳转到恶意地址
 */
export function isAllowedAuthUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ALLOWED_AUTH_HOSTS.some(host => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`))
  } catch {
    return false
  }
}
