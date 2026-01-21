import { Card, Table, Tag, Space, Input, Button, Select } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { SearchOutlined, EyeOutlined } from '@ant-design/icons'
import styles from './index.module.scss'

const { Search } = Input

interface RecommendLog {
  id: string
  userId: string
  userName: string
  recipeId: string
  recipeTitle: string
  score: number
  reason: string
  createdAt: string
}

const mockRecommendLogs: RecommendLog[] = [
  {
    id: '1',
    userId: 'user001',
    userName: '张三',
    recipeId: '1',
    recipeTitle: '宫保鸡丁',
    score: 0.95,
    reason: '基于用户历史偏好和当前场景推荐',
    createdAt: '2024-01-20 15:30:00',
  },
  {
    id: '2',
    userId: 'user002',
    userName: '李四',
    recipeId: '2',
    recipeTitle: '番茄鸡蛋面',
    score: 0.88,
    reason: '符合用户口味偏好（清淡）',
    createdAt: '2024-01-20 14:20:00',
  },
  {
    id: '3',
    userId: 'user003',
    userName: '王五',
    recipeId: '3',
    recipeTitle: '红烧肉',
    score: 0.92,
    reason: '基于相似用户行为推荐',
    createdAt: '2024-01-20 13:15:00',
  },
  {
    id: '4',
    userId: 'user001',
    userName: '张三',
    recipeId: '5',
    recipeTitle: '日式寿司',
    score: 0.76,
    reason: '探索性推荐，扩展用户兴趣',
    createdAt: '2024-01-19 16:45:00',
  },
]

export function Recommend() {
  const columns: ColumnsType<RecommendLog> = [
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
      title: '推荐分数',
      dataIndex: 'score',
      key: 'score',
      width: 120,
      render: (score: number) => {
        const color = score >= 0.9 ? 'green' : score >= 0.8 ? 'orange' : 'default'
        return <Tag color={color}>{score.toFixed(2)}</Tag>
      },
      sorter: (a, b) => a.score - b.score,
    },
    {
      title: '推荐理由',
      dataIndex: 'reason',
      key: 'reason',
      width: 250,
    },
    {
      title: '推荐时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: () => (
        <Button type="link" icon={<EyeOutlined />} size="small">
          查看详情
        </Button>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.header}>
          <h2>推荐系统</h2>
          <Space>
            <Search placeholder="搜索用户或菜谱" style={{ width: 300 }} allowClear />
            <Select placeholder="选择分数范围" style={{ width: 150 }} allowClear>
              <Select.Option value="high">高分推荐 (≥0.9)</Select.Option>
              <Select.Option value="medium">中等推荐 (0.8-0.9)</Select.Option>
              <Select.Option value="low">低分推荐 (&lt;0.8)</Select.Option>
            </Select>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={mockRecommendLogs}
          rowKey="id"
          pagination={{
            total: mockRecommendLogs.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  )
}
