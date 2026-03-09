import { Button, Select, Space, Tooltip, Badge } from 'antd'
import {
  SaveOutlined,
  ReloadOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from '@ant-design/icons'
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
}

export function CanvasHeader({
  services,
  selectedServiceId,
  onServiceChange,
  onSave,
  onReset,
  onToggleFullscreen,
  isFullscreen,
  isDirty,
  saving,
  relationCount,
}: CanvasHeaderProps) {
  return (
    <div className={styles.canvasHeader}>
      <div className={styles.headerLeft}>
        <span className={styles.headerTitle}>关系图谱</span>
        <span className={styles.relationCount}>
          已建立 <strong>{relationCount}</strong> 条关系
        </span>
      </div>

      <div className={styles.headerRight}>
        <Space size="middle">
          <Select
            placeholder="选择服务"
            style={{ width: 200 }}
            value={selectedServiceId}
            onChange={onServiceChange}
            allowClear
            options={services.map(s => ({
              value: s.service_id,
              label: s.name,
            }))}
          />

          <Tooltip title="重置画布">
            <Button icon={<ReloadOutlined />} onClick={onReset}>
              重置
            </Button>
          </Tooltip>

          <Tooltip title={isDirty ? '有未保存的更改' : '保存'}>
            <Badge dot={isDirty} offset={[-4, 4]}>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={onSave}
                loading={saving}
                disabled={!isDirty || !selectedServiceId}
              >
                保存
              </Button>
            </Badge>
          </Tooltip>

          <Tooltip title={isFullscreen ? '退出全屏' : '全屏'}>
            <Button
              icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
              onClick={onToggleFullscreen}
            />
          </Tooltip>
        </Space>
      </div>
    </div>
  )
}
