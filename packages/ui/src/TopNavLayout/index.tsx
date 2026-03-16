import { type ReactNode } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import styles from './index.module.scss'

export interface TopNavMenuItem {
  key: string
  label: string
  icon?: ReactNode
  path: string
}

export interface TopNavLayoutProps {
  logo: { icon: ReactNode; text: string }
  menus: TopNavMenuItem[]
  selectedKey?: string
  onLogoClick?: () => void
  onMenuClick?: (path: string) => void
  left?: ReactNode
  right?: ReactNode
  brandColor?: string
}

export function TopNavLayout({
  logo,
  menus,
  onLogoClick,
  onMenuClick,
  left,
  right,
  brandColor = '#059669',
}: TopNavLayoutProps) {
  const location = useLocation()

  const activeKey = menus.reduce<string | null>((matched, item) => {
    if (location.pathname.startsWith(item.path)) {
      if (!matched || item.path.length > matched.length) return item.path
    }
    return matched
  }, null)

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            <div
              className={styles.logo}
              onClick={onLogoClick}
              role="button"
              tabIndex={0}
              style={{ '--brand': brandColor } as React.CSSProperties}
            >
              <span className={styles.logoIcon}>{logo.icon}</span>
              <span className={styles.logoText}>{logo.text}</span>
            </div>
            <nav className={styles.nav}>
              {menus.map(item => (
                <button
                  key={item.key}
                  className={`${styles.navItem} ${activeKey === item.path ? styles.navItemActive : ''}`}
                  onClick={() => onMenuClick?.(item.path)}
                  style={{ '--brand': brandColor } as React.CSSProperties}
                >
                  {item.icon && <span className={styles.navItemIcon}>{item.icon}</span>}
                  {item.label}
                </button>
              ))}
            </nav>
            {left && <div className={styles.leftSlot}>{left}</div>}
          </div>
          <div className={styles.headerRight}>{right}</div>
        </div>
      </header>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
