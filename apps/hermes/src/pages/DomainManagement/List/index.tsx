import { useRequest } from 'ahooks'
import { Eye, Network } from 'lucide-react'
import { Button } from '@atlas/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@atlas/ui/card'
import { EmptyState } from '@atlas/ui/empty-state'
import { Spinner } from '@atlas/ui/spinner'
import { DataTable, type DataTableColumn } from '@atlas/ui/table'
import { useAppNavigate } from '@/contexts/DomainContext'
import { domainApi } from '@/services'
import type { Domain } from '@/types'
import styles from './index.module.scss'

export function List() {
  const navigate = useAppNavigate()
  const { data = [], loading } = useRequest(domainApi.getList)
  const columns: DataTableColumn<Domain>[] = [
    {
      key: 'domain_id',
      header: '域 ID',
      width: 140,
      render: domain => <code>{domain.domain_id}</code>,
    },
    { key: 'name', header: '名称', width: 180, render: domain => domain.name },
    {
      key: 'description',
      header: '描述',
      render: domain => domain.description || <span className="text-muted-foreground">—</span>,
    },
    {
      key: 'action',
      header: '操作',
      width: 90,
      render: domain => (
        <Button variant="ghost" size="sm" onClick={() => navigate(`/domains/${domain.domain_id}`)}>
          <Eye />
          查看
        </Button>
      ),
    },
  ]
  return (
    <div className={styles.container}>
      <Card>
        <CardHeader>
          <CardTitle>域</CardTitle>
          <p className={styles.headerDesc}>
            域是身份与权限的隔离边界，当前仅展示该域本身；服务、应用与组均在域下创建与查看。
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex min-h-40 items-center justify-center">
              <Spinner />
            </div>
          ) : data.length ? (
            <DataTable columns={columns} data={data} rowKey="domain_id" />
          ) : (
            <EmptyState title="暂无域数据" icon={<Network className="size-8" />} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
