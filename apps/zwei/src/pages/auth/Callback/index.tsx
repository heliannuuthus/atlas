import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Spin, Button } from 'antd'
import { CloseCircleOutlined, HomeOutlined, ReloadOutlined } from '@ant-design/icons'
import { useAtlasAuth } from '@atlas/shared'
import styles from './index.module.scss'

export function AuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { handleCallback, error } = useAtlasAuth()
  const [processing, setProcessing] = useState(true)
  const initiatedRef = useRef(false)

  useEffect(() => {
    if (initiatedRef.current) return
    initiatedRef.current = true

    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const errorParam = searchParams.get('error')

    if (errorParam) {
      queueMicrotask(() => setProcessing(false))
      return
    }

    if (!code) {
      queueMicrotask(() => setProcessing(false))
      return
    }

    handleCallback(code, state ?? undefined)
      .then(({ returnTo }) => navigate(returnTo || '/', { replace: true }))
      .catch(() => queueMicrotask(() => setProcessing(false)))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleGoHome = () => navigate('/', { replace: true })
  const handleRetry = () => window.location.reload()

  if (processing && !error) {
    return (
      <div className={styles.container}>
        <Spin size="large" tip="正在完成登录..." />
      </div>
    )
  }

  const errorCode = searchParams.get('error')
  const errorMessage = error || searchParams.get('error_description') || '认证过程中发生错误'

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.icon}>
            <CloseCircleOutlined />
          </div>
          <h1 className={styles.title}>登录失败</h1>
          <p className={styles.subtitle}>认证过程中发生了错误，请重试或返回首页</p>
        </div>

        <div className={styles.info}>
          {errorCode && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>错误码</span>
              <span className={styles.infoValue}>
                <code className={styles.errorCode}>{errorCode}</code>
              </span>
            </div>
          )}
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>错误信息</span>
            <span className={`${styles.infoValue} ${styles.errorMessage}`}>
              {errorMessage}
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            type="primary"
            icon={<HomeOutlined />}
            onClick={handleGoHome}
            className={`${styles.actionButton} ${styles.primaryButton}`}
          >
            返回首页
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRetry}
            className={`${styles.actionButton} ${styles.secondaryButton}`}
          >
            重试
          </Button>
        </div>
      </div>
    </div>
  )
}
