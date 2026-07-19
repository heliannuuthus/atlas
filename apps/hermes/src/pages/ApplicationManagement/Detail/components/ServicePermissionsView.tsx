import { lazy, memo, Suspense, useMemo, useState } from 'react'
import { Network, Table2 } from 'lucide-react'
import { Badge } from '@atlas/ui/badge'
import { Button } from '@atlas/ui/button'
import { EmptyState } from '@atlas/ui/empty-state'
import { Spinner } from '@atlas/ui/spinner'
import { DataTable, type DataTableColumn } from '@atlas/ui/table'
import type { ApplicationServiceRelation } from '@/types'
import styles from '../index.module.scss'

export interface ServicePermissionsViewProps {
  appId: string
  appName?: string
  appLogoUrl?: string
  data: ApplicationServiceRelation[]
  loading?: boolean
  onNavigateToService?: (serviceId: string) => void
  onRelationsChange?: () => void
}
const LazyPermissionsGraph = lazy(() =>
  import('./PermissionsGraph').then(module => ({ default: module.PermissionsGraph }))
)

export const ServicePermissionsView = memo(function ServicePermissionsView({
  appId,
  appName,
  appLogoUrl,
  data,
  loading,
  onNavigateToService,
  onRelationsChange,
}: ServicePermissionsViewProps) {
  const [view, setView] = useState<'table' | 'graph'>('table')
  const columns = useMemo<DataTableColumn<ApplicationServiceRelation>[]>(
    () => [
      {
        key: 'service_id',
        header: '服务',
        width: 190,
        render: relation =>
          onNavigateToService ? (
            <button
              className="text-primary hover:underline"
              onClick={() => onNavigateToService(relation.service_id)}
            >
              {relation.service_id}
            </button>
          ) : (
            relation.service_id
          ),
      },
      {
        key: 'relations',
        header: '授予的权限',
        render: relation => (
          <div className="flex flex-wrap gap-1">
            {relation.relations.map(value => (
              <Badge key={value}>{value}</Badge>
            ))}
          </div>
        ),
      },
    ],
    [onNavigateToService]
  )
  return (
    <div className={styles.permissionsTab}>
      <div className={styles.permissionsViewSwitch}>
        <div className="inline-flex rounded-lg bg-muted p-1">
          <Button
            size="icon-sm"
            variant={view === 'table' ? 'secondary' : 'ghost'}
            aria-label="表格视图"
            onClick={() => setView('table')}
          >
            <Table2 />
          </Button>
          <Button
            size="icon-sm"
            variant={view === 'graph' ? 'secondary' : 'ghost'}
            aria-label="图谱视图"
            onClick={() => setView('graph')}
          >
            <Network />
          </Button>
        </div>
      </div>
      {view === 'table' ? (
        loading ? (
          <div className="flex min-h-40 items-center justify-center">
            <Spinner />
          </div>
        ) : data.length ? (
          <DataTable columns={columns} data={data} rowKey="service_id" />
        ) : (
          <EmptyState title="暂无服务授予的权限" />
        )
      ) : (
        <Suspense
          fallback={
            <div className={styles.permissionsGraphLoading}>
              <Spinner />
            </div>
          }
        >
          <LazyPermissionsGraph
            appId={appId}
            appName={appName}
            appLogoUrl={appLogoUrl}
            data={data}
            className={styles.permissionsGraph}
            onRelationsChange={onRelationsChange}
          />
        </Suspense>
      )}
    </div>
  )
})
