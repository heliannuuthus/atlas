/**
 * OAuth 认证回调页面
 * 处理从 Aegis 认证服务器返回的授权码
 */

import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Spin, Result, Button } from 'antd'
import { useAuthStore } from '@/store/auth'
import styles from './index.module.scss'

export function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { handleCallback, error, clearError } = useAuthStore()
  const [processing, setProcessing] = useState(true)
  const initiatedRef = useRef(false)

  useEffect(() => {
    if (initiatedRef.current) return
    initiatedRef.current = true

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
    console.log(
      '[AuthCallback] Processing code:',
      code.substring(0, 8) + '...',
      'state:',
      state?.substring(0, 8)
    )
    console.log('[AuthCallback] localStorage before handleCallback:', {
      codeVerifier: !!localStorage.getItem('aegis_code_verifier'),
      state: !!localStorage.getItem('aegis_state'),
      redirectUri: localStorage.getItem('aegis_redirect_uri'),
      audience: localStorage.getItem('aegis_audience'),
    })
    handleCallback(code, state ?? undefined)
      .then(tokens => {
        console.log('[AuthCallback] handleCallback success:', {
          hasAccessToken: !!tokens?.access_token,
          expiresIn: tokens?.expires_in,
          scope: tokens?.scope,
        })
        console.log('[AuthCallback] localStorage after handleCallback:', {
          accessToken: !!localStorage.getItem('aegis_access_token'),
          refreshToken: !!localStorage.getItem('aegis_refresh_token'),
          expiresAt: localStorage.getItem('aegis_expires_at'),
        })
        const returnTo = sessionStorage.getItem('auth_return_to') || '/'
        sessionStorage.removeItem('auth_return_to')
        console.log('[AuthCallback] Navigating to:', returnTo)
        navigate(returnTo, { replace: true })
      })
      .catch(err => {
        console.error('[AuthCallback] Failed to handle callback:', err)
        console.error('[AuthCallback] Error details:', {
          code: err?.code,
          message: err?.message,
          description: err?.description,
        })
        queueMicrotask(() => setProcessing(false))
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
