import { useEffect, useState, useMemo } from 'react'
import { Button, Input, Modal, Empty } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import styles from './index.module.scss'

export function SearchTrigger() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const isMac = useMemo(() => navigator.platform.toUpperCase().includes('MAC'), [])

  return (
    <>
      <Button type="text" className={styles.trigger} onClick={() => setOpen(true)}>
        <SearchOutlined className={styles.icon} />
        <span className={styles.placeholder}>搜索...</span>
        <kbd className={styles.kbd}>{isMac ? '⌘' : 'Ctrl'} K</kbd>
      </Button>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        closable={false}
        width={560}
        className={styles.modal}
        styles={{ body: { padding: 0 } }}
      >
        <Input
          autoFocus
          size="large"
          placeholder="搜索域、服务、应用、用户..."
          prefix={<SearchOutlined style={{ color: '#a1a1aa' }} />}
          variant="borderless"
          className={styles.searchInput}
        />
        <div className={styles.searchBody}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="输入关键词开始搜索"
            className={styles.empty}
          />
        </div>
      </Modal>
    </>
  )
}
