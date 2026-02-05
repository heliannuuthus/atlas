import { Card, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import styles from '../index.module.scss'

const { Text } = Typography

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

  return (
    <Card
      className={styles.statCard}
      hoverable
      onClick={() => navigate(path)}
      loading={loading}
    >
      <div className={styles.statIcon} style={{ color, backgroundColor: `${color}10` }}>
        {icon}
      </div>
      <div className={styles.statContent}>
        <Text type="secondary" className={styles.statTitle}>
          {title}
        </Text>
        <div className={styles.statCount}>{count}</div>
      </div>
    </Card>
  )
}
