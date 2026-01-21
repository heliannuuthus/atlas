import { useRequest } from 'ahooks'
import { Card, Table, Space, Button, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { EyeOutlined, ReloadOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { domainApi } from '@/services'
import type { Domain } from '@/types/management'
import styles from './index.module.scss'

export function List() {
  const navigate = useNavigate()

  const { data, loading, refresh } = useRequest(() => domainApi.getList(), {
    refreshDeps: [],
  })

  const tableData = data || []

  const columns: ColumnsType<Domain> = [
    {
      title: '域ID',
      dataIndex: 'domain_id',
      key: 'domain_id',
      width: 150,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (text) => new Date(text).toLocaleString('zh-CN'),
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: 180,
      render: (text) => new Date(text).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/hermes/domains/${record.domain_id}`)}
          >
            查看
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.header}>
          <div className={styles.title}>域管理</div>
          <Button icon={<ReloadOutlined />} onClick={refresh}>
            刷新
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={tableData}
          loading={loading}
          rowKey="domain_id"
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  )
}
