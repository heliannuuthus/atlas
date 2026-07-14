import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  ArrowRightOutlined,
  ClockCircleOutlined,
  ExportOutlined,
  SearchOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'
import { useAtlasAuth } from '@atlas/shared'
import type { PortalOutletContext } from '@/layouts'
import {
  atlasApps,
  getRecentLaunches,
  getTargetByKey,
  launchTargets,
  recordLaunchTarget,
  type AtlasLaunchTarget,
} from '@/config/apps'
import styles from './index.module.scss'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 12) return '早上好'
  if (hour < 18) return '下午好'
  return '晚上好'
}

export function Home() {
  const { openLauncher } = useOutletContext<PortalOutletContext>()
  const { user } = useAtlasAuth()
  const userName = user?.nic?.trim()
  const capabilityCount = atlasApps.reduce((count, app) => count + app.capabilities.length, 0)
  const launcherShortcut = useMemo(
    () =>
      typeof navigator !== 'undefined' && navigator.platform.toUpperCase().includes('MAC')
        ? '⌘ K'
        : 'Ctrl K',
    []
  )

  const recentTargets = useMemo(
    () =>
      getRecentLaunches()
        .map(item => getTargetByKey(item.key))
        .filter((target): target is AtlasLaunchTarget => Boolean(target)),
    []
  )

  const suggestedTargets = useMemo(
    () =>
      ['hermes:applications', 'chaos:templates', 'zwei:recipes']
        .map(getTargetByKey)
        .filter((target): target is AtlasLaunchTarget => Boolean(target)),
    []
  )

  const shortcuts = recentTargets.length > 0 ? recentTargets : suggestedTargets

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="atlas-title">
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Atlas Workspace</span>
          <h1 id="atlas-title">
            {getGreeting()}
            {userName ? `，${userName}` : ''}
            <br />
            <span>从一个入口开始工作。</span>
          </h1>
          <p>在应用之间顺畅切换，快速抵达你需要的功能，并随时继续上次的工作。</p>
        </div>

        <button type="button" className={styles.heroSearch} onClick={openLauncher}>
          <span className={styles.heroSearchIcon}>
            <SearchOutlined aria-hidden="true" />
          </span>
          <span className={styles.heroSearchText}>
            <strong>搜索应用和功能</strong>
            <small>输入 Hermes、文件管理或菜谱管理</small>
          </span>
          <kbd>{launcherShortcut}</kbd>
        </button>

        <div className={styles.heroMeta} aria-label="Atlas 可用能力">
          <span>
            <SafetyCertificateOutlined aria-hidden="true" /> 统一身份已连接
          </span>
          <span>{atlasApps.length} 个应用</span>
          <span>{capabilityCount} 个功能入口</span>
        </div>
      </section>

      <main className={styles.workspace}>
        <section className={styles.section} aria-labelledby="recent-title">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionKicker}>
                <ClockCircleOutlined aria-hidden="true" />
                {recentTargets.length > 0 ? '继续工作' : '建议从这里开始'}
              </span>
              <h2 id="recent-title">{recentTargets.length > 0 ? '最近访问' : '常用入口'}</h2>
            </div>
            <button type="button" className={styles.textAction} onClick={openLauncher}>
              查看全部 <ArrowRightOutlined aria-hidden="true" />
            </button>
          </div>

          <div className={styles.shortcutGrid}>
            {shortcuts.map(target => (
              <a
                key={target.key}
                className={styles.shortcut}
                href={target.href}
                onClick={() => recordLaunchTarget(target)}
              >
                <span
                  className={styles.shortcutIcon}
                  style={{ color: target.color, background: target.tint }}
                >
                  {target.icon}
                </span>
                <span className={styles.shortcutCopy}>
                  <strong>{target.name}</strong>
                  <small>{target.appName}</small>
                </span>
                <ArrowRightOutlined className={styles.shortcutArrow} aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="apps-title">
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionKicker}>工作空间</span>
              <h2 id="apps-title">全部应用</h2>
            </div>
            <p className={styles.sectionDescription}>
              每个应用独立运行，由 Atlas 提供统一入口与身份。
            </p>
          </div>

          <div className={styles.appGrid}>
            {atlasApps.map(app => {
              const homeTarget = launchTargets.find(target => target.key === `${app.id}:home`)!

              return (
                <article
                  key={app.id}
                  className={styles.appCard}
                  style={
                    { '--app-color': app.color, '--app-tint': app.tint } as React.CSSProperties
                  }
                >
                  <div className={styles.appHeader}>
                    <span className={styles.appIcon}>{app.icon}</span>
                    <span className={styles.status}>
                      <i aria-hidden="true" /> 可用
                    </span>
                  </div>

                  <div className={styles.appCopy}>
                    <span className={styles.appCategory}>{app.category}</span>
                    <h3>{app.name}</h3>
                    <p>{app.description}</p>
                    <strong className={styles.appMood}>{app.mood}</strong>
                  </div>

                  <div className={styles.capabilities}>
                    {app.capabilities.map(capability => {
                      const target = getTargetByKey(`${app.id}:${capability.id}`)!
                      return (
                        <a
                          key={capability.id}
                          href={target.href}
                          onClick={() => recordLaunchTarget(target)}
                          aria-label={`打开 ${app.name} 的${capability.name}`}
                        >
                          <span>{capability.icon}</span>
                          {capability.name}
                        </a>
                      )
                    })}
                  </div>

                  <a
                    className={styles.openApp}
                    href={homeTarget.href}
                    onClick={() => recordLaunchTarget(homeTarget)}
                  >
                    进入 {app.name}
                    <ExportOutlined aria-hidden="true" />
                  </a>
                </article>
              )
            })}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>Atlas</span>
        <span>一个入口，抵达所有工作空间。</span>
      </footer>
    </div>
  )
}
