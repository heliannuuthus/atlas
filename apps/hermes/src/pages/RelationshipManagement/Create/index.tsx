import { useRequest } from 'ahooks'
import { Form, Input, Select, Card, message, DatePicker } from 'antd'
import { useParams } from 'react-router-dom'
import { useAppNavigate, useDomainId } from '@/contexts/DomainContext'
import { relationshipApi, serviceApi } from '@/services'
import { PageHeader, FormActions } from '@atlas/shared'
import dayjs from 'dayjs'
import styles from './index.module.scss'

export function Create() {
  const { serviceId: urlServiceId } = useParams<{ serviceId: string }>()
  const navigate = useAppNavigate()
  const domainId = useDomainId()
  const [form] = Form.useForm()
  const { data: services } = useRequest(
    () => serviceApi.getList(domainId!),
    { ready: !!domainId && !urlServiceId }
  )

  const { run: handleSubmit, loading } = useRequest(
    async (values: Record<string, unknown>) => {
      const serviceId = urlServiceId || (values.service_id as string)
      await relationshipApi.create({
        service_id: serviceId,
        subject_type: values.subject_type as 'user' | 'group' | 'application',
        subject_id: values.subject_id as string,
        relation: values.relation as string,
        object_type: values.object_type as string,
        object_id: values.object_id as string,
        expires_at: values.expires_at ? (values.expires_at as dayjs.Dayjs).toISOString() : undefined,
      })
      message.success('创建成功')
      navigate(urlServiceId ? `/services/${urlServiceId}` : '/relationships')
    },
    { manual: true, onError: () => message.error('创建失败') }
  )

  return (
    <div className={styles.container}>
      <PageHeader
        title="新建关系"
        onBack={() => navigate(urlServiceId ? `/services/${urlServiceId}` : '/relationships')}
      />
      <Card variant="borderless">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className={styles.form}
          initialValues={{ service_id: urlServiceId }}
        >
          {!urlServiceId && (
            <Form.Item name="service_id" label="服务" rules={[{ required: true, message: '请选择服务' }]}>
              <Select placeholder="请选择服务">
                {(services?.items ?? []).map((s) => <Select.Option key={s.service_id} value={s.service_id}>{s.name}</Select.Option>)}
              </Select>
            </Form.Item>
          )}
          <Form.Item name="subject_type" label="主体类型" rules={[{ required: true, message: '请选择主体类型' }]}>
            <Select placeholder="请选择主体类型">
              <Select.Option value="user">用户</Select.Option>
              <Select.Option value="group">组</Select.Option>
              <Select.Option value="application">应用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="subject_id" label="主体ID" rules={[{ required: true, message: '请输入主体ID' }]}>
            <Input placeholder="请输入主体ID" />
          </Form.Item>
          <Form.Item name="relation" label="关系" rules={[{ required: true, message: '请输入关系' }]}>
            <Input placeholder="请输入关系，如：owner, editor, viewer" />
          </Form.Item>
          <Form.Item name="object_type" label="对象类型" rules={[{ required: true, message: '请选择对象类型' }]}>
            <Select placeholder="请选择对象类型">
              <Select.Option value="resource">资源</Select.Option>
              <Select.Option value="group">组</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="object_id" label="对象ID" rules={[{ required: true, message: '请输入对象ID' }]}>
            <Input placeholder="请输入对象ID" />
          </Form.Item>
          <Form.Item name="expires_at" label="过期时间">
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <FormActions
              loading={loading}
              submitText="创建"
              cancelPath={urlServiceId ? `/services/${urlServiceId}` : '/relationships'}
            />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
