import { Avatar, Button, Tooltip, Dropdown, Typography } from 'antd'
import type { MenuProps } from 'antd'
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  BookOutlined,
} from '@ant-design/icons'
import { useAtlasAuth } from '@atlas/shared'
import styles from './index.module.scss'

const getUserInitials = (name?: string) => {
  if (!name) return 'U'
  const chars = name.trim()
  if (/^[\u4e00-\u9fa5]/.test(chars)) return chars.substring(0, 1)
  const parts = chars.split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return chars.substring(0, 2).toUpperCase()
}

const truncateOpenId = (openId: string, head = 8, tail = 4) => {
  if (openId.length <= head + tail + 3) return openId
  return `${openId.slice(0, head)}…${openId.slice(-tail)}`
}

interface UserMenuProps {
  brandColor?: string
  docUrl?: string
}

export function UserMenu({ brandColor = '#7c3aed', docUrl }: UserMenuProps) {
  const { logout, user } = useAtlasAuth()
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

      <Tooltip title="通知" placement="bottom">
        <Button type="text" className={styles.iconBtn} icon={<BellOutlined />} />
      </Tooltip>

      <Dropdown
        menu={{ items: menuItems, onClick: handleMenuClick }}
        placement="bottomRight"
        trigger={['hover', 'click']}
        mouseEnterDelay={0.15}
        mouseLeaveDelay={0.15}
        dropdownStyle={{ minWidth: 160, width: 'auto', maxWidth: 220 }}
      >
        <div className={styles.userTrigger} role="button" tabIndex={0}>
          <Avatar
            src={userAvatar ?? undefined}
            size={40}
            className={styles.userTriggerAvatar}
            style={!userAvatar ? { backgroundColor: brandColor, fontSize: 16 } : undefined}
          >
            {!userAvatar ? getUserInitials(userName) : null}
          </Avatar>
          <div className={styles.userTriggerText}>
            <span className={styles.userTriggerName}>{userName || '用户'}</span>
            {user?.sub && (
              <Typography.Text
                className={styles.userTriggerOpenid}
                copyable={{ text: user.sub, tooltips: ['复制 OpenID', '已复制'] }}
                onClick={(e) => e.stopPropagation()}
              >
                {truncateOpenId(user.sub)}
              </Typography.Text>
            )}
          </div>
        </div>
      </Dropdown>
    </div>
  )
}
