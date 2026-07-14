import { useEffect, useMemo, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { UserMenu } from '@atlas/ui'
import { AppLauncher } from '@/components/AppLauncher'
import { AtlasMark } from '@/components/AtlasMark'
import styles from './index.module.scss'

const { Header: AntHeader, Content } = Layout

export interface PortalOutletContext {
  openLauncher: () => void
}

export function PortalLayout() {
  const [launcherOpen, setLauncherOpen] = useState(false)
  const isMac = useMemo(
    () => typeof navigator !== 'undefined' && navigator.platform.toUpperCase().includes('MAC'),
    []
  )

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setLauncherOpen(true)
      }
    }

    document.addEventListener('keydown', handleShortcut)
    return () => document.removeEventListener('keydown', handleShortcut)
  }, [])

  return (
    <Layout className={styles.layout}>
      <a className={styles.skipLink} href="#atlas-main">
        跳到主要内容
      </a>

      <AntHeader className={styles.header}>
        <a href="/" className={styles.logo} aria-label="返回 Atlas 工作台">
          <AtlasMark size={34} />
          <span className={styles.logoText}>Atlas</span>
          <span className={styles.logoDivider} aria-hidden="true" />
          <span className={styles.workspaceLabel}>工作台</span>
        </a>

        <button
          type="button"
          className={styles.searchTrigger}
          onClick={() => setLauncherOpen(true)}
          aria-label="搜索应用和功能"
        >
          <SearchOutlined aria-hidden="true" />
          <span>搜索应用和功能</span>
          <kbd>{isMac ? '⌘ K' : 'Ctrl K'}</kbd>
        </button>

        <div className={styles.userArea}>
          <UserMenu brandColor="#2557d6" compact />
        </div>
      </AntHeader>

      <Content className={styles.content} id="atlas-main">
        <Outlet
          context={{ openLauncher: () => setLauncherOpen(true) } satisfies PortalOutletContext}
        />
      </Content>

      <AppLauncher open={launcherOpen} onClose={() => setLauncherOpen(false)} />
    </Layout>
  )
}
