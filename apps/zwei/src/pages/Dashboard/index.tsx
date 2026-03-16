import { Card, Row, Col, Statistic, Typography } from 'antd'
import {
  BookOutlined,
  HeartOutlined,
  HistoryOutlined,
  TagsOutlined,
  FireOutlined,
  StarOutlined,
} from '@ant-design/icons'
import styles from './index.module.scss'

const { Title } = Typography

export function Dashboard() {
  return (
    <div className={styles.container}>
      <Title level={2}>Zwei 业务概览</Title>

      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="菜谱总数"
              value={0}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#171717' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="收藏总数"
              value={0}
              prefix={<HeartOutlined />}
              valueStyle={{ color: '#dc2626' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="浏览历史"
              value={0}
              prefix={<HistoryOutlined />}
              valueStyle={{ color: '#4d7c0f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="标签数量"
              value={0}
              prefix={<TagsOutlined />}
              valueStyle={{ color: '#ea580c' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className={styles.cardsRow}>
        <Col xs={24}>
          <Card title="业务模块" className={styles.moduleCard}>
            <div className={styles.moduleList}>
              <div className={styles.moduleItem}>
                <BookOutlined className={styles.moduleIcon} />
                <div className={styles.moduleInfo}>
                  <div className={styles.moduleName}>菜谱管理</div>
                  <div className={styles.moduleDesc}>菜谱的创建、编辑、分类管理</div>
                </div>
              </div>
              <div className={styles.moduleItem}>
                <HeartOutlined className={styles.moduleIcon} />
                <div className={styles.moduleInfo}>
                  <div className={styles.moduleName}>收藏管理</div>
                  <div className={styles.moduleDesc}>用户收藏的菜谱管理</div>
                </div>
              </div>
              <div className={styles.moduleItem}>
                <HistoryOutlined className={styles.moduleIcon} />
                <div className={styles.moduleInfo}>
                  <div className={styles.moduleName}>浏览历史</div>
                  <div className={styles.moduleDesc}>用户浏览记录管理</div>
                </div>
              </div>
              <div className={styles.moduleItem}>
                <TagsOutlined className={styles.moduleIcon} />
                <div className={styles.moduleInfo}>
                  <div className={styles.moduleName}>标签管理</div>
                  <div className={styles.moduleDesc}>菜谱标签和用户偏好标签</div>
                </div>
              </div>
              <div className={styles.moduleItem}>
                <FireOutlined className={styles.moduleIcon} />
                <div className={styles.moduleInfo}>
                  <div className={styles.moduleName}>推荐系统</div>
                  <div className={styles.moduleDesc}>基于 AI 的个性化菜谱推荐</div>
                </div>
              </div>
              <div className={styles.moduleItem}>
                <StarOutlined className={styles.moduleIcon} />
                <div className={styles.moduleInfo}>
                  <div className={styles.moduleName}>首页内容</div>
                  <div className={styles.moduleDesc}>轮播图、热门推荐、推荐菜谱</div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
