import { useRequest } from 'ahooks'
import { Eye, Pencil, Plus, Users } from 'lucide-react'
import { Button } from '@atlas/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@atlas/ui/card'
import { EmptyState } from '@atlas/ui/empty-state'
import { Spinner } from '@atlas/ui/spinner'
import { DataTable, type DataTableColumn } from '@atlas/ui/table'
import { useAppNavigate } from '@/contexts/DomainContext'
import { groupApi } from '@/services'
import type { Group } from '@/types'
import styles from './index.module.scss'

export function List() {
  const navigate = useAppNavigate()
  const { data, loading } = useRequest(() => groupApi.getList())
  const groups = data?.items ?? []
  const columns: DataTableColumn<Group>[] = [
    {
      key: 'group_id',
      header: '组 ID',
      width: 180,
      render: group => <code>{group.group_id}</code>,
    },
    { key: 'name', header: '名称', width: 180, render: group => group.name },
    {
      key: 'description',
      header: '描述',
      render: group => group.description || <span className="text-muted-foreground">—</span>,
    },
    {
      key: 'action',
      header: '操作',
      width: 170,
      render: group => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/groups/${group.group_id}`)}>
            <Eye />
            查看
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/groups/${group.group_id}/edit`)}
          >
            <Pencil />
            编辑
          </Button>
        </div>
      ),
    },
  ]
  const create = (
    <Button onClick={() => navigate('/groups/create')}>
      <Plus />
      创建组
    </Button>
  )
  return (
    <div className={styles.container}>
      <Card>
        <CardHeader className="flex-row items-start justify-between">
          <div className="grid gap-1.5">
            <CardTitle>组</CardTitle>
            <p className={styles.headerDesc}>组用于聚合用户或身份，并作为关系中的主体或对象。</p>
          </div>
          {create}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex min-h-40 items-center justify-center">
              <Spinner />
            </div>
          ) : groups.length ? (
            <DataTable columns={columns} data={groups} rowKey="group_id" />
          ) : (
            <EmptyState title="暂无组数据" icon={<Users className="size-8" />} action={create} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
