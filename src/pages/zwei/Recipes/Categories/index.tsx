import { Card, Table, Button, Space, Input, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import styles from './index.module.scss'

const { Search } = Input

interface Category {
  id: string
  name: string
  description: string
  recipeCount: number
  order: number
  createdAt: string
}

const mockCategories: Category[] = [
  {
    id: '1',
    name: '川菜',
    description: '四川菜系，以麻辣著称',
    recipeCount: 156,
    order: 1,
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    name: '粤菜',
    description: '广东菜系，清淡鲜美',
    recipeCount: 98,
    order: 2,
    createdAt: '2024-01-10',
  },
  {
    id: '3',
    name: '面食',
    description: '各类面条、包子、饺子等',
    recipeCount: 87,
    order: 3,
    createdAt: '2024-01-10',
  },
  {
    id: '4',
    name: '家常菜',
    description: '日常家庭烹饪菜品',
    recipeCount: 234,
    order: 4,
    createdAt: '2024-01-10',
  },
  {
    id: '5',
    name: '西餐',
    description: '西方料理',
    recipeCount: 65,
    order: 5,
    createdAt: '2024-01-10',
  },
]

export function Categories() {
  const columns: ColumnsType<Category> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 200,
    },
    {
      title: '菜谱数量',
      dataIndex: 'recipeCount',
      key: 'recipeCount',
      width: 120,
      render: (count: number) => <Tag color="blue">{count}</Tag>,
      sorter: (a, b) => a.recipeCount - b.recipeCount,
    },
    {
      title: '排序',
      dataIndex: 'order',
      key: 'order',
      width: 80,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: () => (
        <Space size="small">
          <Button type="link" icon={<EditOutlined />} size="small">
            编辑
          </Button>
          <Button type="link" danger icon={<DeleteOutlined />} size="small">
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.header}>
          <h2>分类管理</h2>
          <Space>
            <Search placeholder="搜索分类" style={{ width: 300 }} allowClear />
            <Button type="primary" icon={<PlusOutlined />}>
              新建分类
            </Button>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={mockCategories}
          rowKey="id"
          pagination={{
            total: mockCategories.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  )
}
