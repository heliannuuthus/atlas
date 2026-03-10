import { useRequest } from 'ahooks'
import { Card, Table, Button, Space, Empty, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  ReloadOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { groupApi } from '@/services'
import type { Group } from '@/types/management'
import styles from './index.module.scss'

const { Text } = Typography

export function List() {
  const navigate = useNavigate()

  const { data, loading, refresh } = useRequest(() => groupApi.getList())

  const tableData = data || []

  const columns: ColumnsType<Group> = [
    { title: '组ID', dataIndex: 'group_id', key: 'group_id', width: 180, ellipsis: true },
    { title: '名称', dataIndex: 'name', key: 'name', width: 180 },
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
      width: 140,
      fixed: 'right',
      render: (_, record) => (
        <Space size={0}>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/hermes/groups/${record.group_id}`)}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/hermes/groups/${record.group_id}/edit`)}
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
      image={<TeamOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />}
      imageStyle={{ height: 60 }}
      description="暂无组数据"
    >
      <Button type="primary" onClick={() => navigate('/hermes/groups/create')}>
        创建第一个组
      </Button>
    </Empty>
  )

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.header}>
          <div className={styles.title}>组管理</div>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={refresh}>
              刷新
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/hermes/groups/create')}
            >
              新建组
            </Button>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={tableData}
          loading={loading}
          rowKey="group_id"
          scroll={{ x: 600 }}
          locale={{ emptyText: emptyState }}
        />
      </Card>
    </div>
  )
}
