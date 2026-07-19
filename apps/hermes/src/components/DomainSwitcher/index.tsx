import { useMemo, useState } from 'react'
import { useRequest } from 'ahooks'
import { Check, ChevronDown, LoaderCircle, Pencil, Plus, Settings2, Trash2, X } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@atlas/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@atlas/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@atlas/ui/dropdown-menu'
import { Spinner } from '@atlas/ui/spinner'
import { toast } from '@atlas/ui/toast'
import { domainApi } from '@/services'
import type { Domain } from '@/types'
import { DomainDialog, type DomainDialogState } from './DomainDialog'
import styles from './index.module.scss'

interface DomainSwitcherProps {
  currentDomainId: string
}

export function DomainSwitcher({ currentDomainId }: DomainSwitcherProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [managing, setManaging] = useState(false)
  const [dialogState, setDialogState] = useState<DomainDialogState>(null)
  const [pendingDelete, setPendingDelete] = useState<Domain | null>(null)
  const [deleting, setDeleting] = useState(false)
  const {
    data: domains = [],
    loading,
    refresh,
    mutate,
  } = useRequest(domainApi.getList, {
    onError: error => toast.error(error.message || '域列表加载失败'),
  })

  const currentDomain = useMemo(
    () => domains.find(domain => domain.domain_id === currentDomainId),
    [currentDomainId, domains]
  )

  const getDomainPath = (domainId: string) => {
    const currentPrefix = `/d/${encodeURIComponent(currentDomainId)}`
    const suffix = location.pathname.startsWith(currentPrefix)
      ? location.pathname.slice(currentPrefix.length)
      : ''
    return `/d/${encodeURIComponent(domainId)}${suffix}${location.search}`
  }

  const switchDomain = (domain: Domain) => {
    navigate(getDomainPath(domain.domain_id))
    setOpen(false)
  }

  const openDialog = (nextState: Exclude<DomainDialogState, null>) => {
    setOpen(false)
    setManaging(false)
    setDialogState(nextState)
  }

  const handleSaved = (domain: Domain, mode: 'create' | 'edit') => {
    refresh()
    if (mode === 'create') navigate(`/d/${encodeURIComponent(domain.domain_id)}`)
  }

  const deleteDomain = async () => {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await domainApi.delete(pendingDelete.domain_id)
      const remainingDomains = await domainApi.getList()
      mutate(remainingDomains)
      toast.success('域已删除')
      setPendingDelete(null)

      if (pendingDelete.domain_id === currentDomainId) {
        const nextDomain = remainingDomains[0]
        navigate(nextDomain ? getDomainPath(nextDomain.domain_id) : '/')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '删除域失败')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <DropdownMenu
        open={open}
        onOpenChange={nextOpen => {
          setOpen(nextOpen)
          if (!nextOpen) setManaging(false)
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className={styles.trigger}
            aria-label={`Hermes 管理后台，当前域：${currentDomain?.name ?? currentDomainId}，切换域`}
          >
            <span className={styles.triggerName}>Hermes 管理后台</span>
            <ChevronDown className={styles.chevron} aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          sideOffset={6}
          className={styles.menu}
          data-managing={managing ? 'true' : 'false'}
        >
          <section className={styles.switchPanel} aria-label={managing ? '管理域' : '切换域'}>
            <div className={styles.panelHeader}>
              <div>
                <strong>{managing ? '管理域' : '切换域'}</strong>
                <span>{domains.length} 个可用域</span>
              </div>
              {managing ? (
                <div className={styles.manageActions}>
                  <DropdownMenuItem
                    className={styles.headerAction}
                    onSelect={() => openDialog({ mode: 'create' })}
                  >
                    <Plus />
                    新增
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={styles.headerAction}
                    onSelect={event => {
                      event.preventDefault()
                      setManaging(false)
                    }}
                  >
                    <X />
                    取消
                  </DropdownMenuItem>
                </div>
              ) : (
                <DropdownMenuItem
                  className={styles.headerAction}
                  onSelect={event => {
                    event.preventDefault()
                    setManaging(true)
                  }}
                >
                  <Settings2 />
                  管理
                </DropdownMenuItem>
              )}
            </div>
            <div className={styles.domainList}>
              {loading ? (
                <div className={styles.loading}>
                  <Spinner label="正在加载域" />
                </div>
              ) : domains.length === 0 ? (
                <p className={styles.empty}>暂无可用域</p>
              ) : (
                domains.map(domain => {
                  const isCurrent = domain.domain_id === currentDomainId

                  if (managing) {
                    return (
                      <div
                        key={domain.domain_id}
                        className={`${styles.domainItem} ${styles.manageDomainItem}`}
                        data-current={isCurrent ? 'true' : 'false'}
                      >
                        <span className={styles.domainIdentity}>
                          <span className={styles.domainName}>
                            {domain.name || domain.domain_id}
                          </span>
                          <span className={styles.domainId}>{domain.domain_id}</span>
                        </span>
                        <div className={styles.domainActions}>
                          <DropdownMenuItem
                            className={styles.domainAction}
                            aria-label={`编辑域 ${domain.name || domain.domain_id}`}
                            onSelect={() => openDialog({ mode: 'edit', domain })}
                          >
                            <Pencil />
                            编辑
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className={styles.domainAction}
                            variant="destructive"
                            aria-label={`删除域 ${domain.name || domain.domain_id}`}
                            onSelect={() => {
                              setOpen(false)
                              setManaging(false)
                              setPendingDelete(domain)
                            }}
                          >
                            <Trash2 />
                            删除
                          </DropdownMenuItem>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <DropdownMenuItem
                      key={domain.domain_id}
                      className={styles.domainItem}
                      data-current={isCurrent ? 'true' : 'false'}
                      onSelect={() => switchDomain(domain)}
                    >
                      <span className={styles.domainIdentity}>
                        <span className={styles.domainName}>{domain.name || domain.domain_id}</span>
                        <span className={styles.domainId}>{domain.domain_id}</span>
                      </span>
                      {isCurrent ? (
                        <Check className={styles.currentIcon} aria-label="当前域" />
                      ) : null}
                    </DropdownMenuItem>
                  )
                })
              )}
            </div>
          </section>
        </DropdownMenuContent>
      </DropdownMenu>

      <DomainDialog
        state={dialogState}
        onOpenChange={dialogOpen => !dialogOpen && setDialogState(null)}
        onSaved={handleSaved}
      />

      <Dialog open={pendingDelete !== null} onOpenChange={open => !open && setPendingDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>删除域</DialogTitle>
            <DialogDescription>
              确定删除“{pendingDelete?.name || pendingDelete?.domain_id}
              ”？域内应用、服务和配置将一并删除，此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={deleting}
              onClick={() => setPendingDelete(null)}
            >
              取消
            </Button>
            <Button type="button" variant="destructive" disabled={deleting} onClick={deleteDomain}>
              {deleting ? <LoaderCircle className={styles.spinner} aria-hidden="true" /> : null}
              删除域
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
