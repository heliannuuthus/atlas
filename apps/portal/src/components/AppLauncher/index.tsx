import { useEffect, useMemo, useRef, useState } from 'react'
import { Input, Modal } from 'antd'
import { ArrowRightOutlined, SearchOutlined } from '@ant-design/icons'
import { launchTargets, openLaunchTarget, recordLaunchTarget } from '@/config/apps'
import styles from './index.module.scss'

interface AppLauncherProps {
  open: boolean
  onClose: () => void
}

export function AppLauncher({ open, onClose }: AppLauncherProps) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const resultRefs = useRef<Array<HTMLAnchorElement | null>>([])

  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase()
    if (!normalized) return launchTargets

    return launchTargets.filter(target =>
      [target.name, target.description, ...target.keywords]
        .join(' ')
        .toLocaleLowerCase()
        .includes(normalized)
    )
  }, [query])

  useEffect(() => {
    resultRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  const move = (offset: number) => {
    if (!results.length) return
    setActiveIndex(index => (index + offset + results.length) % results.length)
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      width={640}
      className={styles.modal}
      styles={{ body: { padding: 0 } }}
      destroyOnHidden
      afterClose={() => {
        setQuery('')
        setActiveIndex(0)
      }}
    >
      <div className={styles.searchRow}>
        <SearchOutlined aria-hidden="true" />
        <Input
          autoFocus
          value={query}
          onChange={event => {
            setQuery(event.target.value)
            setActiveIndex(0)
          }}
          onKeyDown={event => {
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              move(1)
            }
            if (event.key === 'ArrowUp') {
              event.preventDefault()
              move(-1)
            }
            if (event.key === 'Enter' && results[activeIndex]) {
              event.preventDefault()
              openLaunchTarget(results[activeIndex])
            }
          }}
          placeholder="搜索应用或功能…"
          variant="borderless"
          aria-label="搜索 Atlas 应用或功能"
          aria-controls="atlas-launcher-results"
          aria-activedescendant={
            results[activeIndex] ? `launcher-${results[activeIndex].key}` : undefined
          }
        />
        <kbd>Esc</kbd>
      </div>

      <div className={styles.results} id="atlas-launcher-results" role="listbox">
        {results.length > 0 ? (
          results.map((target, index) => (
            <a
              ref={element => {
                resultRefs.current[index] = element
              }}
              key={target.key}
              id={`launcher-${target.key}`}
              className={`${styles.result} ${index === activeIndex ? styles.active : ''}`}
              href={target.href}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => recordLaunchTarget(target)}
              role="option"
              aria-selected={index === activeIndex}
            >
              <span
                className={styles.resultIcon}
                style={{ color: target.color, background: target.tint }}
              >
                {target.icon}
              </span>
              <span className={styles.resultText}>
                <span className={styles.resultName}>{target.name}</span>
                <span className={styles.resultDescription}>{target.description}</span>
              </span>
              <span className={styles.resultApp}>{target.appName}</span>
              <ArrowRightOutlined className={styles.resultArrow} aria-hidden="true" />
            </a>
          ))
        ) : (
          <div className={styles.empty} role="status">
            <span>没有找到“{query}”</span>
            <small>试试应用名，例如 Hermes，或功能名，例如文件管理。</small>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <span className={styles.resultCount}>{results.length} 个入口</span>
        <span>
          <kbd>↑</kbd>
          <kbd>↓</kbd> 选择
        </span>
        <span>
          <kbd>↵</kbd> 打开
        </span>
        <span>目标将在当前标签页打开</span>
      </div>
    </Modal>
  )
}
