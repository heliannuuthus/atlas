import { LoaderCircle, Maximize2, Minimize2, RefreshCw, Save } from 'lucide-react'
import { Badge } from '@atlas/ui/badge'
import { Button } from '@atlas/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@atlas/ui/select'
import type { Service } from '@/types'
import styles from './index.module.scss'

interface CanvasHeaderProps {
  services: Service[]
  selectedServiceId: string | undefined
  onServiceChange: (serviceId: string | undefined) => void
  onSave: () => void
  onReset: () => void
  onToggleFullscreen: () => void
  isFullscreen: boolean
  isDirty: boolean
  saving: boolean
  relationCount: number
  isLocked?: boolean
}

export function CanvasHeader(props: CanvasHeaderProps) {
  return (
    <header className={styles.canvasHeader}>
      <div className={styles.headerLeft}>
        <strong className={styles.headerTitle}>关系图谱</strong>
        {props.selectedServiceId ? (
          <span className={styles.relationCount}>
            服务 <strong>{props.selectedServiceId}</strong> · {props.relationCount} 条关系
          </span>
        ) : null}
      </div>
      <div className={styles.headerRight}>
        {!props.isLocked ? (
          <Select value={props.selectedServiceId} onValueChange={props.onServiceChange}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="选择服务" />
            </SelectTrigger>
            <SelectContent>
              {props.services.map(service => (
                <SelectItem key={service.service_id} value={service.service_id}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
        <Button type="button" variant="outline" title="重置画布" onClick={props.onReset}>
          <RefreshCw />
          重置
        </Button>
        <Button
          type="button"
          disabled={!props.isDirty || !props.selectedServiceId || props.saving}
          onClick={props.onSave}
        >
          {props.saving ? <LoaderCircle className="animate-spin" /> : <Save />}保存
          {props.isDirty ? (
            <Badge variant="secondary" className="ml-1 px-1.5">
              未保存
            </Badge>
          ) : null}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          title={props.isFullscreen ? '退出全屏' : '全屏'}
          aria-label={props.isFullscreen ? '退出全屏' : '全屏'}
          onClick={props.onToggleFullscreen}
        >
          {props.isFullscreen ? <Minimize2 /> : <Maximize2 />}
        </Button>
      </div>
    </header>
  )
}
