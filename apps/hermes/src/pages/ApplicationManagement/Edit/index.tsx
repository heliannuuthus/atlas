import { useRequest } from 'ahooks'
import { Form, Input, Card, message, Spin } from 'antd'
import { useParams } from 'react-router-dom'
import { useAppNavigate, useDomainId } from '@/contexts/DomainContext'
import { applicationApi } from '@/services'
import { PageHeader, FormActions } from '@atlas/shared'
import styles from './index.module.scss'

const { TextArea } = Input

export function Edit() {
  const { appId } = useParams<{ appId: string }>()
  const domainId = useDomainId()
  const navigate = useAppNavigate()
  const [form] = Form.useForm()

  const { data: _data, loading: detailLoading } = useRequest(
    () => applicationApi.getDetail(domainId!, appId!),
    {
      ready: !!domainId && !!appId,
      onSuccess: (data) => {
      let redirectUris: string[] = []
      try {
        redirectUris = data.redirect_uris ? JSON.parse(data.redirect_uris) : []
      } catch {
        redirectUris = []
      }
      form.setFieldsValue({
        name: data.name,
        redirect_uris: redirectUris.join('\n'),
      })
    },
      onError: () => message.error('获取应用信息失败'),
    }
  )

  const { run: handleSubmit, loading } = useRequest(
    async (values: Record<string, unknown>) => {
      const redirectUris = values.redirect_uris ? (values.redirect_uris as string).split('\n').filter(Boolean) : []
      await applicationApi.update(domainId!, appId!, { name: values.name as string, redirect_uris: redirectUris })
      message.success('更新成功')
      navigate(`/applications/${appId}`)
    },
    { manual: true, onError: () => message.error('更新失败') }
  )

  if (detailLoading) return <Spin size="large" />

  return (
    <div className={styles.container}>
      <PageHeader title="编辑应用" onBack={() => navigate(`/applications/${appId}`)} />
      <Card bordered={false}>
        <Form form={form} layout="vertical" onFinish={handleSubmit} className={styles.form}>
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item name="redirect_uris" label="重定向URI（每行一个）">
            <TextArea rows={4} placeholder="请输入重定向URI，每行一个" />
          </Form.Item>
          <Form.Item>
            <FormActions loading={loading} submitText="保存" cancelPath={`/applications/${appId}`} />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
