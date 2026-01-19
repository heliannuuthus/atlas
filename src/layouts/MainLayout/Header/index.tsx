import { Layout } from 'antd'
import { TenantSelector } from './TenantSelector'
import { UserMenu } from './UserMenu'
import styles from './index.module.scss'

const { Header: AntHeader } = Layout

export function Header() {
  return (
    <AntHeader className={styles.header}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <span className={styles.logoText}>择味管理后台</span>
        </div>
        <TenantSelector />
      </div>
      <div className={styles.right}>
        <UserMenu />
      </div>
    </AntHeader>
  )
}
