import { useState, useEffect } from 'react'
import { Modal, Form, Input, Select, DatePicker } from 'antd'
import type { Dayjs } from 'dayjs'

interface CreateRelationDialogProps {
  open: boolean
  sourceNode: {
    type: string
    id: string
  } | null
  targetNode: {
    type: string
    id: string
  } | null
  serviceId: string
  onConfirm: (data: {
    relation: string
    expiresAt?: string
  }) => void
  onCancel: () => void
}

// 常用关系类型选项
const relationOptions = [
  { value: 'owner', label: 'owner - 所有者' },
  { value: 'admin', label: 'admin - 管理员' },
  { value: 'member', label: 'member - 成员' },
  { value: 'viewer', label: 'viewer - 查看者' },
  { value: 'editor', label: 'editor - 编辑者' },
  { value: 'reader', label: 'reader - 读取者' },
  { value: 'writer', label: 'writer - 写入者' },
]

export function CreateRelationDialog({
  open,
  sourceNode,
  targetNode,
  serviceId,
  onConfirm,
  onCancel,
}: CreateRelationDialogProps) {
  const [form] = Form.useForm()
  const [customRelation, setCustomRelation] = useState(false)

  useEffect(() => {
    if (open) {
      form.resetFields()
      setCustomRelation(false)
    }
  }, [open, form])

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      onConfirm({
        relation: values.relation,
        expiresAt: values.expiresAt
          ? (values.expiresAt as Dayjs).toISOString()
          : undefined,
      })
    } catch {
      // 表单验证失败
    }
  }

  return (
    <Modal
      title="创建关系"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="创建"
      cancelText="取消"
      destroyOnClose
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        {/* 显示关系信息 */}
        <div
          style={{
            padding: '12px 16px',
            background: '#fafafa',
            borderRadius: 6,
            marginBottom: 16,
            fontSize: 13,
          }}
        >
          <div style={{ marginBottom: 8 }}>
            <span style={{ color: '#8c8c8c' }}>服务: </span>
            <span style={{ fontWeight: 500 }}>{serviceId || '未选择'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                padding: '2px 8px',
                background: '#e6f4ff',
                borderRadius: 4,
                fontSize: 12,
              }}
            >
              {sourceNode?.type}:{sourceNode?.id}
            </span>
            <span style={{ color: '#8c8c8c' }}>→</span>
            <span
              style={{
                padding: '2px 8px',
                background: '#f6ffed',
                borderRadius: 4,
                fontSize: 12,
              }}
            >
              {targetNode?.type}:{targetNode?.id}
            </span>
          </div>
        </div>

        {/* 关系类型 */}
        <Form.Item
          name="relation"
          label="关系类型"
          rules={[{ required: true, message: '请选择或输入关系类型' }]}
        >
          {customRelation ? (
            <Input
              placeholder="输入自定义关系类型"
              suffix={
                <a onClick={() => setCustomRelation(false)} style={{ fontSize: 12 }}>
                  选择预设
                </a>
              }
            />
          ) : (
            <Select
              placeholder="选择关系类型"
              options={relationOptions}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div
                    style={{
                      padding: '8px 12px',
                      borderTop: '1px solid #f0f0f0',
                    }}
                  >
                    <a onClick={() => setCustomRelation(true)}>自定义关系类型</a>
                  </div>
                </>
              )}
            />
          )}
        </Form.Item>

        {/* 过期时间（可选） */}
        <Form.Item name="expiresAt" label="过期时间（可选）">
          <DatePicker
            showTime
            style={{ width: '100%' }}
            placeholder="选择过期时间"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
