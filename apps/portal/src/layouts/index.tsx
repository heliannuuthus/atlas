import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import { UserMenu } from '@atlas/ui'
import styles from './index.module.scss'

const { Header: AntHeader, Content } = Layout

export function PortalLayout() {
  return (
    <Layout className={styles.layout}>
      <AntHeader className={styles.header}>
        <div className={styles.left}>
          <a href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg viewBox="0 0 48 48" fill="none">
                <rect x="4" y="4" width="17" height="17" rx="5" fill="#18181b" opacity="0.9" />
                <rect x="27" y="4" width="17" height="17" rx="5" fill="#18181b" opacity="0.4" />
                <rect x="4" y="27" width="17" height="17" rx="5" fill="#18181b" opacity="0.4" />
                <rect x="27" y="27" width="17" height="17" rx="5" fill="#18181b" opacity="0.15" />
              </svg>
            </div>
            <span className={styles.logoText}>Atlas</span>
          </a>
        </div>
        <div className={styles.right}>
          <UserMenu brandColor="#18181b" />
        </div>
      </AntHeader>
      <Content className={styles.content}>
        <Outlet />
      </Content>
    </Layout>
  )
}
