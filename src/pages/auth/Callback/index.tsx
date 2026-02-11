/**
 * OAuth 认证回调页面
 * 处理从 Aegis 认证服务器返回的授权码
 */

import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Spin, Result, Button } from 'antd'
import { useAuthStore } from '@/store/auth'
import styles from './index.module.scss'

export function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { handleCallback, error, clearError } = useAuthStore()
  const [processing, setProcessing] = useState(true)

  useEffect(() => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const errorParam = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    // 处理错误响应
    if (errorParam) {
      console.error('[AuthCallback] Error:', errorParam, errorDescription)
      queueMicrotask(() => setProcessing(false))
      return
    }

    // 没有授权码
    if (!code) {
      console.error('[AuthCallback] No authorization code')
      queueMicrotask(() => setProcessing(false))
      return
    }

    // 处理授权码
    handleCallback(code, state ?? undefined)
      .then(() => {
        // 获取之前保存的目标路径
        const returnTo = sessionStorage.getItem('auth_return_to') || '/'
        sessionStorage.removeItem('auth_return_to')
        navigate(returnTo, { replace: true })
      })
      .catch((err) => {
        console.error('[AuthCallback] Failed to handle callback:', err)
        queueMicrotask(() => setProcessing(false))
      })
  }, [searchParams, handleCallback, navigate])

  const handleRetry = () => {
    clearError()
    navigate('/', { replace: true })
  }

  if (processing && !error) {
    return (
      <div className={styles.container}>
        <Spin size="large" tip="正在完成登录..." />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Result
        status="error"
        title="登录失败"
        subTitle={error || searchParams.get('error_description') || '认证过程中发生错误'}
        extra={[
          <Button key="home" type="primary" onClick={handleRetry}>
            返回首页
          </Button>,
        ]}
      />
    </div>
  )
}
