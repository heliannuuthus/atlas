import { type KeyboardEvent, type ReactNode } from 'react'
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
  right?: ReactNode
  brandColor?: string
}

export function TopNavLayout({
  logo,
  menus,
  onLogoClick,
  onMenuClick,
  right,
  brandColor = '#b94e20',
}: TopNavLayoutProps) {
  const location = useLocation()

  const activeKey = menus.reduce<string | null>((matched, item) => {
    if (location.pathname.startsWith(item.path)) {
      if (!matched || item.path.length > matched.length) return item.path
    }
    return matched
  }, null)

  const handleLogoKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onLogoClick?.()
    }
  }

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerGlow} />
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            <div
              className={styles.logo}
              onClick={onLogoClick}
              onKeyDown={handleLogoKeyDown}
              role="button"
              tabIndex={0}
            >
              <span className={styles.logoIcon}>{logo.icon}</span>
              <span className={styles.logoText}>{logo.text}</span>
            </div>
          </div>
          <nav className={styles.headerCenter} aria-label="Primary">
            <div className={styles.nav}>
              {menus.map(item => (
                <button
                  key={item.key}
                  type="button"
                  className={`${styles.navItem} ${activeKey === item.path ? styles.navItemActive : ''}`}
                  onClick={() => onMenuClick?.(item.path)}
                  aria-current={activeKey === item.path ? 'page' : undefined}
                  style={{ '--brand': brandColor } as React.CSSProperties}
                >
                  {item.icon && <span className={styles.navItemIcon}>{item.icon}</span>}
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
          <div className={styles.headerRight}>{right}</div>
        </div>
      </header>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
