import { useCallback, useMemo, useState } from 'react'
import { useRequest } from 'ahooks'
import { GitBranch, LoaderCircle, Plus, Share2, Trash2 } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { Badge } from '@atlas/ui/badge'
import { Button } from '@atlas/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@atlas/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@atlas/ui/dialog'
import { EmptyState } from '@atlas/ui/empty-state'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@atlas/ui/select'
import { Spinner } from '@atlas/ui/spinner'
import { DataTable, type DataTableColumn } from '@atlas/ui/table'
import { toast } from '@atlas/ui/toast'
import { formatRelativeTime, isExpiringSoon } from '@atlas/shared'
import { useAppNavigate } from '@/contexts/DomainContext'
import { relationshipApi } from '@/services'
import type { Relationship } from '@/types'
import styles from './index.module.scss'

const subjectTypeLabels: Record<string, string> = { user: '用户', group: '组', application: '应用' }

export function List() {
  const { serviceId: urlServiceId } = useParams<{ serviceId: string }>()
  const navigate = useAppNavigate()
  const [subjectType, setSubjectType] = useState<string>('all')
  const [pendingDelete, setPendingDelete] = useState<Relationship | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { data, loading, refresh } = useRequest(
    () =>
      relationshipApi.getList({
        service_id: urlServiceId,
        subject_type: subjectType === 'all' ? undefined : subjectType,
      }),
    { refreshDeps: [urlServiceId, subjectType] }
  )
  const relationships = data?.items ?? []
  const deleteRelationship = useCallback(async () => {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await relationshipApi.delete({
        service_id: pendingDelete.service_id,
        subject_type: pendingDelete.subject_type,
        subject_id: pendingDelete.subject_id,
        relation: pendingDelete.relation,
        object_type: pendingDelete.object_type,
        object_id: pendingDelete.object_id,
      })
      toast.success('删除成功')
      setPendingDelete(null)
      refresh()
    } catch {
      toast.error('删除失败')
    } finally {
      setDeleting(false)
    }
  }, [pendingDelete, refresh])
  const columns = useMemo<DataTableColumn<Relationship>[]>(() => {
    const result: DataTableColumn<Relationship>[] = [
      {
        key: 'subject',
        header: '主体',
        width: 220,
        render: relation => (
          <div className={styles.entityCell}>
            <Badge variant="secondary">
              {subjectTypeLabels[relation.subject_type] || relation.subject_type}
            </Badge>
            <span className="max-w-32 truncate" title={relation.subject_id}>
              {relation.subject_id}
            </span>
          </div>
        ),
      },
      {
        key: 'relation',
        header: '关系',
        width: 120,
        render: relation => <Badge>{relation.relation}</Badge>,
      },
      {
        key: 'object',
        header: '对象',
        width: 220,
        render: relation => (
          <div className={styles.entityCell}>
            <Badge variant="outline">{relation.object_type}</Badge>
            <span className="max-w-32 truncate" title={relation.object_id}>
              {relation.object_id}
            </span>
          </div>
        ),
      },
      {
        key: 'expires_at',
        header: '过期时间',
        width: 140,
        render: relation =>
          relation.expires_at ? (
            <span className={isExpiringSoon(relation.expires_at) ? 'text-amber-700' : undefined}>
              {formatRelativeTime(relation.expires_at)}
            </span>
          ) : (
            <span className="text-muted-foreground">永久</span>
          ),
      },
      {
        key: 'action',
        header: '操作',
        width: 90,
        render: relation => (
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={() => setPendingDelete(relation)}
          >
            <Trash2 />
            删除
          </Button>
        ),
      },
    ]
    if (!urlServiceId)
      result.unshift({
        key: 'service_id',
        header: '服务',
        width: 140,
        render: relation => <Badge variant="outline">{relation.service_id}</Badge>,
      })
    return result
  }, [urlServiceId])
  const createPath = urlServiceId
    ? `/services/${urlServiceId}/relationships/create`
    : '/relationships/create'
  const graphPath = urlServiceId
    ? `/services/${urlServiceId}/relationships/graph`
    : '/relationships/graph'
  const actions = (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => navigate(graphPath)}>
        <GitBranch />
        关系图谱
      </Button>
      <Button onClick={() => navigate(createPath)}>
        <Plus />
        配置关系
      </Button>
    </div>
  )

  return (
    <div className={styles.container}>
      <Card>
        <CardHeader className="flex-row items-start justify-between">
          <div className="grid gap-1.5">
            <CardTitle>
              关系管理{' '}
              {urlServiceId ? (
                <span className="text-sm font-normal text-muted-foreground">({urlServiceId})</span>
              ) : null}
            </CardTitle>
            <p className={styles.headerDesc}>主体—关系—对象构成服务内的授权关系。</p>
          </div>
          {actions}
        </CardHeader>
        <CardContent className="grid gap-4">
          <Select value={subjectType} onValueChange={setSubjectType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部主体</SelectItem>
              <SelectItem value="user">用户</SelectItem>
              <SelectItem value="group">组</SelectItem>
              <SelectItem value="application">应用</SelectItem>
            </SelectContent>
          </Select>
          {loading ? (
            <div className="flex min-h-40 items-center justify-center">
              <Spinner />
            </div>
          ) : relationships.length ? (
            <DataTable
              columns={columns}
              data={relationships}
              rowKey={relation =>
                `${relation.service_id}:${relation.subject_type}:${relation.subject_id}:${relation.relation}:${relation.object_type}:${relation.object_id}`
              }
            />
          ) : (
            <EmptyState
              title="暂无关系数据"
              icon={<Share2 className="size-8" />}
              action={actions}
            />
          )}
        </CardContent>
        <Dialog
          open={pendingDelete !== null}
          onOpenChange={open => !open && setPendingDelete(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>删除关系</DialogTitle>
              <DialogDescription>确定删除这条授权关系？此操作无法撤销。</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPendingDelete(null)}>
                取消
              </Button>
              <Button
                variant="destructive"
                disabled={deleting}
                onClick={() => void deleteRelationship()}
              >
                {deleting ? <LoaderCircle className="animate-spin" /> : null}删除
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  )
}
