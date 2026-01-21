import { useState } from 'react'
import { useRequest } from 'ahooks'
import { Card, Table, Button, Space, Input, Select, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { applicationApi, domainApi } from '@/services'
import type { Application } from '@/types/management'
import styles from './index.module.scss'

const { Search } = Input

export function List() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [domainId, setDomainId] = useState<string | undefined>()

  const { data: domains } = useRequest(() => domainApi.getList())

  const { data, loading, refresh } = useRequest(
    () => applicationApi.getList({ domain_id: domainId }),
    { refreshDeps: [domainId] }
  )

  const filteredData = (data || []).filter((item) => {
    if (!keyword) return true
    return (
      item.name.toLowerCase().includes(keyword.toLowerCase()) ||
      item.app_id.toLowerCase().includes(keyword.toLowerCase())
    )
  })

  const columns: ColumnsType<Application> = [
    { title: '应用ID', dataIndex: 'app_id', key: 'app_id', width: 200 },
    { title: '名称', dataIndex: 'name', key: 'name', width: 200 },
    { title: '域ID', dataIndex: 'domain_id', key: 'domain_id', width: 120 },
    { title: '重定向URI', dataIndex: 'redirect_uris', key: 'redirect_uris', ellipsis: true },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/hermes/applications/${record.app_id}`)}>查看</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => navigate(`/hermes/applications/${record.app_id}/edit`)}>编辑</Button>
        </Space>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.header}>
          <div className={styles.title}>应用管理</div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/hermes/applications/create')}>新建应用</Button>
        </div>
        <div className={styles.filters}>
          <Space size="middle">
            <Search placeholder="搜索应用名称、应用ID" allowClear style={{ width: 300 }} value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            <Select placeholder="选择域" style={{ width: 200 }} value={domainId} onChange={setDomainId} allowClear>
              {domains?.map((domain) => <Select.Option key={domain.domain_id} value={domain.domain_id}>{domain.name}</Select.Option>)}
            </Select>
            <Button icon={<ReloadOutlined />} onClick={refresh}>刷新</Button>
          </Space>
        </div>
        <Table columns={columns} dataSource={filteredData} loading={loading} rowKey="app_id" scroll={{ x: 1200 }} />
      </Card>
    </div>
  )
}
