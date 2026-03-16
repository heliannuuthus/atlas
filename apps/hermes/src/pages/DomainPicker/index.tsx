import { useNavigate } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Card, Typography, Row, Col, Spin, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { domainApi } from '@/services'
import styles from './index.module.scss'

const { Title, Text } = Typography

export function DomainPicker() {
  const navigate = useNavigate()
  const { data: domains, loading: domainsLoading } = useRequest(() => domainApi.getList())

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <Title level={4} className={styles.title}>
          选择域
        </Title>
        <Text type="secondary" className={styles.desc}>
          域是身份与权限的隔离边界，每个域下有独立的服务、应用和关系。选择下方任意域进入该域的控制台，即可查看与配置该域内的资源与访问关系。
        </Text>
      </header>

      <main className={styles.main}>
        {domainsLoading ? (
          <div className={styles.loading}>
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[20, 20]}>
            {domains?.map(d => (
              <Col key={d.domain_id} xs={24} sm={12} md={8}>
                <Card
                  hoverable
                  className={styles.domainCard}
                  onClick={() => navigate(`/d/${encodeURIComponent(d.domain_id)}`)}
                >
                  <div className={styles.cardBody}>
                    <div className={styles.cardName}>{d.name || d.domain_id}</div>
                    {d.description && <div className={styles.cardDesc}>{d.description}</div>}
                    <Text type="secondary" className={styles.cardId}>
                      {d.domain_id}
                    </Text>
                  </div>
                </Card>
              </Col>
            ))}
            <Col xs={24} sm={12} md={8}>
              <Card
                hoverable
                className={styles.domainCardAdd}
                onClick={() => message.info('请联系管理员创建域')}
              >
                <div className={styles.cardAddBody}>
                  <PlusOutlined className={styles.cardAddIcon} />
                  <span className={styles.cardAddText}>添加域</span>
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </main>
    </div>
  )
}
