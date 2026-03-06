import { useRequest } from 'ahooks'
import { Row, Col, Typography } from 'antd'
import {
  ApartmentOutlined,
  CloudServerOutlined,
  AppstoreAddOutlined,
  TeamOutlined,
  ShareAltOutlined,
} from '@ant-design/icons'
import * as hermesApi from '@/services/hermes'
import { StatCard } from './components/StatCard'
import { QuickActions } from './components/QuickActions'
import { RecentActivity } from './components/RecentActivity'
import { RelationGraphPreview } from './components/RelationGraphPreview'
import styles from './index.module.scss'

const { Title } = Typography

export function Dashboard() {
  // 获取各模块数据
  const { data: domains, loading: domainsLoading } = useRequest(() => hermesApi.listDomains())

  const { data: services, loading: servicesLoading } = useRequest(() => hermesApi.listServices())

  const { data: applications, loading: applicationsLoading } = useRequest(() =>
    hermesApi.listApplications()
  )

  const { data: groups, loading: groupsLoading } = useRequest(() => hermesApi.listGroups())

  const { data: relationships, loading: relationshipsLoading } = useRequest(() =>
    hermesApi.listRelationships()
  )

  const loading =
    domainsLoading ||
    servicesLoading ||
    applicationsLoading ||
    groupsLoading ||
    relationshipsLoading

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title level={4} className={styles.title}>
          Hermes 概览
        </Title>
        <div className={styles.subtitle}>身份与访问管理</div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className={styles.statsRow}>
        <Col xs={24} sm={12} md={8} lg={4} xl={4}>
          <StatCard
            icon={<ApartmentOutlined />}
            title="域"
            count={domains?.length ?? 0}
            color="#059669"
            path="/hermes/domains"
            loading={domainsLoading}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={5} xl={5}>
          <StatCard
            icon={<CloudServerOutlined />}
            title="服务"
            count={services?.length ?? 0}
            color="#171717"
            path="/hermes/services"
            loading={servicesLoading}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={5} xl={5}>
          <StatCard
            icon={<AppstoreAddOutlined />}
            title="应用"
            count={applications?.length ?? 0}
            color="#059669"
            path="/hermes/applications"
            loading={applicationsLoading}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={5} xl={5}>
          <StatCard
            icon={<TeamOutlined />}
            title="组"
            count={groups?.length ?? 0}
            color="#4d7c0f"
            path="/hermes/groups"
            loading={groupsLoading}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={5} xl={5}>
          <StatCard
            icon={<ShareAltOutlined />}
            title="关系"
            count={relationships?.length ?? 0}
            color="#059669"
            path="/hermes/relationships"
            loading={relationshipsLoading}
          />
        </Col>
      </Row>

      {/* 关系图谱预览 */}
      <Row gutter={[16, 16]} className={styles.graphRow}>
        <Col span={24}>
          <RelationGraphPreview
            relationships={relationships ?? []}
            loading={relationshipsLoading}
          />
        </Col>
      </Row>

      {/* 快捷操作 + 最近动态 */}
      <Row gutter={[16, 16]} className={styles.bottomRow}>
        <Col xs={24} md={8}>
          <QuickActions />
        </Col>
        <Col xs={24} md={16}>
          <RecentActivity
            services={services ?? []}
            applications={applications ?? []}
            groups={groups ?? []}
            relationships={relationships ?? []}
            loading={loading}
          />
        </Col>
      </Row>
    </div>
  )
}
