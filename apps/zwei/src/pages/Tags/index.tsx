import { useState } from 'react'
import { Card, Tabs, Table, Button, Space, Input } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import styles from './index.module.scss'

const { Search } = Input

interface TagItem {
  id: string
  name: string
  type: string
  usageCount: number
  createdAt: string
}

const mockTags: Record<string, TagItem[]> = {
  cuisine: [
    { id: '1', name: '川菜', type: 'cuisine', usageCount: 156, createdAt: '2024-01-10' },
    { id: '2', name: '粤菜', type: 'cuisine', usageCount: 98, createdAt: '2024-01-10' },
    { id: '3', name: '湘菜', type: 'cuisine', usageCount: 87, createdAt: '2024-01-10' },
    { id: '4', name: '鲁菜', type: 'cuisine', usageCount: 65, createdAt: '2024-01-10' },
    { id: '5', name: '苏菜', type: 'cuisine', usageCount: 54, createdAt: '2024-01-10' },
  ],
  flavor: [
    { id: '1', name: '麻辣', type: 'flavor', usageCount: 234, createdAt: '2024-01-10' },
    { id: '2', name: '酸甜', type: 'flavor', usageCount: 189, createdAt: '2024-01-10' },
    { id: '3', name: '清淡', type: 'flavor', usageCount: 167, createdAt: '2024-01-10' },
    { id: '4', name: '香辣', type: 'flavor', usageCount: 145, createdAt: '2024-01-10' },
    { id: '5', name: '咸鲜', type: 'flavor', usageCount: 132, createdAt: '2024-01-10' },
  ],
  scene: [
    { id: '1', name: '早餐', type: 'scene', usageCount: 312, createdAt: '2024-01-10' },
    { id: '2', name: '午餐', type: 'scene', usageCount: 298, createdAt: '2024-01-10' },
    { id: '3', name: '晚餐', type: 'scene', usageCount: 287, createdAt: '2024-01-10' },
    { id: '4', name: '夜宵', type: 'scene', usageCount: 156, createdAt: '2024-01-10' },
    { id: '5', name: '下午茶', type: 'scene', usageCount: 98, createdAt: '2024-01-10' },
  ],
  taboo: [
    { id: '1', name: '素食', type: 'taboo', usageCount: 0, createdAt: '2024-01-10' },
    { id: '2', name: '无麸质', type: 'taboo', usageCount: 0, createdAt: '2024-01-10' },
    { id: '3', name: '无乳制品', type: 'taboo', usageCount: 0, createdAt: '2024-01-10' },
    { id: '4', name: '无坚果', type: 'taboo', usageCount: 0, createdAt: '2024-01-10' },
    { id: '5', name: '低糖', type: 'taboo', usageCount: 0, createdAt: '2024-01-10' },
  ],
}

export function Tags() {
  const [activeTab, setActiveTab] = useState('cuisine')

  const getColumns = (_type: string): ColumnsType<TagItem> => [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '标签名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '使用次数',
      dataIndex: 'usageCount',
      key: 'usageCount',
      width: 120,
      sorter: (a, b) => a.usageCount - b.usageCount,
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

  const tabItems = [
    {
      key: 'cuisine',
      label: '菜系标签',
      children: (
        <div>
          <div className={styles.toolbar}>
            <Search placeholder="搜索标签" style={{ width: 300 }} allowClear />
            <Button type="primary" icon={<PlusOutlined />}>
              新建标签
            </Button>
          </div>
          <Table
            columns={getColumns('cuisine')}
            dataSource={mockTags.cuisine}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>
      ),
    },
    {
      key: 'flavor',
      label: '口味标签',
      children: (
        <div>
          <div className={styles.toolbar}>
            <Search placeholder="搜索标签" style={{ width: 300 }} allowClear />
            <Button type="primary" icon={<PlusOutlined />}>
              新建标签
            </Button>
          </div>
          <Table
            columns={getColumns('flavor')}
            dataSource={mockTags.flavor}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>
      ),
    },
    {
      key: 'scene',
      label: '场景标签',
      children: (
        <div>
          <div className={styles.toolbar}>
            <Search placeholder="搜索标签" style={{ width: 300 }} allowClear />
            <Button type="primary" icon={<PlusOutlined />}>
              新建标签
            </Button>
          </div>
          <Table
            columns={getColumns('scene')}
            dataSource={mockTags.scene}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>
      ),
    },
    {
      key: 'taboo',
      label: '禁忌选项',
      children: (
        <div>
          <div className={styles.toolbar}>
            <Search placeholder="搜索选项" style={{ width: 300 }} allowClear />
            <Button type="primary" icon={<PlusOutlined />}>
              新建选项
            </Button>
          </div>
          <Table
            columns={getColumns('taboo')}
            dataSource={mockTags.taboo}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </div>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      <Card>
        <h2>标签管理</h2>
        <Tabs activeKey={activeTab} items={tabItems} onChange={setActiveTab} />
      </Card>
    </div>
  )
}
