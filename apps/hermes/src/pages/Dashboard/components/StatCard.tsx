import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import styles from '../index.module.scss'

interface StatCardProps {
  icon: ReactNode
  title: string
  count: number
  color: string
  path: string
  loading?: boolean
}

export function StatCard({ icon, title, count, color, path, loading }: StatCardProps) {
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className={styles.stat}>
        <div className={styles.statShimmer} />
      </div>
    )
  }

  return (
    <button className={styles.stat} onClick={() => navigate(path)} type="button">
      <div className={styles.statIcon} style={{ color, background: `${color}0c` }}>
        {icon}
      </div>
      <div className={styles.statBody}>
        <span className={styles.statCount}>{count}</span>
        <span className={styles.statTitle}>{title}</span>
      </div>
    </button>
  )
}
