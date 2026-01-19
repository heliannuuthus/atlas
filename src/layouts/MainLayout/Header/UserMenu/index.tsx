import { useMemo } from 'react'
import { Avatar, Badge, Tooltip, Dropdown, MenuProps } from 'antd'
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
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

const getAvatarColor = (name: string) => {
  const colors = [
    ['#667eea', '#764ba2'],
    ['#f093fb', '#f5576c'],
    ['#4facfe', '#00f2fe'],
    ['#43e97b', '#38f9d7'],
    ['#fa709a', '#fee140'],
    ['#a8edea', '#fed6e3'],
    ['#ff9a9e', '#fecfef'],
    ['#ffecd2', '#fcb69f'],
  ]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

export function UserMenu() {
  const userName = '管理员'
  const userRole = '超级管理员'
  const userAvatar = null
  const notificationCount = 3

  const avatarColors = useMemo(() => getAvatarColor(userName), [userName])
  const avatarGradient = `linear-gradient(135deg, ${avatarColors[0]} 0%, ${avatarColors[1]} 100%)`

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
        console.log('退出登录')
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
          <div className={styles.avatarContainer}>
            <div className={styles.avatar}>
              {userAvatar ? (
                <Avatar src={userAvatar} size={40} />
              ) : (
                <Avatar size={40} style={{ backgroundColor: 'transparent' }}>
                  <div className={styles.avatarContent} style={{ background: avatarGradient }}>
                    {getUserInitials(userName)}
                  </div>
                </Avatar>
              )}
            </div>
          </div>
          <div className={styles.userBrief}>
            <span className={styles.userName}>{userName}</span>
            <span className={styles.userRole}>{userRole}</span>
          </div>
          <svg className={styles.arrow} width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path
              d="M1 1L5 5L9 1"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Dropdown>
    </div>
  )
}
