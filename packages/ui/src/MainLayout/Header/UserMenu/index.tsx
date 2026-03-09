import { Avatar, Tooltip, Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  QuestionCircleOutlined,
  BookOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '@atlas/shared'
import styles from './index.module.scss'

const getUserInitials = (name?: string) => {
  if (!name) return 'U'
  const chars = name.trim()
  if (/^[\u4e00-\u9fa5]/.test(chars)) return chars.substring(0, 1)
  const parts = chars.split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return chars.substring(0, 2).toUpperCase()
}

interface UserMenuProps {
  brandColor?: string
  docUrl?: string
}

export function UserMenu({ brandColor = '#7c3aed', docUrl }: UserMenuProps) {
  const { logout, user } = useAuthStore()
  const userName = user?.nic
  const userAvatar = user?.pic ?? null

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'profile':
        break
      case 'settings':
        break
      case 'logout':
        logout()
        break
    }
  }

  const menuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      label: (
        <div className={styles.userInfo}>
          <div className={styles.userInfoName}>{userName || '用户'}</div>
          <div className={styles.userInfoEmail}>{user?.sub || ''}</div>
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' },
    { key: 'profile', icon: <UserOutlined />, label: '个人中心' },
    { key: 'settings', icon: <SettingOutlined />, label: '设置' },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
  ]

  return (
    <div className={styles.actions}>
      {docUrl && (
        <Tooltip title="文档" placement="bottom">
          <a href={docUrl} target="_blank" rel="noopener noreferrer" className={styles.iconBtn}>
            <BookOutlined />
          </a>
        </Tooltip>
      )}

      <Tooltip title="帮助" placement="bottom">
        <button className={styles.iconBtn} type="button">
          <QuestionCircleOutlined />
        </button>
      </Tooltip>

      <Tooltip title="通知" placement="bottom">
        <button className={styles.iconBtn} type="button">
          <BellOutlined />
        </button>
      </Tooltip>

      <Dropdown
        menu={{ items: menuItems, onClick: handleMenuClick }}
        placement="bottomRight"
        trigger={['click']}
      >
        <button className={styles.avatarBtn} type="button">
          {userAvatar ? (
            <Avatar src={userAvatar} size={26} />
          ) : (
            <Avatar size={26} style={{ backgroundColor: brandColor, fontSize: 12 }}>
              {getUserInitials(userName)}
            </Avatar>
          )}
        </button>
      </Dropdown>
    </div>
  )
}
