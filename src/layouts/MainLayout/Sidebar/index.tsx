import { useNavigate, useLocation } from 'react-router-dom'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import {
  MobileOutlined,
  UserOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import styles from './index.module.scss'

type MenuItem = Required<MenuProps>['items'][number]

const menuItems: MenuItem[] = [
  {
    key: '/miniprogram',
    icon: <MobileOutlined />,
    label: '小程序管理',
  },
  {
    key: '/users',
    icon: <UserOutlined />,
    label: '用户管理',
    disabled: true,
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: '系统设置',
    disabled: true,
  },
]

export function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    navigate(key as string)
  }

  // 根据当前路径确定选中的菜单项
  const pathSegments = location.pathname.split('/').filter(Boolean)
  const firstSegment = pathSegments[0] || 'miniprogram'
  const selectedKeys = [`/${firstSegment}`].filter((key) =>
    menuItems.some((item) => item?.key === key)
  )

  return (
    <div className={styles.sidebar}>
      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        items={menuItems}
        onClick={handleMenuClick}
        className={styles.menu}
      />
    </div>
  )
}
