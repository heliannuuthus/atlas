import { useState } from 'react'
import { useRequest } from 'ahooks'
import { Card, Table, Button, Space, Input, Select, Tag, Empty, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  ReloadOutlined,
  CloudServerOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { serviceApi, domainApi } from '@/services'
import type { Service } from '@/types'
import { formatDuration } from '@atlas/shared'
import styles from './index.module.scss'

const { Search } = Input
const { Text } = Typography

export function List() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [domainId, setDomainId] = useState<string | undefined>()

  const { data: domains } = useRequest(() => domainApi.getList())

  const { data, loading, refresh } = useRequest(() => serviceApi.getList({ domain_id: domainId }), {
    refreshDeps: [domainId],
  })

  const filteredData = (data || []).filter(item => {
    if (!keyword) return true
    return (
      item.name.toLowerCase().includes(keyword.toLowerCase()) ||
      item.service_id.toLowerCase().includes(keyword.toLowerCase())
    )
  })

  const columns: ColumnsType<Service> = [
    {
      title: '服务ID',
      dataIndex: 'service_id',
      key: 'service_id',
      width: 150,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
    },
    {
      title: '域',
      dataIndex: 'domain_id',
      key: 'domain_id',
      width: 100,
      render: value => <Tag bordered={false}>{value}</Tag>,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: value => value || <Text type="secondary">-</Text>,
    },
    {
      title: 'Token 有效期',
      key: 'token_expiry',
      width: 160,
      render: (_, record) => (
        <div className={styles.tokenExpiry}>
          <div className={styles.tokenRow}>
            <Text type="secondary">Access:</Text>
            <span>{formatDuration(record.access_token_expires_in)}</span>
          </div>
          <div className={styles.tokenRow}>
            <Text type="secondary">Refresh:</Text>
            <span>{formatDuration(record.refresh_token_expires_in)}</span>
          </div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: status => (
        <Tag color={status === 0 ? 'success' : 'error'} bordered={false}>
          {status === 0 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      fixed: 'right',
      render: (_, record) => (
        <Space size={0}>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/services/${record.service_id}`)}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/services/${record.service_id}/edit`)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ]

  // 空状态组件
  const emptyState = (
    <Empty
      image={<CloudServerOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />}
      imageStyle={{ height: 60 }}
      description="暂无服务"
    >
      <Button type="primary" onClick={() => navigate('/services/create')}>
        创建第一个服务
      </Button>
    </Empty>
  )

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.header}>
          <div className={styles.title}>服务管理</div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/services/create')}
          >
            新建服务
          </Button>
        </div>

        <div className={styles.filters}>
          <Space size="middle">
            <Search
              placeholder="搜索服务名称、服务ID"
              allowClear
              style={{ width: 300 }}
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
            <Select
              placeholder="选择域"
              style={{ width: 200 }}
              value={domainId}
              onChange={setDomainId}
              allowClear
            >
              {domains?.map(domain => (
                <Select.Option key={domain.domain_id} value={domain.domain_id}>
                  {domain.name}
                </Select.Option>
              ))}
            </Select>
            <Button icon={<ReloadOutlined />} onClick={refresh}>
              刷新
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          rowKey="service_id"
          scroll={{ x: 1100 }}
          locale={{ emptyText: emptyState }}
        />
      </Card>
    </div>
  )
}
