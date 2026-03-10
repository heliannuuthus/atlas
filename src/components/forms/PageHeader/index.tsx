import type { ReactNode } from 'react'
import { Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
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

  return (
    <div className={styles.header}>
      <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
        返回
      </Button>
      <div className={styles.title}>{title}</div>
      {extra && <div className={styles.extra}>{extra}</div>}
    </div>
  )
}
