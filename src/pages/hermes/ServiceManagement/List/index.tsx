import { useState } from 'react'
import { useRequest } from 'ahooks'
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  message,
  Tag,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { serviceApi, domainApi } from '@/services'
import type { Service, Domain } from '@/types/management'
import styles from './index.module.scss'

const { Search } = Input

export function List() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [domainId, setDomainId] = useState<string | undefined>()

  const { data: domains } = useRequest(() => domainApi.getList())

  const {
    data,
    loading,
    refresh,
  } = useRequest(
    () => serviceApi.getList({ domain_id: domainId }),
    {
      refreshDeps: [domainId],
    }
  )

  const filteredData = data?.filter((item) => {
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
      width: 200,
    },
    {
      title: '域ID',
      dataIndex: 'domain_id',
      key: 'domain_id',
      width: 120,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Access Token 过期时间',
      dataIndex: 'access_token_expires_in',
      key: 'access_token_expires_in',
      width: 180,
      render: (value) => `${value}秒`,
    },
    {
      title: 'Refresh Token 过期时间',
      dataIndex: 'refresh_token_expires_in',
      key: 'refresh_token_expires_in',
      width: 200,
      render: (value) => `${value}秒`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 0 ? 'green' : 'red'}>
          {status === 0 ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/hermes/services/${record.service_id}`)}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/hermes/services/${record.service_id}/edit`)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.header}>
          <div className={styles.title}>服务管理</div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/hermes/services/create')}
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
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Select
              placeholder="选择域"
              style={{ width: 200 }}
              value={domainId}
              onChange={setDomainId}
              allowClear
            >
              {domains?.map((domain) => (
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
          scroll={{ x: 1400 }}
        />
      </Card>
    </div>
  )
}
