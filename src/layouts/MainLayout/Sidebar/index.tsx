import { useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, ConfigProvider } from 'antd'
import type { MenuProps, ThemeConfig } from 'antd'
import { useBusinessStore } from '@/store/business'
import { businessConfigs } from '@/config/business'
import styles from './index.module.scss'

type MenuItem = Required<MenuProps>['items'][number]

interface SidebarProps {
  collapsed: boolean
}

export function Sidebar({ collapsed }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { currentBusiness } = useBusinessStore()

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key as string)
  }

  const getMenuItems = (): MenuItem[] => {
    if (!currentBusiness) {
      return []
    }

    const config = businessConfigs[currentBusiness.id]
    if (!config) {
      return []
    }

    return config.menus.map(menu => ({
      key: menu.path,
      icon: menu.icon,
      label: menu.label,
      children: menu.children?.map(child => ({
        key: child.path,
        icon: child.icon,
        label: child.label,
      })),
    }))
  }

  const menuItems = getMenuItems()
  const selectedKeys = [location.pathname]

  const handleLogoClick = () => {
    if (currentBusiness) {
      const config = businessConfigs[currentBusiness.id]
      if (config?.defaultPath) {
        navigate(config.defaultPath)
      } else {
        navigate(currentBusiness.path)
      }
    } else {
      navigate('/')
    }
  }

  const menuTheme: ThemeConfig = useMemo(() => ({
    components: {
      Menu: {
        itemMarginInline: collapsed ? 0 : 8,
        itemBorderRadius: 6,
        itemSelectedBg: '#f5f3ff',
        itemSelectedColor: '#7c3aed',
        subMenuItemBg: 'transparent',
        ...(collapsed && {
          itemPaddingInline: 20,
          iconSize: 16,
        }),
      },
    }),
    [collapsed]
  )

  const menuStyle = useMemo<React.CSSProperties>(
    () => ({
      width: '100%',
      height: '100%',
      borderRight: 'none',
      flex: 1,
    }),
    []
  )

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo} onClick={handleLogoClick}>
        <div className={styles.logoIcon}>
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="12" height="12" rx="3" fill="#7c3aed" opacity="0.9" />
            <rect x="17" y="3" width="12" height="12" rx="3" fill="#7c3aed" opacity="0.5" />
            <rect x="3" y="17" width="12" height="12" rx="3" fill="#7c3aed" opacity="0.5" />
            <rect x="17" y="17" width="12" height="12" rx="3" fill="#7c3aed" opacity="0.2" />
          </svg>
        </div>
        {!collapsed && (
          <span className={styles.logoText}>
            <span className={styles.logoMain}>{currentBusiness?.name || 'Atlas'}</span>
          </span>
        )}
      </div>
      {menuItems.length > 0 ? (
        <ConfigProvider theme={menuTheme}>
          <div className={styles.menuWrapper}>
            <Menu
              mode="inline"
              selectedKeys={selectedKeys}
              items={menuItems}
              onClick={handleMenuClick}
              inlineCollapsed={collapsed}
              triggerSubMenuAction="hover"
              style={menuStyle}
            />
          </div>
        </ConfigProvider>
      ) : (
        <div className={styles.empty}>请选择一个业务模块</div>
      )}
    </div>
  )
}
