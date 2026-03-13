import { useNavigate } from 'react-router-dom'
import { Spin, Button, Result } from 'antd'
import { HomeOutlined, ReloadOutlined } from '@ant-design/icons'
import { useAuthCallback } from '@atlas/shared'
import styles from './index.module.scss'

export function AuthCallback() {
  const navigate = useNavigate()
  const { processing, error } = useAuthCallback()

  if (processing) {
    return (
      <div className={styles.container}>
        <Spin size="large" tip="正在完成登录..." />
      </div>
    )
  }

  if (!error) return null

  return (
    <div className={styles.container}>
      <Result
        status="error"
        title="登录失败"
        subTitle={error}
        extra={[
          <Button
            type="primary"
            icon={<HomeOutlined />}
            onClick={() => navigate('/', { replace: true })}
            key="home"
          >
            返回首页
          </Button>,
          <Button
            icon={<ReloadOutlined />}
            onClick={() => window.location.reload()}
            key="retry"
          >
            重试
          </Button>,
        ]}
      />
    </div>
  )
}
