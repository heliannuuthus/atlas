import { Avatar, Badge, Tooltip, Dropdown, MenuProps } from 'antd'
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '@/store/auth'
import styles from './index.module.scss'

const getUserInitials = (name?: string) => {
  if (!name) return 'U'
  const chars = name.trim()
  if (/^[\u4e00-\u9fa5]/.test(chars)) {
    return chars.substring(0, 1)
  }
  const parts = chars.split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return chars.substring(0, 2).toUpperCase()
}

export function UserMenu() {
  const { logout, user } = useAuthStore()
  const userName = user?.nic
  const userAvatar = user?.pic ?? null
  const notificationCount = 3

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'profile':
        console.log('个人中心')
        break
      case 'settings':
        console.log('设置')
        break
      case 'help':
        console.log('帮助文档')
        break
      case 'logout':
        logout()
        break
    }
  }

  const menuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      key: 'help',
      icon: <QuestionCircleOutlined />,
      label: '帮助文档',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ]

  return (
    <div className={styles.headerActions}>
      <Tooltip title="通知" placement="bottom">
        <div className={styles.iconButton}>
          <Badge count={notificationCount} size="small" offset={[-2, 2]}>
            <BellOutlined className={styles.headerIcon} />
          </Badge>
        </div>
      </Tooltip>

      <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} placement="bottomRight">
        <div className={styles.avatarWrapper}>
          {userAvatar ? (
            <Avatar src={userAvatar} size={28} />
          ) : (
            <Avatar size={28} style={{ backgroundColor: '#7c3aed' }}>
              {getUserInitials(userName)}
            </Avatar>
          )}
          <span className={styles.userName}>{userName}</span>
        </div>
      </Dropdown>
    </div>
  )
}
