import { useNavigate } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Card, Typography, Row, Col, Spin, Empty } from 'antd'
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
        ) : !domains?.length ? (
          <Empty description="暂无域，请联系管理员创建域" />
        ) : (
          <Row gutter={[16, 16]}>
            {domains.map((d) => (
              <Col key={d.domain_id} xs={24} sm={12} md={8}>
                <Card
                  hoverable
                  className={styles.domainCard}
                  onClick={() => navigate(`/d/${encodeURIComponent(d.domain_id)}`)}
                >
                  <div className={styles.cardBody}>
                    <div className={styles.cardName}>{d.name || d.domain_id}</div>
                    <Text type="secondary" className={styles.cardId}>
                      {d.domain_id}
                    </Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </main>
    </div>
  )
}
