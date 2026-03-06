import { useLocation } from 'react-router-dom'
import { Layout } from 'antd'
import { UserMenu } from './UserMenu'
import { Breadcrumb } from '@/components/Breadcrumb'
import styles from './index.module.scss'

const { Header: AntHeader } = Layout

export function Header() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <AntHeader className={`${styles.header} ${isHomePage ? styles.homeHeader : ''}`}>
      <div className={styles.left}>
        {isHomePage && (
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="8" width="20" height="20" rx="5" fill="#7c3aed" opacity="0.9" />
                <rect x="36" y="8" width="20" height="20" rx="5" fill="#7c3aed" opacity="0.5" />
                <rect x="8" y="36" width="20" height="20" rx="5" fill="#7c3aed" opacity="0.5" />
                <rect x="36" y="36" width="20" height="20" rx="5" fill="#7c3aed" opacity="0.2" />
              </svg>
            </div>
            <span className={styles.logoText}>
              <span className={styles.logoMain}>Atlas</span>
            </span>
          </div>
        )}
        {!isHomePage && <Breadcrumb />}
      </div>
      <div className={styles.right}>
        <UserMenu />
      </div>
    </AntHeader>
  )
}
