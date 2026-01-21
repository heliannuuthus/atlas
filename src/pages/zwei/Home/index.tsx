import { useState } from 'react'
import { Card, Tabs, Table, Button, Space, Input, Tag, Image } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import styles from './index.module.scss'

const { Search } = Input

interface Banner {
  id: string
  title: string
  image: string
  link: string
  order: number
  status: 'active' | 'inactive'
  createdAt: string
}

interface HomeRecipe {
  id: string
  recipeId: string
  recipeTitle: string
  type: 'recommend' | 'hot'
  order: number
  createdAt: string
}

const mockBanners: Banner[] = [
  {
    id: '1',
    title: '春季新品推荐',
    image: 'https://via.placeholder.com/800x300',
    link: '/recipes/1',
    order: 1,
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: '热门菜谱精选',
    image: 'https://via.placeholder.com/800x300',
    link: '/recipes/2',
    order: 2,
    status: 'active',
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    title: '健康饮食指南',
    image: 'https://via.placeholder.com/800x300',
    link: '/recipes/3',
    order: 3,
    status: 'inactive',
    createdAt: '2024-01-13',
  },
]

const mockRecommendRecipes: HomeRecipe[] = [
  { id: '1', recipeId: '1', recipeTitle: '宫保鸡丁', type: 'recommend', order: 1, createdAt: '2024-01-15' },
  { id: '2', recipeId: '2', recipeTitle: '番茄鸡蛋面', type: 'recommend', order: 2, createdAt: '2024-01-15' },
  { id: '3', recipeId: '3', recipeTitle: '红烧肉', type: 'recommend', order: 3, createdAt: '2024-01-15' },
]

const mockHotRecipes: HomeRecipe[] = [
  { id: '1', recipeId: '2', recipeTitle: '番茄鸡蛋面', type: 'hot', order: 1, createdAt: '2024-01-15' },
  { id: '2', recipeId: '1', recipeTitle: '宫保鸡丁', type: 'hot', order: 2, createdAt: '2024-01-15' },
  { id: '3', recipeId: '3', recipeTitle: '红烧肉', type: 'hot', order: 3, createdAt: '2024-01-15' },
]

export function Home() {
  const [activeTab, setActiveTab] = useState('banners')

  const bannerColumns: ColumnsType<Banner> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 150,
    },
    {
      title: '图片',
      dataIndex: 'image',
      key: 'image',
      width: 200,
      render: (image: string) => (
        <Image src={image} alt="banner" width={100} height={40} style={{ objectFit: 'cover' }} />
      ),
    },
    {
      title: '链接',
      dataIndex: 'link',
      key: 'link',
      width: 150,
    },
    {
      title: '排序',
      dataIndex: 'order',
      key: 'order',
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? '启用' : '禁用'}
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

  const recipeColumns: ColumnsType<HomeRecipe> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
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
      title: '排序',
      dataIndex: 'order',
      key: 'order',
      width: 80,
    },
    {
      title: '添加时间',
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

  const tabItems = [
    {
      key: 'banners',
      label: '轮播图',
      children: (
        <div>
          <div className={styles.toolbar}>
            <Search placeholder="搜索轮播图" style={{ width: 300 }} allowClear />
            <Button type="primary" icon={<PlusOutlined />}>
              新建轮播图
            </Button>
          </div>
          <Table columns={bannerColumns} dataSource={mockBanners} rowKey="id" pagination={{ pageSize: 10 }} />
        </div>
      ),
    },
    {
      key: 'recommend',
      label: '推荐菜谱',
      children: (
        <div>
          <div className={styles.toolbar}>
            <Search placeholder="搜索菜谱" style={{ width: 300 }} allowClear />
            <Button type="primary" icon={<PlusOutlined />}>
              添加推荐
            </Button>
          </div>
          <Table
            columns={recipeColumns}
            dataSource={mockRecommendRecipes}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>
      ),
    },
    {
      key: 'hot',
      label: '热门菜谱',
      children: (
        <div>
          <div className={styles.toolbar}>
            <Search placeholder="搜索菜谱" style={{ width: 300 }} allowClear />
            <Button type="primary" icon={<PlusOutlined />}>
              添加热门
            </Button>
          </div>
          <Table columns={recipeColumns} dataSource={mockHotRecipes} rowKey="id" pagination={{ pageSize: 10 }} />
        </div>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      <Card>
        <h2>首页内容管理</h2>
        <Tabs activeKey={activeTab} items={tabItems} onChange={setActiveTab} />
      </Card>
    </div>
  )
}
