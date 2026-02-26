/**
 * 认证路由守卫
 * 保护需要登录的路由，未登录时自动跳转到认证页面
 */

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Spin } from 'antd'
import { useAuthStore } from '@/store/auth'
import styles from './index.module.scss'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const location = useLocation()
  const { isAuthenticated, isLoading, initialize, login } = useAuthStore()

  // 初始化认证状态
  useEffect(() => {
    console.log('[AuthGuard] Initializing auth state...', {
      path: location.pathname,
      accessToken: !!localStorage.getItem('aegis_access_token'),
      expiresAt: localStorage.getItem('aegis_expires_at'),
    })
    initialize()
  }, [initialize])

  // 未认证时跳转登录
  useEffect(() => {
    console.log('[AuthGuard] Auth state changed:', { isLoading, isAuthenticated, path: location.pathname })
    if (!isLoading && !isAuthenticated) {
      console.log('[AuthGuard] Not authenticated, redirecting to login. localStorage:', {
        accessToken: !!localStorage.getItem('aegis_access_token'),
        refreshToken: !!localStorage.getItem('aegis_refresh_token'),
        expiresAt: localStorage.getItem('aegis_expires_at'),
      })
      // 保存当前路径，登录后返回
      sessionStorage.setItem('auth_return_to', location.pathname + location.search)
      login()
    }
  }, [isLoading, isAuthenticated, location, login])

  // 加载中
  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" tip="加载中..." />
      </div>
    )
  }

  // 未认证，正在跳转
  if (!isAuthenticated) {
    return (
      <div className={styles.loading}>
        <Spin size="large" tip="正在跳转登录..." />
      </div>
    )
  }

  return <>{children}</>
}
