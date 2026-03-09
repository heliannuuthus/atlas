import { useMemo } from 'react'
import { Menu, ConfigProvider } from 'antd'
import type { MenuProps, ThemeConfig } from 'antd'
import styles from './index.module.scss'

export interface SidebarMenuItem {
  key: string
  label: string
  icon?: React.ReactNode
  path: string
  section?: string
  badge?: number
  children?: SidebarMenuItem[]
  bottom?: boolean
}

export interface SidebarProps {
  collapsed: boolean
  menus: SidebarMenuItem[]
  logo: { icon: React.ReactNode; text: string }
  brandColor?: string
  envLabel?: string
  onLogoClick: () => void
  selectedKeys: string[]
  onMenuClick: (key: string) => void
}

type MenuItem = Required<MenuProps>['items'][number]

function toAntdMenuItems(menus: SidebarMenuItem[]): MenuItem[] {
  return menus.map((menu) => ({
    key: menu.path,
    icon: menu.icon,
    label: (
      <span className={styles.menuLabel}>
        {menu.label}
        {menu.badge ? <span className={styles.badge}>{menu.badge > 99 ? '99+' : menu.badge}</span> : null}
      </span>
    ),
    children: menu.children?.map((child) => ({
      key: child.path,
      icon: child.icon,
      label: child.label,
    })),
  }))
}

export function Sidebar({
  collapsed,
  menus,
  logo,
  brandColor = '#7c3aed',
  envLabel,
  onLogoClick,
  selectedKeys,
  onMenuClick,
}: SidebarProps) {
  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    onMenuClick(key as string)
  }

  const mainMenus = menus.filter((m) => !m.bottom)
  const bottomMenus = menus.filter((m) => m.bottom)

  const sections = useMemo(() => {
    const groups: { section?: string; items: SidebarMenuItem[] }[] = []
    let currentSection: string | undefined
    let currentItems: SidebarMenuItem[] = []

    mainMenus.forEach((item) => {
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

  const menuTheme: ThemeConfig = useMemo(() => ({
    components: {
      Menu: {
        itemMarginInline: collapsed ? 4 : 8,
        itemBorderRadius: 8,
        itemSelectedBg: `${brandColor}0d`,
        itemSelectedColor: brandColor,
        itemHoverBg: 'rgba(0, 0, 0, 0.03)',
        subMenuItemBg: 'transparent',
        activeBarBorderWidth: 0,
        ...(collapsed && {
          itemPaddingInline: 20,
          iconSize: 18,
        }),
      },
    },
  }), [collapsed, brandColor])

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo} onClick={onLogoClick}>
        <div className={styles.logoIcon} style={{ '--brand': brandColor } as React.CSSProperties}>
          {logo.icon}
        </div>
        {!collapsed && (
          <div className={styles.logoContent}>
            <span className={styles.logoMain}>{logo.text}</span>
            {envLabel && <span className={styles.envBadge}>{envLabel}</span>}
          </div>
        )}
      </div>

      <div className={styles.navArea}>
        <ConfigProvider theme={menuTheme}>
          {sections.map((group, i) => (
            <div key={i} className={styles.section}>
              {group.section && !collapsed && (
                <div className={styles.sectionTitle}>{group.section}</div>
              )}
              {collapsed && group.section && i > 0 && (
                <div className={styles.sectionDivider} />
              )}
              <Menu
                mode="inline"
                selectedKeys={selectedKeys}
                items={toAntdMenuItems(group.items)}
                onClick={handleMenuClick}
                inlineCollapsed={collapsed}
                triggerSubMenuAction="hover"
                className={styles.menu}
              />
            </div>
          ))}
        </ConfigProvider>
      </div>

      {bottomMenus.length > 0 && (
        <div className={styles.bottomArea}>
          <ConfigProvider theme={menuTheme}>
            <Menu
              mode="inline"
              selectedKeys={selectedKeys}
              items={toAntdMenuItems(bottomMenus)}
              onClick={handleMenuClick}
              inlineCollapsed={collapsed}
              triggerSubMenuAction="hover"
              className={styles.menu}
            />
          </ConfigProvider>
        </div>
      )}
    </div>
  )
}
