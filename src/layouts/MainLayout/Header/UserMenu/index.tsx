import { Dropdown, Avatar, Space } from 'antd'
import type { MenuProps } from 'antd'
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons'
import styles from './index.module.scss'

const items: MenuProps['items'] = [
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
    type: 'divider',
  },
  {
    key: 'logout',
    icon: <LogoutOutlined />,
    label: '退出登录',
    danger: true,
  },
]

export function UserMenu() {
  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'profile':
        console.log('个人中心')
        break
      case 'settings':
        console.log('设置')
        break
      case 'logout':
        console.log('退出登录')
        break
    }
  }

  return (
    <Dropdown menu={{ items, onClick: handleMenuClick }} placement="bottomRight">
      <div className={styles.userMenu}>
        <Space>
          <Avatar icon={<UserOutlined />} />
          <span className={styles.username}>管理员</span>
        </Space>
      </div>
    </Dropdown>
  )
}
