import { useRequest } from 'ahooks'
import { Card, Table, Button, Empty, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { EyeOutlined, ReloadOutlined, ApartmentOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { domainApi } from '@/services'
import type { Domain } from '@/types/management'
import { formatDateTime } from '@/utils'
import styles from './index.module.scss'

const { Text } = Typography

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
      width: 120,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: text => text || <Text type="secondary">-</Text>,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 160,
      render: text => formatDateTime(text),
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      key: 'updated_at',
      width: 160,
      render: text => formatDateTime(text),
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/hermes/domains/${record.domain_id}`)}
        >
          查看
        </Button>
      ),
    },
  ]

  // 空状态组件
  const emptyState = (
    <Empty
      image={<ApartmentOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />}
      imageStyle={{ height: 60 }}
      description="暂无域数据"
    />
  )

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
          scroll={{ x: 800 }}
          locale={{ emptyText: emptyState }}
        />
      </Card>
    </div>
  )
}
