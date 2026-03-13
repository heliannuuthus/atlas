import { useRequest } from 'ahooks'
import { Card, Table, Button, Empty, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { EyeOutlined, ApartmentOutlined } from '@ant-design/icons'
import { useAppNavigate } from '@/contexts/DomainContext'
import { domainApi } from '@/services'
import type { Domain } from '@/types'
import styles from './index.module.scss'

const { Text } = Typography

export function List() {
  const navigate = useAppNavigate()

  const { data, loading } = useRequest(() => domainApi.getList(), {
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
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/domains/${record.domain_id}`)}
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
          <div className={styles.headerLeft}>
            <div className={styles.title}>域</div>
            <Typography.Text type="secondary" className={styles.headerDesc}>
              域是身份与权限的隔离边界，当前仅展示该域本身；服务、应用与组均在域下创建与查看。
            </Typography.Text>
          </div>
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
