import { Card, Row, Col, Statistic, Typography, Space } from 'antd'
import {
  MailOutlined,
  FileTextOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { useNavigate } from 'react-router-dom'
import { chaosTemplateApi, type EmailTemplate } from '@/services'
import styles from './index.module.scss'

const { Title, Paragraph } = Typography

export function Dashboard() {
  const navigate = useNavigate()

  const { data: templates } = useRequest(() => chaosTemplateApi.getList())

  const templateList = (templates as EmailTemplate[] | undefined) ?? []
  const templateCount = templateList.length
  const enabledTemplateCount = templateList.filter((t) => t.is_enabled).length

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={3}>Chaos 业务聚合</Title>
        <Paragraph type="secondary">
          邮件发送、文件上传等业务聚合服务
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            className={styles.statCard}
            onClick={() => navigate('/templates')}
          >
            <Statistic
              title="邮件模板"
              value={templateCount}
              prefix={<FileTextOutlined />}
              suffix="个"
            />
            <div className={styles.subStat}>
              启用 {enabledTemplateCount} 个
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            className={styles.statCard}
            onClick={() => navigate('/files')}
          >
            <Statistic
              title="文件上传"
              value="上传"
              prefix={<CloudUploadOutlined />}
              valueStyle={{ fontSize: 20 }}
            />
            <div className={styles.subStat}>
              点击上传文件
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="邮件服务"
              value="运行中"
              prefix={<MailOutlined />}
              valueStyle={{ color: '#52c41a', fontSize: 20 }}
            />
            <div className={styles.subStat}>
              SMTP 连接正常
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="文件存储"
              value="Cloudflare R2"
              prefix={<CloudUploadOutlined />}
              valueStyle={{ fontSize: 16 }}
            />
            <div className={styles.subStat}>
              对象存储服务
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="快速操作" className={styles.actionCard}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Card.Grid
                style={{ width: '50%', textAlign: 'center', cursor: 'pointer' }}
                onClick={() => navigate('/templates/create')}
              >
                <FileTextOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                <div>创建邮件模板</div>
              </Card.Grid>
              <Card.Grid
                style={{ width: '50%', textAlign: 'center', cursor: 'pointer' }}
                onClick={() => navigate('/files')}
              >
                <CloudUploadOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                <div>上传文件</div>
              </Card.Grid>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="说明" className={styles.recentCard}>
            <Paragraph>
              <strong>文件上传</strong>：文件直接上传到 Cloudflare R2，暂不落库。
            </Paragraph>
            <Paragraph>
              <strong>邮件模板</strong>：支持 Go template 语法，可配置变量。
            </Paragraph>
            <Paragraph type="secondary">
              后续将通过 Cloudflare Worker 实现文件访问控制。
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
