import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, Button, ConfigProvider } from 'antd'
import type { MenuProps, ThemeConfig } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { useBusinessStore } from '@/store/business'
import { businessConfigs } from '@/config/business'
import styles from './index.module.scss'

type MenuItem = Required<MenuProps>['items'][number]

interface SidebarProps {
  collapsed: boolean
  onCollapse: (collapsed: boolean) => void
}

export function Sidebar({ collapsed, onCollapse }: SidebarProps) {
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

    return config.menus.map((menu) => ({
      key: menu.path,
      icon: menu.icon,
      label: menu.label,
      children: menu.children?.map((child) => ({
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

  const menuTheme: ThemeConfig = {
    components: {
      Menu: {
        itemMarginInline: collapsed ? 0 : 8,
        itemBorderRadius: 6,
        itemSelectedBg: '#e6f7ff',
        itemSelectedColor: '#1890ff',
        subMenuItemBg: 'transparent',
        ...(collapsed && {
          itemPaddingInline: 20,
          iconSize: 16,
        }),
      },
    },
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.logo} onClick={handleLogoClick}>
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
        {!collapsed && (
          <span className={styles.logoText}>
            <span className={styles.logoMain}>择味</span>
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
            />
          </div>
        </ConfigProvider>
      ) : (
        <div className={styles.empty}>请选择一个业务模块</div>
      )}
      <div className={styles.collapseButton}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => onCollapse(!collapsed)}
          className={styles.collapseBtn}
        />
      </div>
    </div>
  )
}
