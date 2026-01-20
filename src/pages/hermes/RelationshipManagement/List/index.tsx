import { useState } from 'react'
import { useRequest } from 'ahooks'
import { Card, Table, Button, Space, Input, Select, message, Popconfirm } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, ReloadOutlined, DeleteOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { relationshipApi, serviceApi } from '@/services'
import type { Relationship } from '@/types/management'
import styles from './index.module.scss'

const { Search } = Input

export function List() {
  const navigate = useNavigate()
  const [serviceId, setServiceId] = useState<string | undefined>()
  const [subjectType, setSubjectType] = useState<string | undefined>()

  const { data: services } = useRequest(() => serviceApi.getList())

  const { data, loading, refresh } = useRequest(
    () => relationshipApi.getList({ service_id: serviceId, subject_type: subjectType }),
    { refreshDeps: [serviceId, subjectType] }
  )

  const handleDelete = async (rel: Relationship) => {
    try {
      await relationshipApi.delete({
        service_id: rel.service_id,
        subject_type: rel.subject_type,
        subject_id: rel.subject_id,
        relation: rel.relation,
        object_type: rel.object_type,
        object_id: rel.object_id,
      })
      message.success('删除成功')
      refresh()
    } catch {
      message.error('删除失败')
    }
  }

  const columns: ColumnsType<Relationship> = [
    { title: '服务ID', dataIndex: 'service_id', key: 'service_id', width: 150 },
    { title: '主体类型', dataIndex: 'subject_type', key: 'subject_type', width: 120 },
    { title: '主体ID', dataIndex: 'subject_id', key: 'subject_id', width: 150 },
    { title: '关系', dataIndex: 'relation', key: 'relation', width: 120 },
    { title: '对象类型', dataIndex: 'object_type', key: 'object_type', width: 120 },
    { title: '对象ID', dataIndex: 'object_id', key: 'object_id', width: 150 },
    { title: '过期时间', dataIndex: 'expires_at', key: 'expires_at', width: 180, render: (text) => text ? new Date(text).toLocaleString('zh-CN') : '-' },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Popconfirm title="确定要删除吗？" onConfirm={() => handleDelete(record)}>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
        </Popconfirm>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.header}>
          <div className={styles.title}>关系管理</div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/hermes/relationships/create')}>新建关系</Button>
        </div>
        <div className={styles.filters}>
          <Space size="middle">
            <Select placeholder="选择服务" style={{ width: 200 }} value={serviceId} onChange={setServiceId} allowClear>
              {services?.map((s) => <Select.Option key={s.service_id} value={s.service_id}>{s.name}</Select.Option>)}
            </Select>
            <Select placeholder="选择主体类型" style={{ width: 150 }} value={subjectType} onChange={setSubjectType} allowClear>
              <Select.Option value="user">用户</Select.Option>
              <Select.Option value="group">组</Select.Option>
              <Select.Option value="application">应用</Select.Option>
            </Select>
            <Button icon={<ReloadOutlined />} onClick={refresh}>刷新</Button>
          </Space>
        </div>
        <Table columns={columns} dataSource={data} loading={loading} rowKey="_id" scroll={{ x: 1200 }} />
      </Card>
    </div>
  )
}
