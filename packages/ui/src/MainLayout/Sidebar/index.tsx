import { useMemo, type CSSProperties, type ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../components/tooltip'
import styles from './index.module.scss'

export interface SidebarMenuItem {
  key: string
  label: string
  icon?: ReactNode
  path: string
  section?: string
  badge?: number
  children?: SidebarMenuItem[]
  bottom?: boolean
}

export interface SidebarProps {
  collapsed: boolean
  menus: SidebarMenuItem[]
  logo: { icon?: ReactNode; text: string }
  brandColor?: string
  envLabel?: string
  logoActive?: boolean
  onLogoClick: () => void
  selectedKeys: string[]
  onMenuClick: (key: string) => void
}

export function Sidebar({
  collapsed,
  menus,
  logo,
  brandColor = '#2557d6',
  envLabel,
  logoActive = false,
  onLogoClick,
  selectedKeys,
  onMenuClick,
}: SidebarProps) {
  const mainMenus = menus.filter(m => !m.bottom)
  const bottomMenus = menus.filter(m => m.bottom)

  const sections = useMemo(() => {
    const groups: { section?: string; items: SidebarMenuItem[] }[] = []
    let currentSection: string | undefined
    let currentItems: SidebarMenuItem[] = []

    mainMenus.forEach(item => {
      if (item.section !== currentSection) {
        if (currentItems.length > 0) {
          groups.push({ section: currentSection, items: currentItems })
        }
        currentSection = item.section
        currentItems = [item]
      } else {
        currentItems.push(item)
      }
    })
    if (currentItems.length > 0) {
      groups.push({ section: currentSection, items: currentItems })
    }
    return groups
  }, [mainMenus])

  const renderItem = (item: SidebarMenuItem, nested = false) => {
    const active = selectedKeys.includes(item.path)
    const content = (
      <button
        type="button"
        className={`${styles.menuItem} ${active ? styles.menuItemActive : ''} ${nested ? styles.menuItemNested : ''}`}
        style={{ '--brand': brandColor } as CSSProperties}
        onClick={() => onMenuClick(item.path)}
        aria-current={active ? 'page' : undefined}
      >
        {item.icon ? <span className={styles.menuIcon}>{item.icon}</span> : null}
        {!collapsed ? <span className={styles.menuLabel}>{item.label}</span> : null}
        {!collapsed && item.badge ? (
          <span className={styles.badge}>{item.badge > 99 ? '99+' : item.badge}</span>
        ) : null}
        {!collapsed && item.children?.length ? <ChevronRight className={styles.chevron} /> : null}
      </button>
    )
    return (
      <div key={item.key}>
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        ) : (
          content
        )}
        {!collapsed ? item.children?.map(child => renderItem(child, true)) : null}
      </div>
    )
  }

  return (
    <div className={styles.sidebar}>
      {(logo.icon || !collapsed) && (
        <button
          type="button"
          className={`${styles.logo} ${logoActive ? styles.logoActive : ''}`}
          style={{ '--brand': brandColor } as CSSProperties}
          onClick={onLogoClick}
          aria-current={logoActive ? 'page' : undefined}
          aria-label={`打开${logo.text}`}
        >
          {logo.icon && <span className={styles.logoIcon}>{logo.icon}</span>}
          {!collapsed && (
            <span className={styles.logoContent}>
              <span className={styles.logoMain}>{logo.text}</span>
              {envLabel && <span className={styles.envBadge}>{envLabel}</span>}
            </span>
          )}
        </button>
      )}

      <div className={styles.navArea}>
        {sections.map((group, i) => (
          <div key={`${group.section ?? 'main'}-${i}`} className={styles.section}>
            {group.section && !collapsed && (
              <div className={styles.sectionTitle}>{group.section}</div>
            )}
            {collapsed && group.section && i > 0 && <div className={styles.sectionDivider} />}
            <nav className={styles.menu} aria-label={group.section ?? '主导航'}>
              {group.items.map(item => renderItem(item))}
            </nav>
          </div>
        ))}
      </div>

      {bottomMenus.length > 0 && (
        <div className={styles.bottomArea}>
          <nav className={styles.menu} aria-label="辅助导航">
            {bottomMenus.map(item => renderItem(item))}
          </nav>
        </div>
      )}
    </div>
  )
}
