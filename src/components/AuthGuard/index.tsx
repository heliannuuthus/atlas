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

  useEffect(() => {
    initialize()
  }, [initialize, location.pathname])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const returnTo = location.pathname + location.search
      login(returnTo)
    }
  }, [isLoading, isAuthenticated, location, login])

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" tip="加载中..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.loading}>
        <Spin size="large" tip="正在跳转登录..." />
      </div>
    )
  }

  return <>{children}</>
}
