import { useEffect, useState, useMemo, type ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import styles from './index.module.scss'

const { Content, Sider } = Layout

interface MainLayoutProps {
  renderSidebar: (collapsed: boolean) => ReactNode
  header: ReactNode
  guideBall?: ReactNode
}

export function MainLayout({ renderSidebar, header, guideBall }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setCollapsed(true)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const siderWidth = collapsed ? 68 : 248

  const triggerStyle = useMemo<React.CSSProperties>(() => ({
    position: 'absolute',
    right: -14,
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 101,
    width: 20,
    height: 40,
    padding: 0,
    border: '1px solid #e4e4e7',
    borderLeft: 'none',
    borderRadius: '0 6px 6px 0',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#a1a1aa',
    cursor: 'pointer',
    opacity: 0,
    transition: 'opacity 0.2s ease',
    fontSize: 11,
  }), [])

  return (
    <Layout className={styles.layout}>
      <div
        className={styles.siderWrapper}
        onMouseEnter={(e) => {
          const btn = e.currentTarget.querySelector('[data-collapse-btn]') as HTMLElement
          if (btn) btn.style.opacity = '1'
        }}
        onMouseLeave={(e) => {
          const btn = e.currentTarget.querySelector('[data-collapse-btn]') as HTMLElement
          if (btn) btn.style.opacity = '0'
        }}
      >
        <Sider
          width={248}
          collapsedWidth={68}
          collapsed={collapsed}
          onCollapse={setCollapsed}
          className={styles.sider}
          collapsible
          trigger={null}
        >
          {renderSidebar(collapsed)}
        </Sider>
        <button
          type="button"
          data-collapse-btn
          style={triggerStyle}
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? '展开侧边栏' : '折叠侧边栏'}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>
      <Layout
        className={styles.innerLayout}
        style={{ '--sider-width': `${siderWidth}px` } as React.CSSProperties}
      >
        {header}
        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
      {guideBall}
    </Layout>
  )
}
