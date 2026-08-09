import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
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
          <button
            type="button"
            title="返回"
            aria-label="返回"
            onClick={handleBack}
            className={styles.backBtn}
          >
            <ArrowLeft size={16} />
          </button>
        )}
        <div className={styles.title}>{title}</div>
      </div>
      {extra && <div className={styles.extra}>{extra}</div>}
    </div>
  )
}
