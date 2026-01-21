import { useRequest } from 'ahooks'
import { Card, Table, Button, Space, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { groupApi } from '@/services'
import type { Group } from '@/types/management'
import styles from './index.module.scss'

export function List() {
  const navigate = useNavigate()

  const { data, loading, refresh } = useRequest(() => groupApi.getList())

  const tableData = data || []

  const columns: ColumnsType<Group> = [
    { title: '组ID', dataIndex: 'group_id', key: 'group_id', width: 200 },
    { title: '名称', dataIndex: 'name', key: 'name', width: 200 },
    { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => navigate(`/hermes/groups/${record.group_id}`)}>查看</Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => navigate(`/hermes/groups/${record.group_id}/edit`)}>编辑</Button>
        </Space>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.header}>
          <div className={styles.title}>组管理</div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/hermes/groups/create')}>新建组</Button>
        </div>
        <div className={styles.filters}>
          <Button icon={<ReloadOutlined />} onClick={refresh}>刷新</Button>
        </div>
        <Table columns={columns} dataSource={tableData} loading={loading} rowKey="group_id" scroll={{ x: 1000 }} />
      </Card>
    </div>
  )
}
