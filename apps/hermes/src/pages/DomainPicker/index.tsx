import { useState } from 'react'
import { useRequest } from 'ahooks'
import { Plus } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent } from '@atlas/ui/card'
import { Spinner } from '@atlas/ui/spinner'
import { DomainDialog, type DomainDialogState } from '@/components/DomainSwitcher/DomainDialog'
import { domainApi } from '@/services'
import type { Domain } from '@/types'
import styles from './index.module.scss'

export function DomainPicker() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [dialogState, setDialogState] = useState<DomainDialogState>(null)
  const { data: domains = [], loading, refresh } = useRequest(domainApi.getList)
  const requestedSection = searchParams.get('next')
  const nextSection = ['applications', 'services', 'groups'].includes(requestedSection ?? '')
    ? requestedSection
    : undefined
  const openDomain = (domain: Domain) => {
    const basePath = `/d/${encodeURIComponent(domain.domain_id)}`
    navigate(nextSection ? `${basePath}/${nextSection}` : basePath)
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>选择域</h1>
        <p className={styles.desc}>
          域是身份与权限的隔离边界。选择一个域，进入对应的资源与访问关系工作区。
        </p>
      </header>
      <main className={styles.main}>
        {loading ? (
          <div className={styles.loading}>
            <Spinner className="size-7" />
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {domains.map(domain => (
              <Card key={domain.domain_id} className={styles.domainCard}>
                <button
                  type="button"
                  className="h-full w-full text-left"
                  onClick={() => openDomain(domain)}
                >
                  <CardContent className={styles.cardBody}>
                    <div className={styles.cardName}>{domain.name || domain.domain_id}</div>
                    {domain.description ? (
                      <div className={styles.cardDesc}>{domain.description}</div>
                    ) : null}
                    <code className={styles.cardId}>{domain.domain_id}</code>
                  </CardContent>
                </button>
              </Card>
            ))}
            <button
              type="button"
              className={styles.domainCardAdd}
              onClick={() => setDialogState({ mode: 'create' })}
            >
              <span className={styles.cardAddBody}>
                <Plus className={styles.cardAddIcon} />
                <span className={styles.cardAddText}>添加域</span>
              </span>
            </button>
          </div>
        )}
      </main>
      <DomainDialog
        state={dialogState}
        onOpenChange={open => !open && setDialogState(null)}
        onSaved={domain => {
          refresh()
          openDomain(domain)
        }}
      />
    </div>
  )
}
