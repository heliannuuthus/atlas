import React from 'react'
import { Button } from 'antd'
import {
  ReloadOutlined,
  HomeOutlined,
  ArrowLeftOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './index.module.scss'

export function ErrorDisplay({
  error,
  errorInfo,
  onReset,
}: {
  error: Error | null
  errorInfo?: React.ErrorInfo
  onReset: () => void
}) {
  const location = useLocation()
  const navigate = useNavigate()

  const errorMessage = error?.message || '发生了未知错误'
  const errorStack = error?.stack || ''
  const componentStack = errorInfo?.componentStack || ''

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.icon}>
            <CloseCircleOutlined />
          </div>
          <h1 className={styles.title}>页面加载失败</h1>
          <p className={styles.subtitle}>抱歉，页面遇到了一个错误</p>
        </div>

        <div className={styles.info}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>访问路由</span>
            <span className={styles.infoValue}>
              <code className={styles.routePath}>{location.pathname}</code>
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>错误信息</span>
            <span className={`${styles.infoValue} ${styles.errorMessage}`}>{errorMessage}</span>
          </div>
        </div>

        {(errorStack || componentStack) && (
          <div className={styles.details}>
            <div className={styles.detailsTitle}>错误详情</div>
            <div className={styles.codeBlock}>
              <div className={styles.errorMessageBlock}>
                <p className={styles.errorMessageText}>{errorMessage}</p>
              </div>
              {errorStack && (
                <div className={styles.stackSection}>
                  <div className={styles.stackLabel}>错误堆栈</div>
                  <pre className={styles.stackContent}>{errorStack}</pre>
                </div>
              )}
              {componentStack && (
                <div className={styles.stackSection}>
                  <div className={styles.stackLabel}>组件堆栈</div>
                  <pre className={styles.stackContent}>{componentStack}</pre>
                </div>
              )}
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <Button
            type="primary"
            icon={<HomeOutlined />}
            onClick={() => navigate('/')}
            className={`${styles.actionButton} ${styles.primaryButton}`}
          >
            回到主页
          </Button>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className={`${styles.actionButton} ${styles.secondaryButton}`}
          >
            返回上一页
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => window.location.reload()}
            className={`${styles.actionButton} ${styles.secondaryButton}`}
          >
            刷新页面
          </Button>
          <Button onClick={onReset} className={`${styles.actionButton} ${styles.secondaryButton}`}>
            重试
          </Button>
        </div>
      </div>
    </div>
  )
}
