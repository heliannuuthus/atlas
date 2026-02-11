import { Card, Table, Tag, Space, Input, DatePicker } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import styles from './index.module.scss'

const { Search } = Input
const { RangePicker } = DatePicker

interface History {
  id: string
  userId: string
  userName: string
  recipeId: string
  recipeTitle: string
  recipeCategory: string
  viewTime: string
  duration: number
}

const mockHistory: History[] = [
  {
    id: '1',
    userId: 'user001',
    userName: '张三',
    recipeId: '1',
    recipeTitle: '宫保鸡丁',
    recipeCategory: '川菜',
    viewTime: '2024-01-20 15:30:00',
    duration: 180,
  },
  {
    id: '2',
    userId: 'user002',
    userName: '李四',
    recipeId: '2',
    recipeTitle: '番茄鸡蛋面',
    recipeCategory: '面食',
    viewTime: '2024-01-20 14:20:00',
    duration: 120,
  },
  {
    id: '3',
    userId: 'user003',
    userName: '王五',
    recipeId: '3',
    recipeTitle: '红烧肉',
    recipeCategory: '家常菜',
    viewTime: '2024-01-20 13:15:00',
    duration: 240,
  },
  {
    id: '4',
    userId: 'user001',
    userName: '张三',
    recipeId: '5',
    recipeTitle: '日式寿司',
    recipeCategory: '日料',
    viewTime: '2024-01-19 16:45:00',
    duration: 300,
  },
  {
    id: '5',
    userId: 'user004',
    userName: '赵六',
    recipeId: '2',
    recipeTitle: '番茄鸡蛋面',
    recipeCategory: '面食',
    viewTime: '2024-01-19 11:00:00',
    duration: 90,
  },
]

export function History() {
  const columns: ColumnsType<History> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      width: 100,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName',
      width: 120,
    },
    {
      title: '菜谱ID',
      dataIndex: 'recipeId',
      key: 'recipeId',
      width: 100,
    },
    {
      title: '菜谱名称',
      dataIndex: 'recipeTitle',
      key: 'recipeTitle',
      width: 150,
    },
    {
      title: '分类',
      dataIndex: 'recipeCategory',
      key: 'recipeCategory',
      width: 100,
      render: (category: string) => <Tag>{category}</Tag>,
    },
    {
      title: '浏览时间',
      dataIndex: 'viewTime',
      key: 'viewTime',
      width: 180,
      sorter: (a, b) => dayjs(a.viewTime).unix() - dayjs(b.viewTime).unix(),
    },
    {
      title: '停留时长',
      dataIndex: 'duration',
      key: 'duration',
      width: 120,
      render: (duration: number) => `${Math.floor(duration / 60)} 分 ${duration % 60} 秒`,
      sorter: (a, b) => a.duration - b.duration,
    },
  ]

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.header}>
          <h2>浏览历史</h2>
          <Space>
            <RangePicker />
            <Search placeholder="搜索用户或菜谱" style={{ width: 300 }} allowClear />
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={mockHistory}
          rowKey="id"
          pagination={{
            total: mockHistory.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  )
}
