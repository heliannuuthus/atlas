import { useEffect, useState, type ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Button } from '../components/button'
import styles from './index.module.scss'

interface MainLayoutProps {
  renderSidebar: (collapsed: boolean) => ReactNode
  header: ReactNode
  contentHeader?: ReactNode
  guideBall?: ReactNode
}

export function MainLayout({ renderSidebar, header, contentHeader, guideBall }: MainLayoutProps) {
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

  return (
    <div className={styles.layout}>
      <div className={styles.siderWrapper}>
        <aside className={styles.sider} style={{ width: siderWidth }}>
          {renderSidebar(collapsed)}
        </aside>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          data-collapse-btn
          className={styles.collapseButton}
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? '展开侧边栏' : '折叠侧边栏'}
        >
          {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
        </Button>
      </div>
      <div
        className={styles.innerLayout}
        style={{ '--sider-width': `${siderWidth}px` } as React.CSSProperties}
      >
        {header}
        <main className={styles.content}>
          {contentHeader ? <div className={styles.contentHeader}>{contentHeader}</div> : null}
          <div
            className={`${styles.contentSurface} ${contentHeader ? '' : styles.contentSurfaceStandalone}`}
          >
            <div className={styles.contentBody}>
              <Outlet />
            </div>
          </div>
        </main>
      </div>
      {guideBall}
    </div>
  )
}
