import { useEffect, useState, useMemo } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Button, Layout } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { BusinessTabs } from '@/components/BusinessTabs'
import { GuideBall } from '@/components/GuideBall'
import { syncBusinessFromPath } from '@/store/business'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import styles from './index.module.scss'

const { Content, Sider } = Layout

export function MainLayout() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const [collapsed, setCollapsed] = useState(false)

  useKeyboardShortcuts()
  useDocumentMeta()

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

  const collapseTriggerStyle = useMemo<React.CSSProperties>(
    () => ({
      position: 'absolute',
      right: -18,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 101,
      width: 20,
      height: 48,
      padding: 0,
      border: 'none',
      borderRadius: '0 4px 4px 0',
      background: '#fff',
      boxShadow: '2px 0 8px rgba(0, 0, 0, 0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#595959',
    }),
    []
  )

  return (
    <Layout className={styles.layout}>
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
            <Button
              type="text"
              style={collapseTriggerStyle}
              onClick={() => setCollapsed(!collapsed)}
              aria-label={collapsed ? '展开侧边栏' : '折叠侧边栏'}
              icon={
                collapsed ? (
                  <MenuUnfoldOutlined style={{ fontSize: 12 }} />
                ) : (
                  <MenuFoldOutlined style={{ fontSize: 12 }} />
                )
              }
            />
          </div>
          <Layout
            className={styles.innerLayout}
            style={{ '--sider-width': collapsed ? '64px' : '240px' } as React.CSSProperties}
          >
            <Header />
            <BusinessTabs />
            <Content className={styles.content}>
              <Outlet />
            </Content>
          </Layout>
          <GuideBall />
        </>
      )}
    </Layout>
  )
}
