import { memo, useMemo, lazy, Suspense, useState } from 'react'
import { Table, Empty, Typography, Tag, Spin, Segmented } from 'antd'
import { TableOutlined, ApartmentOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { ApplicationServiceRelation } from '@/types'
import styles from '../index.module.scss'

const TAG_COLOR_PALETTE = ['blue', 'purple', 'cyan', 'orange', 'magenta', 'gold'] as const

function hashColor(str: string): (typeof TAG_COLOR_PALETTE)[number] {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i)
  return TAG_COLOR_PALETTE[Math.abs(h) % TAG_COLOR_PALETTE.length]
}

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
  import('./PermissionsGraph').then(m => ({
    default: m.PermissionsGraph,
  }))
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

  const columns: ColumnsType<ApplicationServiceRelation> = useMemo(
    () => [
      {
        title: '服务',
        dataIndex: 'service_id',
        key: 'service_id',
        width: 180,
        render: (value: string) =>
          onNavigateToService ? (
            <Typography.Link onClick={() => onNavigateToService(value)}>{value}</Typography.Link>
          ) : (
            value
          ),
      },
      {
        title: '授予的权限',
        dataIndex: 'relations',
        key: 'relations',
        render: (relations: string[]) =>
          (relations || []).map(r => (
            <Tag key={r} color={hashColor(r)} variant="filled">
              {r}
            </Tag>
          )),
      },
    ],
    [onNavigateToService]
  )

  return (
    <div className={styles.permissionsTab}>
      <div className={styles.permissionsViewSwitch}>
        <Segmented
          size="small"
          value={view}
          onChange={v => setView(v as 'table' | 'graph')}
          options={[
            { value: 'table', icon: <TableOutlined /> },
            { value: 'graph', icon: <ApartmentOutlined /> },
          ]}
        />
      </div>

      {view === 'table' ? (
        <Table
          columns={columns}
          dataSource={data ?? []}
          loading={loading}
          rowKey="service_id"
          size="small"
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无服务授予的权限" />
            ),
          }}
        />
      ) : (
        <Suspense
          fallback={
            <div className={styles.permissionsGraphLoading}>
              <Spin size="small" />
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
