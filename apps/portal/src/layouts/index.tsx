import { useCallback, useEffect, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { UserMenu } from '@atlas/ui/user-menu'
import { AppLauncher } from '@/components/AppLauncher'
import { DotGridBackground } from '@/components/DotGridBackground'
import { GlassSurface } from '@/components/GlassSurface'
import { SystemDrawer } from '@/components/SystemDrawer'
import styles from './index.module.scss'

const { Content } = Layout

export interface PortalOutletContext {
  openLauncher: () => void
  openSystems: () => void
}

export function PortalLayout() {
  const [launcherOpen, setLauncherOpen] = useState(false)
  const [systemMenuOpen, setSystemMenuOpen] = useState(false)
  const systemButtonRef = useRef<HTMLButtonElement | null>(null)

  const closeSystemMenu = useCallback(() => {
    setSystemMenuOpen(false)
    window.requestAnimationFrame(() => systemButtonRef.current?.focus())
  }, [])

  const openLauncher = useCallback(() => {
    setSystemMenuOpen(false)
    setLauncherOpen(true)
  }, [])

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        openLauncher()
      }
    }

    document.addEventListener('keydown', handleShortcut)
    return () => document.removeEventListener('keydown', handleShortcut)
  }, [openLauncher])

  const focusMainContent = () => document.getElementById('atlas-main')?.focus()

  return (
    <Layout className={styles.layout}>
      <DotGridBackground />

      <button type="button" className={styles.skipLink} onClick={focusMainContent}>
        跳到主要内容
      </button>

      <button
        type="button"
        className={`${styles.backdrop} ${systemMenuOpen ? styles.backdropVisible : ''}`}
        onClick={closeSystemMenu}
        aria-label="关闭系统菜单"
        tabIndex={systemMenuOpen ? 0 : -1}
      />

      <GlassSurface
        role="banner"
        aria-label="Atlas 全局导航"
        className={`${styles.header} ${systemMenuOpen ? styles.headerOpen : ''}`}
        contentClassName={styles.glassContent}
        borderRadius={systemMenuOpen ? 32 : 26}
        backgroundOpacity={systemMenuOpen ? 0.13 : 0.075}
        saturation={1.6}
        distortionScale={systemMenuOpen ? -64 : -82}
      >
        <div className={styles.navBar}>
          <div className={styles.headerLeading}>
            <button
              ref={systemButtonRef}
              type="button"
              className={`${styles.systemTrigger} ${systemMenuOpen ? styles.systemTriggerOpen : ''}`}
              onClick={() => setSystemMenuOpen(open => !open)}
              aria-label={systemMenuOpen ? '关闭系统菜单' : '打开系统菜单'}
              aria-expanded={systemMenuOpen}
            >
              <span className={styles.gridIcon} aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </span>
              <span className={styles.closeIcon} aria-hidden="true">
                <i />
                <i />
              </span>
            </button>

            <a href="/" className={styles.brand} aria-label="返回工作台">
              <img src="/atlas.svg" alt="" aria-hidden="true" />
              <strong>Atlas</strong>
            </a>
          </div>

          <button type="button" className={styles.headerSearch} onClick={openLauncher}>
            <SearchOutlined aria-hidden="true" />
            <span>搜索系统与功能</span>
            <kbd>⌘ K</kbd>
          </button>

          <div className={styles.headerActions}>
            <UserMenu
              brandColor="#1677ff"
              compact={false}
              showNotifications={false}
              variant="floating"
            />
          </div>
        </div>

        <SystemDrawer open={systemMenuOpen} onClose={closeSystemMenu} />
      </GlassSurface>

      <Content className={styles.content} id="atlas-main" tabIndex={-1} inert={systemMenuOpen}>
        <Outlet
          context={
            {
              openLauncher,
              openSystems: () => setSystemMenuOpen(true),
            } satisfies PortalOutletContext
          }
        />
      </Content>

      <AppLauncher open={launcherOpen} onClose={() => setLauncherOpen(false)} />
    </Layout>
  )
}
