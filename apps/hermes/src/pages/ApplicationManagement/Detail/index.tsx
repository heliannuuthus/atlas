import { useState, useEffect } from 'react'
import { useRequest } from 'ahooks'
import {
  Card,
  Spin,
  message,
  Tabs,
  Table,
  Empty,
  Typography,
  Tag,
  Tooltip,
  Button,
  Form,
  Input,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useParams } from 'react-router-dom'
import { useAppNavigate, useDomainId } from '@/contexts/DomainContext'
import {
  InfoCircleOutlined,
  CloudServerOutlined,
  LinkOutlined,
  ArrowLeftOutlined,
  SaveOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { applicationApi } from '@/services'
import type { ApplicationServiceRelation } from '@/types'
import { formatDateTime } from '@atlas/shared'
import styles from './index.module.scss'

const { Text, Link } = Typography
const { TextArea } = Input

export function Detail() {
  const { appId } = useParams<{ appId: string }>()
  const domainId = useDomainId()
  const navigate = useAppNavigate()
  const [activeTab, setActiveTab] = useState('info')
  const [appInfoForm] = Form.useForm()
  const [callbackForm] = Form.useForm()

  const { data, loading, refresh } = useRequest(
    () => applicationApi.getDetail(domainId!, appId!),
    { ready: !!domainId && !!appId, onError: () => message.error('获取应用信息失败') }
  )

  // 仅切换到「服务授予的权限」时再请求，不预读
  const { data: serviceRelations, loading: svcRelLoading } = useRequest(
    () => applicationApi.getServiceRelations(domainId!, appId!),
    { ready: !!domainId && !!appId && activeTab === 'services' }
  )

  const serviceRelationColumns: ColumnsType<ApplicationServiceRelation> = [
    {
      title: '服务',
      dataIndex: 'service_id',
      key: 'service_id',
      width: 180,
      render: (value) => (
        <Link onClick={() => navigate(`/services/${value}`)}>{value}</Link>
      ),
    },
    {
      title: '授予的权限',
      dataIndex: 'relations',
      key: 'relations',
      render: (relations: string[]) =>
        (relations || []).map((r) => (
          <Tag key={r} color="processing" bordered={false}>
            {r}
          </Tag>
        )),
    },
  ]

  const { run: runUpdateAppInfo, loading: savingAppInfo } = useRequest(
    async (values: { name: string; description?: string }) => {
      await applicationApi.update(domainId!, appId!, { name: values.name, description: values.description || undefined })
      refresh()
    },
    { manual: true, onError: () => message.error('保存失败') }
  )

  const { run: runUpdateCallback, loading: savingCallback } = useRequest(
    async (values: { redirect_uris?: string }) => {
      const uris = values.redirect_uris ? values.redirect_uris.split('\n').filter(Boolean) : []
      await applicationApi.update(domainId!, appId!, { redirect_uris: uris })
      refresh()
    },
    { manual: true, onError: () => message.error('保存失败') }
  )

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    )
  }

  if (!data) return null

  let redirectUris: string[] = []
  try {
    redirectUris = Array.isArray(data.redirect_uris)
      ? data.redirect_uris
      : data.redirect_uris
        ? JSON.parse(data.redirect_uris)
        : []
  } catch {
    redirectUris = []
  }

  useEffect(() => {
    if (!data) return
    appInfoForm.setFieldsValue({ name: data.name, description: data.description ?? '' })
    let uris: string[] = []
    try {
      uris = Array.isArray(data.redirect_uris) ? data.redirect_uris : data.redirect_uris ? JSON.parse(data.redirect_uris) : []
    } catch { /* ignore */ }
    callbackForm.setFieldsValue({ redirect_uris: uris.join('\n') })
  }, [data])

  const handleSaveBasicInfo = async () => {
    try {
      const appInfoValues = await appInfoForm.validateFields()
      await runUpdateAppInfo(appInfoValues)
      const callbackValues = callbackForm.getFieldsValue()
      await runUpdateCallback(callbackValues)
      message.success('已保存')
    } catch (e) {
      if (e?.errorFields) return
    }
  }

  const tabItems = [
    {
      key: 'info',
      label: (
        <span className={styles.tabLabel}>
          <InfoCircleOutlined />
          基本信息
        </span>
      ),
      children: (
        <div className={styles.infoTab}>
          <div className={styles.infoTabHeader}>
            <span className={styles.infoTabTitle}>基本信息</span>
            <Button
              type="primary"
              size="middle"
              icon={<SaveOutlined />}
              loading={savingAppInfo || savingCallback}
              onClick={handleSaveBasicInfo}
            >
              保存
            </Button>
          </div>
          <div className={styles.infoSections}>
            <div className={styles.infoSection}>
              <div className={styles.infoSectionTitle}>
                <InfoCircleOutlined />
                应用信息
              </div>
              <div className={styles.appInfoBody}>
                <div className={styles.logoSection}>
                  <div className={styles.logoUpload}>
                    {data.logo_url ? (
                      <img src={data.logo_url} alt="" className={styles.logoImg} />
                    ) : (
                      <div className={styles.logoPlaceholder}>
                        <PlusOutlined />
                        <span>上传 Logo</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.appInfoFields}>
                  <Form form={appInfoForm} layout="vertical" className={styles.inlineForm}>
                    <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
                      <Input placeholder="请输入名称" />
                    </Form.Item>
                    <Form.Item name="description" label="描述">
                      <Input.TextArea rows={2} placeholder="选填" />
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
            <div className={styles.infoSectionDivider} />
            <div className={styles.infoSection}>
              <div className={styles.infoSectionTitle}>
                <LinkOutlined />
                回调与安全
              </div>
              <Text type="secondary" className={styles.fieldHint}>
                登录或授权后允许跳转的 URI，需与请求中的 redirect_uri 完全一致。每行一个。
              </Text>
              <Form form={callbackForm} layout="vertical" className={styles.inlineForm}>
                <Form.Item name="redirect_uris" label="重定向 URI">
                  <TextArea rows={4} placeholder="每行一个 URI" />
                </Form.Item>
              </Form>
              <Text type="secondary" className={styles.fieldHintSecondary}>
                登出回调 URI、跨域白名单等能力规划中。
              </Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'services',
      label: (
        <span className={styles.tabLabel}>
          <CloudServerOutlined />
          服务授予的权限
          {serviceRelations != null && serviceRelations.length > 0 && (
            <Tag bordered={false} className={styles.tabBadge}>{serviceRelations.length}</Tag>
          )}
        </span>
      ),
      children: (
        <div className={styles.relationshipsTab}>
          <div className={styles.tabHeader}>
            <Text type="secondary">
              各服务授予本应用的权限类型（ReBAC）。在此配置本应用可访问的服务及每种服务下授予的权限。
            </Text>
          </div>
          <Table
            columns={serviceRelationColumns}
            dataSource={serviceRelations || []}
            loading={svcRelLoading}
            rowKey="service_id"
            size="small"
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="暂无服务授予的权限，请配置可访问服务"
                />
              ),
            }}
          />
        </div>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      <Card bordered={false} className={styles.overviewCard}>
        <div className={styles.overviewHeader}>
          <Tooltip title="返回应用列表" placement="bottomLeft">
            <Button
              type="text"
              icon={<ArrowLeftOutlined className={styles.backIcon} />}
              onClick={() => navigate('/applications')}
              className={styles.backBtn}
            />
          </Tooltip>
          <div className={styles.overviewTitleRow}>
            <Typography.Title level={4} className={styles.overviewName}>
              {data.name || data.app_id}
            </Typography.Title>
          </div>
        </div>
        <div className={styles.overviewBody}>
          <div className={styles.overviewMeta}>
            <div className={styles.metaBlock}>
              <div className={styles.metaRow}>
                <dt>应用标识</dt>
                <dd>
                  <Text copyable={{ text: data.app_id, tooltips: ['复制', '已复制'] }} className={styles.metaValue}>
                    {data.app_id}
                  </Text>
                </dd>
              </div>
              <div className={styles.metaRow}>
                <dt>域标识</dt>
                <dd>
                  <Text copyable={data.domain_id ? { text: data.domain_id, tooltips: ['复制', '已复制'] } : false} className={styles.metaValue}>
                    {data.domain_id}
                  </Text>
                </dd>
              </div>
            </div>
            <div className={styles.metaBlock}>
              <div className={styles.metaRow}>
                <dt>创建时间</dt>
                <dd className={styles.metaValue}>{formatDateTime(data.created_at)}</dd>
              </div>
              <div className={styles.metaRow}>
                <dt>更新时间</dt>
                <dd className={styles.metaValue}>{formatDateTime(data.updated_at)}</dd>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <div className={styles.content}>
        <Card bordered={false} className={styles.mainCard}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            className={styles.tabs}
          />
        </Card>
      </div>
    </div>
  )
}
