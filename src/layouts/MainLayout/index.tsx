import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Layout, Button } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { BusinessTabs } from '@/components/BusinessTabs'
import { syncBusinessFromPath } from '@/store/business'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import styles from './index.module.scss'

const { Content, Sider } = Layout

export function MainLayout() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const [collapsed, setCollapsed] = useState(false)

  useKeyboardShortcuts()

  useEffect(() => {
    syncBusinessFromPath(location.pathname)
  }, [location.pathname])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Layout className={`${styles.layout} ${isHomePage ? styles.homeLayout : ''}`}>
      {isHomePage ? (
        <>
          <Header />
          <Content className={styles.homeContent}>
            <Outlet />
          </Content>
        </>
      ) : (
        <>
          <div className={styles.siderWrapper}>
            <Sider
              width={240}
              collapsedWidth={64}
              collapsed={collapsed}
              onCollapse={setCollapsed}
              className={styles.sider}
              collapsible
              trigger={null}
            >
              <Sidebar collapsed={collapsed} />
            </Sider>
            <div className={styles.collapseButton}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className={styles.collapseBtn}
              />
            </div>
          </div>
          <Layout style={{ '--sider-width': collapsed ? '64px' : '240px' } as React.CSSProperties}>
            <Header />
            <BusinessTabs />
            <Content className={styles.content}>
              <Outlet />
            </Content>
          </Layout>
        </>
      )}
    </Layout>
  )
}
