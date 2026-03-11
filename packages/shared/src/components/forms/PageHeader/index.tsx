import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Tooltip } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import styles from './index.module.scss'

interface PageHeaderProps {
  title: string
  backPath?: string
  onBack?: () => void | Promise<void>
  extra?: ReactNode
}

export function PageHeader({ title, backPath, onBack, extra }: PageHeaderProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      void onBack()
    } else if (backPath) {
      navigate(backPath)
    }
  }

  const showBack = !!backPath || !!onBack

  return (
    <div className={styles.header}>
      <div className={styles.titleRow}>
        {showBack && (
          <Tooltip title="返回" placement="bottomLeft">
            <Button
              type="text"
              icon={<ArrowLeftOutlined style={{ fontSize: '16px' }} />}
              onClick={handleBack}
              className={styles.backBtn}
            />
          </Tooltip>
        )}
        <div className={styles.title}>{title}</div>
      </div>
      {extra && <div className={styles.extra}>{extra}</div>}
    </div>
  )
}
