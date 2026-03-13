import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Spin } from 'antd'
import { useAtlasAuth } from '../../hooks/useAtlasAuth'
import styles from './index.module.scss'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const location = useLocation()
  const { isAuthenticated, isLoading, login } = useAtlasAuth()
  const isCallbackRoute = location.pathname === '/auth/callback'

  useEffect(() => {
    if (!isCallbackRoute && !isLoading && !isAuthenticated) {
      const returnTo = location.pathname + location.search
      login(returnTo)
    }
  }, [isLoading, isAuthenticated, location, login, isCallbackRoute])

  if (isCallbackRoute) {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    )
  }

  return <>{children}</>
}
