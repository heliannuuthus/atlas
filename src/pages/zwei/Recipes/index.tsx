import { useState } from 'react'
import { Card, Table, Button, Space, Tag, Input, Select } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.scss'

const { Search } = Input

interface Recipe {
  id: string
  title: string
  category: string
  cuisine: string
  difficulty: string
  cookingTime: number
  servings: number
  views: number
  favorites: number
  status: 'published' | 'draft'
  createdAt: string
}

const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: '宫保鸡丁',
    category: '川菜',
    cuisine: '中式',
    difficulty: '中等',
    cookingTime: 30,
    servings: 4,
    views: 1250,
    favorites: 89,
    status: 'published',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: '番茄鸡蛋面',
    category: '面食',
    cuisine: '中式',
    difficulty: '简单',
    cookingTime: 15,
    servings: 2,
    views: 3200,
    favorites: 256,
    status: 'published',
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    title: '红烧肉',
    category: '家常菜',
    cuisine: '中式',
    difficulty: '中等',
    cookingTime: 60,
    servings: 4,
    views: 2100,
    favorites: 178,
    status: 'published',
    createdAt: '2024-01-13',
  },
  {
    id: '4',
    title: '意式番茄意面',
    category: '西餐',
    cuisine: '意式',
    difficulty: '简单',
    cookingTime: 20,
    servings: 2,
    views: 890,
    favorites: 45,
    status: 'draft',
    createdAt: '2024-01-12',
  },
  {
    id: '5',
    title: '日式寿司',
    category: '日料',
    cuisine: '日式',
    difficulty: '困难',
    cookingTime: 45,
    servings: 6,
    views: 1560,
    favorites: 112,
    status: 'published',
    createdAt: '2024-01-11',
  },
]

export function Recipes() {
  const _navigate = useNavigate()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const columns: ColumnsType<Recipe> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '菜谱名称',
      dataIndex: 'title',
      key: 'title',
      width: 150,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
    },
    {
      title: '菜系',
      dataIndex: 'cuisine',
      key: 'cuisine',
      width: 100,
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: 100,
      render: (difficulty: string) => {
        const colorMap: Record<string, string> = {
          简单: 'green',
          中等: 'orange',
          困难: 'red',
        }
        return <Tag color={colorMap[difficulty]}>{difficulty}</Tag>
      },
    },
    {
      title: '烹饪时间',
      dataIndex: 'cookingTime',
      key: 'cookingTime',
      width: 100,
      render: (time: number) => `${time} 分钟`,
    },
    {
      title: '份量',
      dataIndex: 'servings',
      key: 'servings',
      width: 80,
      render: (servings: number) => `${servings} 人份`,
    },
    {
      title: '浏览量',
      dataIndex: 'views',
      key: 'views',
      width: 100,
      sorter: (a, b) => a.views - b.views,
    },
    {
      title: '收藏数',
      dataIndex: 'favorites',
      key: 'favorites',
      width: 100,
      sorter: (a, b) => a.favorites - b.favorites,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'published' ? 'green' : 'default'}>
          {status === 'published' ? '已发布' : '草稿'}
        </Tag>
      ),
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
      fixed: 'right',
      render: (_, _record) => (
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
          <h2>菜谱管理</h2>
          <Space>
            <Search placeholder="搜索菜谱名称" style={{ width: 250 }} allowClear />
            <Select placeholder="选择分类" style={{ width: 120 }} allowClear>
              <Select.Option value="川菜">川菜</Select.Option>
              <Select.Option value="面食">面食</Select.Option>
              <Select.Option value="家常菜">家常菜</Select.Option>
              <Select.Option value="西餐">西餐</Select.Option>
              <Select.Option value="日料">日料</Select.Option>
            </Select>
            <Select placeholder="选择状态" style={{ width: 120 }} allowClear>
              <Select.Option value="published">已发布</Select.Option>
              <Select.Option value="draft">草稿</Select.Option>
            </Select>
            <Button type="primary" icon={<PlusOutlined />}>
              新建菜谱
            </Button>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={mockRecipes}
          rowKey="id"
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          scroll={{ x: 1200 }}
          pagination={{
            total: mockRecipes.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: total => `共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  )
}
