import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  AppstoreOutlined,
  ArrowRightOutlined,
  ClockCircleOutlined,
  DeploymentUnitOutlined,
  ExportOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import type { PortalOutletContext } from '@/layouts'
import {
  atlasApps,
  getRecentLaunches,
  getTargetByKey,
  recordLaunchTarget,
  type AtlasLaunchTarget,
} from '@/config/apps'
import styles from './index.module.scss'

export function Home() {
  const { openLauncher, openSystems } = useOutletContext<PortalOutletContext>()
  const capabilityCount = atlasApps.reduce((count, app) => count + app.capabilities.length, 0)
  const recentTargets = useMemo(
    () =>
      getRecentLaunches()
        .map(item => getTargetByKey(item.key))
        .filter((target): target is AtlasLaunchTarget => Boolean(target)),
    []
  )

  return (
    <div className={styles.page}>
      <div className={styles.pageHeading}>
        <div>
          <span>工作台</span>
          <h1>统一业务平台</h1>
          <p>查看平台接入信息，并从顶部系统入口进入业务系统。</p>
        </div>

        <div className={styles.headingActions}>
          <button type="button" onClick={openSystems}>
            <AppstoreOutlined aria-hidden="true" />
            打开系统菜单
          </button>
          <button type="button" className={styles.primaryAction} onClick={openLauncher}>
            <SearchOutlined aria-hidden="true" />
            搜索功能
          </button>
        </div>
      </div>

      <dl className={styles.metrics} aria-label="统一业务平台概况">
        <div>
          <span className={styles.metricIcon}>
            <AppstoreOutlined aria-hidden="true" />
          </span>
          <dt>已接入系统</dt>
          <dd>{atlasApps.length}</dd>
        </div>
        <div>
          <span className={styles.metricIcon}>
            <DeploymentUnitOutlined aria-hidden="true" />
          </span>
          <dt>功能入口</dt>
          <dd>{capabilityCount}</dd>
        </div>
        <div>
          <span className={styles.metricIcon}>
            <ClockCircleOutlined aria-hidden="true" />
          </span>
          <dt>最近访问</dt>
          <dd>{recentTargets.length}</dd>
        </div>
      </dl>

      <div className={styles.contentGrid}>
        <section className={styles.panel} aria-labelledby="recent-title">
          <header className={styles.panelHeader}>
            <div>
              <h2 id="recent-title">最近访问</h2>
              <p>保存在当前浏览器中的系统与功能入口。</p>
            </div>
            {recentTargets.length > 0 && (
              <button type="button" onClick={openLauncher}>
                查看全部
                <ArrowRightOutlined aria-hidden="true" />
              </button>
            )}
          </header>

          {recentTargets.length > 0 ? (
            <div className={styles.recentList}>
              {recentTargets.map(target => (
                <a key={target.key} href={target.href} onClick={() => recordLaunchTarget(target)}>
                  {target.icon ? (
                    <span
                      className={styles.recentIcon}
                      style={{ color: target.color, background: target.tint }}
                    >
                      {target.icon}
                    </span>
                  ) : (
                    <span
                      className={styles.recentAccent}
                      style={{ backgroundColor: target.color }}
                      aria-hidden="true"
                    />
                  )}
                  <span className={styles.recentCopy}>
                    <strong>{target.name}</strong>
                    <small>{target.appName}</small>
                  </span>
                  <ExportOutlined aria-hidden="true" />
                </a>
              ))}
            </div>
          ) : (
            <div className={styles.emptyRecent}>
              <ClockCircleOutlined aria-hidden="true" />
              <strong>暂无访问记录</strong>
              <span>从左上角打开系统，访问记录会显示在这里。</span>
              <button type="button" onClick={openSystems}>
                选择系统
              </button>
            </div>
          )}
        </section>

        <aside className={styles.panel} aria-labelledby="platform-title">
          <header className={styles.panelHeader}>
            <div>
              <h2 id="platform-title">平台信息</h2>
              <p>当前 Portal 的接入方式。</p>
            </div>
          </header>

          <dl className={styles.platformFacts}>
            <div>
              <dt>系统注册</dt>
              <dd>Manifest</dd>
            </div>
            <div>
              <dt>系统边界</dt>
              <dd>独立部署</dd>
            </div>
            <div>
              <dt>打开方式</dt>
              <dd>当前标签页</dd>
            </div>
            <div>
              <dt>快捷搜索</dt>
              <dd>Cmd / Ctrl + K</dd>
            </div>
          </dl>

          <div className={styles.platformHint}>
            <span aria-hidden="true" />
            <p>
              <strong>系统入口位于左上角</strong>
              <small>点击菜单按钮可查看所有已接入系统。</small>
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
