import { useNavigate } from 'react-router-dom'
import { Card, Row, Col, Typography } from 'antd'
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
  MailOutlined,
  FileTextOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons'
import styles from './index.module.scss'

const { Title, Paragraph } = Typography

const zweiModules = [
  {
    icon: <BookOutlined />,
    title: '菜谱管理',
    description: '菜谱的创建、编辑、分类管理',
    color: '#1890ff',
    path: '/zwei/recipes',
  },
  {
    icon: <HeartOutlined />,
    title: '收藏管理',
    description: '用户收藏的菜谱管理',
    color: '#f5222d',
    path: '/zwei/favorites',
  },
  {
    icon: <HistoryOutlined />,
    title: '浏览历史',
    description: '用户浏览记录管理',
    color: '#52c41a',
    path: '/zwei/history',
  },
  {
    icon: <TagsOutlined />,
    title: '标签管理',
    description: '菜谱标签和用户偏好标签',
    color: '#722ed1',
    path: '/zwei/tags',
  },
  {
    icon: <FireOutlined />,
    title: '推荐系统',
    description: '基于 AI 的个性化菜谱推荐',
    color: '#fa8c16',
    path: '/zwei/recommend',
  },
  {
    icon: <StarOutlined />,
    title: '首页内容',
    description: '轮播图、热门推荐、推荐菜谱',
    color: '#13c2c2',
    path: '/zwei/home',
  },
]

const hermesModules = [
  {
    icon: <ApartmentOutlined />,
    title: '域管理',
    description: '管理身份域配置',
    color: '#13c2c2',
    path: '/hermes/domains',
  },
  {
    icon: <CloudServerOutlined />,
    title: '服务管理',
    description: '管理服务配置和密钥',
    color: '#1890ff',
    path: '/hermes/services',
  },
  {
    icon: <AppstoreAddOutlined />,
    title: '应用管理',
    description: '管理应用配置和重定向 URI',
    color: '#722ed1',
    path: '/hermes/applications',
  },
  {
    icon: <ShareAltOutlined />,
    title: '关系管理',
    description: '管理权限关系和访问控制',
    color: '#52c41a',
    path: '/hermes/relationships',
  },
  {
    icon: <TeamOutlined />,
    title: '组管理',
    description: '管理用户组和成员关系',
    color: '#fa8c16',
    path: '/hermes/groups',
  },
]

const chaosModules = [
  {
    icon: <FileTextOutlined />,
    title: '邮件模板',
    description: '管理邮件模板和内容',
    color: '#eb2f96',
    path: '/chaos/templates',
  },
  {
    icon: <CloudUploadOutlined />,
    title: '文件管理',
    description: '上传和管理文件',
    color: '#722ed1',
    path: '/chaos/files',
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
          统一管理 Zwei 业务、Hermes 身份认证和 Chaos 业务聚合服务
        </Paragraph>
      </div>

      <Row gutter={[24, 24]} className={styles.servicesRow}>
        <Col xs={24} lg={12}>
          <Card
            className={styles.serviceCard}
            hoverable
            onClick={() => navigate('/zwei')}
          >
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
                <div
                  key={index}
                  className={styles.moduleCard}
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(module.path)
                  }}
                >
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
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            className={styles.serviceCard}
            hoverable
            onClick={() => navigate('/hermes/domains')}
          >
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
                <div
                  key={index}
                  className={styles.moduleCard}
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(module.path)
                  }}
                >
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
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            className={styles.serviceCard}
            hoverable
            onClick={() => navigate('/chaos')}
          >
            <div className={styles.serviceHeader}>
              <div className={styles.serviceIcon} style={{ backgroundColor: '#eb2f9620', color: '#eb2f96' }}>
                <MailOutlined />
              </div>
              <div className={styles.serviceInfo}>
                <Title level={3} className={styles.serviceTitle}>Chaos</Title>
                <Paragraph className={styles.serviceDesc}>
                  业务聚合：邮件发送、文件上传等
                </Paragraph>
              </div>
            </div>
            <div className={styles.moduleGrid}>
              {chaosModules.map((module, index) => (
                <div
                  key={index}
                  className={styles.moduleCard}
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(module.path)
                  }}
                >
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
          </Card>
        </Col>
      </Row>
    </div>
  )
}
