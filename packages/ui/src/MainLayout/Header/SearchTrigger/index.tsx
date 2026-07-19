import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '../../../components/button'
import { Dialog, DialogContent, DialogTitle } from '../../../components/dialog'
import { EmptyState } from '../../../components/empty-state'
import { Input } from '../../../components/input'
import styles from './index.module.scss'

export function SearchTrigger() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setOpen(true)
      }
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const isMac = useMemo(() => navigator.platform.toUpperCase().includes('MAC'), [])

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        className={styles.trigger}
        onClick={() => setOpen(true)}
      >
        <Search className={styles.icon} />
        <span className={styles.placeholder}>搜索...</span>
        <kbd className={styles.kbd}>{isMac ? '⌘' : 'Ctrl'} K</kbd>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={styles.modal}>
          <DialogTitle className="sr-only">搜索</DialogTitle>
          <div className={styles.inputWrapper}>
            <Search className={styles.icon} />
            <Input
              autoFocus
              placeholder="搜索域、服务、应用、用户..."
              className={styles.searchInput}
            />
          </div>
          <div className={styles.searchBody}>
            <EmptyState title="输入关键词开始搜索" className={styles.empty} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
