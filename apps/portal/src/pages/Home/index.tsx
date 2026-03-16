import { Typography } from 'antd'
import {
  ApartmentOutlined,
  CloudServerOutlined,
  AppstoreAddOutlined,
  TeamOutlined,
  ShareAltOutlined,
  MailOutlined,
  FileTextOutlined,
  CloudUploadOutlined,
  BookOutlined,
  HeartOutlined,
  FireOutlined,
  TagsOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons'
import styles from './index.module.scss'

const { Title, Paragraph } = Typography

const services = [
  {
    key: 'hermes',
    name: 'Hermes',
    description: '身份与访问管理',
    color: '#059669',
    origin: 'https://hermes.heliannuuthus.com',
    icon: (
      <svg viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#059669" />
        <path d="M8 12h16M8 16h16M8 20h10" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    modules: [
      { icon: <ApartmentOutlined />, title: '域管理', path: '/domains' },
      { icon: <CloudServerOutlined />, title: '服务管理', path: '/services' },
      { icon: <AppstoreAddOutlined />, title: '应用管理', path: '/applications' },
      { icon: <ShareAltOutlined />, title: '关系管理', path: '/relationships' },
      { icon: <TeamOutlined />, title: '组管理', path: '/groups' },
    ],
  },
  {
    key: 'chaos',
    name: 'Chaos',
    description: '消息与文件服务',
    color: '#d97706',
    origin: 'https://chaos.heliannuuthus.com',
    icon: (
      <svg viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#d97706" />
        <path d="M10 10l12 12M22 10l-12 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    modules: [
      { icon: <FileTextOutlined />, title: '邮件模板', path: '/templates' },
      { icon: <MailOutlined />, title: '邮件发送', path: '/templates' },
      { icon: <CloudUploadOutlined />, title: '文件管理', path: '/files' },
    ],
  },
  {
    key: 'zwei',
    name: 'Zwei',
    description: '菜谱业务平台',
    color: '#ea580c',
    origin: 'https://zwei.heliannuuthus.com',
    icon: (
      <svg viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#ea580c" />
        <circle cx="16" cy="13" r="5" stroke="#fff" strokeWidth="2" fill="none" />
        <path
          d="M9 24c0-3.87 3.13-7 7-7s7 3.13 7 7"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    modules: [
      { icon: <BookOutlined />, title: '菜谱管理', path: '/recipes' },
      { icon: <HeartOutlined />, title: '收藏管理', path: '/favorites' },
      { icon: <FireOutlined />, title: '推荐系统', path: '/recommend' },
      { icon: <TagsOutlined />, title: '标签管理', path: '/tags' },
    ],
  },
]

export function Home() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroLogo}>
            <svg viewBox="0 0 48 48" fill="none">
              <rect x="4" y="4" width="17" height="17" rx="5" fill="#18181b" opacity="0.9" />
              <rect x="27" y="4" width="17" height="17" rx="5" fill="#18181b" opacity="0.4" />
              <rect x="4" y="27" width="17" height="17" rx="5" fill="#18181b" opacity="0.4" />
              <rect x="27" y="27" width="17" height="17" rx="5" fill="#18181b" opacity="0.15" />
            </svg>
          </div>
          <Title level={2} className={styles.heroTitle}>
            Atlas
          </Title>
          <Paragraph className={styles.heroDesc}>统一管控平台</Paragraph>
        </div>
      </section>

      <section className={styles.grid}>
        {services.map(svc => (
          <div key={svc.key} className={styles.card}>
            <div className={styles.cardHeader}>
              <a
                href={svc.origin}
                className={styles.cardLogoLink}
                onClick={e => {
                  e.preventDefault()
                  window.location.href = svc.origin
                }}
              >
                <div className={styles.cardLogo}>{svc.icon}</div>
                <div className={styles.cardInfo}>
                  <span className={styles.cardName}>{svc.name}</span>
                  <span className={styles.cardDesc}>{svc.description}</span>
                </div>
                <ArrowRightOutlined className={styles.cardArrow} />
              </a>
            </div>

            <div className={styles.modules}>
              {svc.modules.map(mod => (
                <a
                  key={mod.path}
                  href={`${svc.origin}${mod.path}`}
                  className={styles.module}
                  onClick={e => {
                    e.preventDefault()
                    window.location.href = `${svc.origin}${mod.path}`
                  }}
                >
                  <span className={styles.moduleIcon} style={{ color: svc.color }}>
                    {mod.icon}
                  </span>
                  <span className={styles.moduleTitle}>{mod.title}</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
