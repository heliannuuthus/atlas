import { useNavigate } from 'react-router-dom'
import { Card, Row, Col, Typography, Button } from 'antd'
import {
  BookOutlined,
  ApartmentOutlined,
  HeartOutlined,
  HistoryOutlined,
  TagsOutlined,
  FireOutlined,
  StarOutlined,
  CloudServerOutlined,
  AppstoreAddOutlined,
  TeamOutlined,
  ShareAltOutlined,
} from '@ant-design/icons'
import styles from './index.module.scss'

const { Title, Paragraph } = Typography

const zweiModules = [
  {
    icon: <BookOutlined />,
    title: '菜谱管理',
    description: '菜谱的创建、编辑、分类管理',
    color: '#1890ff',
  },
  {
    icon: <HeartOutlined />,
    title: '收藏管理',
    description: '用户收藏的菜谱管理',
    color: '#f5222d',
  },
  {
    icon: <HistoryOutlined />,
    title: '浏览历史',
    description: '用户浏览记录管理',
    color: '#52c41a',
  },
  {
    icon: <TagsOutlined />,
    title: '标签管理',
    description: '菜谱标签和用户偏好标签',
    color: '#722ed1',
  },
  {
    icon: <FireOutlined />,
    title: '推荐系统',
    description: '基于 AI 的个性化菜谱推荐',
    color: '#fa8c16',
  },
  {
    icon: <StarOutlined />,
    title: '首页内容',
    description: '轮播图、热门推荐、推荐菜谱',
    color: '#13c2c2',
  },
]

const hermesModules = [
  {
    icon: <ApartmentOutlined />,
    title: '域管理',
    description: '管理身份域配置',
    color: '#13c2c2',
  },
  {
    icon: <CloudServerOutlined />,
    title: '服务管理',
    description: '管理服务配置和密钥',
    color: '#1890ff',
  },
  {
    icon: <AppstoreAddOutlined />,
    title: '应用管理',
    description: '管理应用配置和重定向 URI',
    color: '#722ed1',
  },
  {
    icon: <ShareAltOutlined />,
    title: '关系管理',
    description: '管理权限关系和访问控制',
    color: '#52c41a',
  },
  {
    icon: <TeamOutlined />,
    title: '组管理',
    description: '管理用户组和成员关系',
    color: '#fa8c16',
  },
]

export function Home() {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <Title level={1} className={styles.heroTitle}>
          Atlas 管理平台
        </Title>
        <Paragraph className={styles.heroDesc}>
          统一管理 Zwei 业务和 Hermes 身份认证服务
        </Paragraph>
      </div>

      <Row gutter={[24, 24]} className={styles.servicesRow}>
        <Col xs={24} lg={12}>
          <Card className={styles.serviceCard} hoverable>
            <div className={styles.serviceHeader}>
              <div className={styles.serviceIcon} style={{ backgroundColor: '#1890ff20', color: '#1890ff' }}>
                <BookOutlined />
              </div>
              <div className={styles.serviceInfo}>
                <Title level={3} className={styles.serviceTitle}>Zwei</Title>
                <Paragraph className={styles.serviceDesc}>
                  菜谱管理、收藏、推荐、标签等业务管理平台
                </Paragraph>
              </div>
            </div>
            <div className={styles.moduleGrid}>
              {zweiModules.map((module, index) => (
                <div key={index} className={styles.moduleCard}>
                  <div className={styles.moduleIcon} style={{ color: module.color }}>
                    {module.icon}
                  </div>
                  <div className={styles.moduleContent}>
                    <div className={styles.moduleTitle}>{module.title}</div>
                    <div className={styles.moduleDescription}>{module.description}</div>
                  </div>
                </div>
              ))}
            </div>
            <Button
              type="primary"
              size="large"
              block
              className={styles.enterButton}
              onClick={() => navigate('/zwei')}
            >
              进入 Zwei 管理
            </Button>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card className={styles.serviceCard} hoverable>
            <div className={styles.serviceHeader}>
              <div className={styles.serviceIcon} style={{ backgroundColor: '#13c2c220', color: '#13c2c2' }}>
                <ApartmentOutlined />
              </div>
              <div className={styles.serviceInfo}>
                <Title level={3} className={styles.serviceTitle}>Hermes</Title>
                <Paragraph className={styles.serviceDesc}>
                  身份与访问管理：域、服务、应用、关系、组
                </Paragraph>
              </div>
            </div>
            <div className={styles.moduleGrid}>
              {hermesModules.map((module, index) => (
                <div key={index} className={styles.moduleCard}>
                  <div className={styles.moduleIcon} style={{ color: module.color }}>
                    {module.icon}
                  </div>
                  <div className={styles.moduleContent}>
                    <div className={styles.moduleTitle}>{module.title}</div>
                    <div className={styles.moduleDescription}>{module.description}</div>
                  </div>
                </div>
              ))}
            </div>
            <Button
              type="primary"
              size="large"
              block
              className={styles.enterButton}
              onClick={() => navigate('/hermes/domains')}
              style={{ backgroundColor: '#13c2c2', borderColor: '#13c2c2' }}
            >
              进入 Hermes 管理
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
