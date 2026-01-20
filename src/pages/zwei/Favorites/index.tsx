import { Card, Table, Tag, Space, Input } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { SearchOutlined } from '@ant-design/icons'
import styles from './index.module.scss'

const { Search } = Input

interface Favorite {
  id: string
  userId: string
  userName: string
  recipeId: string
  recipeTitle: string
  recipeCategory: string
  createdAt: string
}

const mockFavorites: Favorite[] = [
  {
    id: '1',
    userId: 'user001',
    userName: '张三',
    recipeId: '1',
    recipeTitle: '宫保鸡丁',
    recipeCategory: '川菜',
    createdAt: '2024-01-20 10:30:00',
  },
  {
    id: '2',
    userId: 'user002',
    userName: '李四',
    recipeId: '2',
    recipeTitle: '番茄鸡蛋面',
    recipeCategory: '面食',
    createdAt: '2024-01-20 09:15:00',
  },
  {
    id: '3',
    userId: 'user003',
    userName: '王五',
    recipeId: '3',
    recipeTitle: '红烧肉',
    recipeCategory: '家常菜',
    createdAt: '2024-01-19 16:45:00',
  },
  {
    id: '4',
    userId: 'user001',
    userName: '张三',
    recipeId: '5',
    recipeTitle: '日式寿司',
    recipeCategory: '日料',
    createdAt: '2024-01-19 14:20:00',
  },
  {
    id: '5',
    userId: 'user004',
    userName: '赵六',
    recipeId: '2',
    recipeTitle: '番茄鸡蛋面',
    recipeCategory: '面食',
    createdAt: '2024-01-18 11:00:00',
  },
]

export function Favorites() {
  const columns: ColumnsType<Favorite> = [
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
      title: '收藏时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
    },
  ]

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.header}>
          <h2>收藏管理</h2>
          <Search placeholder="搜索用户或菜谱" style={{ width: 300 }} allowClear />
        </div>
        <Table
          columns={columns}
          dataSource={mockFavorites}
          rowKey="id"
          pagination={{
            total: mockFavorites.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  )
}
