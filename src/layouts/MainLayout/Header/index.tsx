import { Layout } from 'antd'
import { UserMenu } from './UserMenu'
import { ServiceSwitcher } from '@/components/ServiceSwitcher'
import styles from './index.module.scss'

const { Header: AntHeader } = Layout

export function Header() {
  return (
    <>
      <ServiceSwitcher />
      <AntHeader className={styles.header}>
        <div className={styles.left}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1890ff" />
                    <stop offset="100%" stopColor="#722ed1" />
                  </linearGradient>
                </defs>
                <rect x="3" y="3" width="12" height="12" rx="3" fill="url(#logoGradient)" opacity="0.9" />
                <rect x="17" y="3" width="12" height="12" rx="3" fill="url(#logoGradient)" opacity="0.6" />
                <rect x="3" y="17" width="12" height="12" rx="3" fill="url(#logoGradient)" opacity="0.6" />
                <rect x="17" y="17" width="12" height="12" rx="3" fill="url(#logoGradient)" opacity="0.3" />
              </svg>
            </div>
            <span className={styles.logoText}>
              <span className={styles.logoMain}>择味</span>
              <span className={styles.logoSub}>Atlas</span>
            </span>
          </div>
        </div>
        <div className={styles.right}>
          <UserMenu />
        </div>
      </AntHeader>
    </>
  )
}
