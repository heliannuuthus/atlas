import { Layout } from 'antd'
import type { ReactNode } from 'react'
import styles from './index.module.scss'

const { Header: AntHeader } = Layout

interface HeaderProps {
  left?: ReactNode
  center?: ReactNode
  right?: ReactNode
}

export function Header({ left, center, right }: HeaderProps) {
  return (
    <AntHeader className={styles.header}>
      <div className={styles.left}>
        {left}
      </div>
      {center && <div className={styles.center}>{center}</div>}
      <div className={styles.right}>
        {right}
      </div>
    </AntHeader>
  )
}
