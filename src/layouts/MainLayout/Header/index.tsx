import { useLocation } from 'react-router-dom'
import { Layout } from 'antd'
import { UserMenu } from './UserMenu'
import { ServiceSwitcher } from '@/components/ServiceSwitcher'
import { Breadcrumb } from '@/components/Breadcrumb'
import styles from './index.module.scss'

const { Header: AntHeader } = Layout

export function Header() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <>
      <ServiceSwitcher />
      <AntHeader className={`${styles.header} ${isHomePage ? styles.homeHeader : ''}`}>
        <div className={styles.left}>
          {isHomePage && (
            <div className={styles.logo}>
              <div className={styles.logoIcon}>
                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient
                      id="atlasHeaderLogoGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#1890ff" />
                      <stop offset="50%" stopColor="#722ed1" />
                      <stop offset="100%" stopColor="#13c2c2" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="url(#atlasHeaderLogoGradient)"
                    opacity="0.1"
                  />
                  <path
                    d="M32 12 L42 24 L38 28 L32 20 L26 28 L22 24 Z"
                    fill="url(#atlasHeaderLogoGradient)"
                    opacity="0.9"
                  />
                  <path
                    d="M32 20 L42 32 L38 36 L32 28 L26 36 L22 32 Z"
                    fill="url(#atlasHeaderLogoGradient)"
                    opacity="0.7"
                  />
                  <path
                    d="M32 28 L42 40 L38 44 L32 36 L26 44 L22 40 Z"
                    fill="url(#atlasHeaderLogoGradient)"
                    opacity="0.5"
                  />
                  <circle cx="32" cy="32" r="3" fill="url(#atlasHeaderLogoGradient)" />
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
    </>
  )
}
