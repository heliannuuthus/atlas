import { useState } from 'react'
import { useRequest } from 'ahooks'
import {
  Card,
  Table,
  Button,
  Space,
  Select,
  message,
  Popconfirm,
  Tag,
  Empty,
  Typography,
  Tooltip,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  PlusOutlined,
  ReloadOutlined,
  DeleteOutlined,
  ShareAltOutlined,
  NodeIndexOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { relationshipApi, serviceApi } from '@/services'
import type { Relationship } from '@/types/management'
import { formatRelativeTime, isExpiringSoon } from '@/utils'
import styles from './index.module.scss'

const { Text } = Typography

// 主体类型标签颜色映射
const subjectTypeColors: Record<string, string> = {
  user: 'blue',
  group: 'green',
  application: 'orange',
}

// 主体类型显示名称
const subjectTypeLabels: Record<string, string> = {
  user: '用户',
  group: '组',
  application: '应用',
}

export function List() {
  const navigate = useNavigate()
  const [serviceId, setServiceId] = useState<string | undefined>()
  const [subjectType, setSubjectType] = useState<string | undefined>()

  const { data: services } = useRequest(() => serviceApi.getList())

  const { data, loading, refresh } = useRequest(
    () => relationshipApi.getList({ service_id: serviceId, subject_type: subjectType }),
    { refreshDeps: [serviceId, subjectType] }
  )

  const tableData = data || []

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
    {
      title: '服务',
      dataIndex: 'service_id',
      key: 'service_id',
      width: 120,
      render: value => <Tag bordered={false}>{value}</Tag>,
    },
    {
      title: '主体',
      key: 'subject',
      width: 200,
      render: (_, record) => (
        <div className={styles.entityCell}>
          <Tag color={subjectTypeColors[record.subject_type]} bordered={false}>
            {subjectTypeLabels[record.subject_type] || record.subject_type}
          </Tag>
          <Tooltip title={record.subject_id}>
            <Text ellipsis style={{ maxWidth: 120 }}>
              {record.subject_id}
            </Text>
          </Tooltip>
        </div>
      ),
    },
    {
      title: '关系',
      dataIndex: 'relation',
      key: 'relation',
      width: 100,
      render: value => (
        <Tag color="processing" bordered={false}>
          {value}
        </Tag>
      ),
    },
    {
      title: '对象',
      key: 'object',
      width: 200,
      render: (_, record) => (
        <div className={styles.entityCell}>
          <Tag bordered={false}>{record.object_type}</Tag>
          <Tooltip title={record.object_id}>
            <Text ellipsis style={{ maxWidth: 120 }}>
              {record.object_id}
            </Text>
          </Tooltip>
        </div>
      ),
    },
    {
      title: '过期时间',
      dataIndex: 'expires_at',
      key: 'expires_at',
      width: 140,
      render: text => {
        if (!text) return <Text type="secondary">永久</Text>
        const expiring = isExpiringSoon(text)
        return <Text type={expiring ? 'warning' : undefined}>{formatRelativeTime(text)}</Text>
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Popconfirm title="确定要删除吗？" onConfirm={() => handleDelete(record)}>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ]

  // 空状态组件
  const emptyState = (
    <Empty
      image={<ShareAltOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />}
      imageStyle={{ height: 60 }}
      description="暂无关系数据"
    >
      <Space>
        <Button type="primary" onClick={() => navigate('/hermes/relationships/create')}>
          创建关系
        </Button>
        <Button
          icon={<NodeIndexOutlined />}
          onClick={() => navigate('/hermes/relationships/graph')}
        >
          使用关系图谱
        </Button>
      </Space>
    </Empty>
  )

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.header}>
          <div className={styles.title}>关系列表</div>
          <Space>
            <Button
              icon={<NodeIndexOutlined />}
              onClick={() => navigate('/hermes/relationships/graph')}
            >
              关系图谱
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/hermes/relationships/create')}
            >
              新建关系
            </Button>
          </Space>
        </div>
        <div className={styles.filters}>
          <Space size="middle">
            <Select
              placeholder="选择服务"
              style={{ width: 200 }}
              value={serviceId}
              onChange={setServiceId}
              allowClear
            >
              {services?.map(s => (
                <Select.Option key={s.service_id} value={s.service_id}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
            <Select
              placeholder="选择主体类型"
              style={{ width: 150 }}
              value={subjectType}
              onChange={setSubjectType}
              allowClear
            >
              <Select.Option value="user">用户</Select.Option>
              <Select.Option value="group">组</Select.Option>
              <Select.Option value="application">应用</Select.Option>
            </Select>
            <Button icon={<ReloadOutlined />} onClick={refresh}>
              刷新
            </Button>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={tableData}
          loading={loading}
          rowKey="_id"
          scroll={{ x: 900 }}
          locale={{ emptyText: emptyState }}
        />
      </Card>
    </div>
  )
}
