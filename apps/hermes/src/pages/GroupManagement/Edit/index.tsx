import { useRequest } from 'ahooks'
import { Form, Input, Card, message, Spin } from 'antd'
import { useParams } from 'react-router-dom'
import { useAppNavigate } from '@/contexts/DomainContext'
import { groupApi } from '@/services'
import { PageHeader, FormActions } from '@atlas/shared'
import styles from './index.module.scss'

const { TextArea } = Input

export function Edit() {
  const { groupId } = useParams<{ groupId: string }>()
  const navigate = useAppNavigate()
  const [form] = Form.useForm()

  const { data: _data, loading: detailLoading } = useRequest(() => groupApi.getDetail(groupId!), {
    ready: !!groupId,
    onSuccess: _data => {
      form.setFieldsValue({
        name: _data.name,
        description: _data.description,
      })
    },
    onError: () => message.error('获取组信息失败'),
  })

  const { run: handleSubmit, loading } = useRequest(
    async (values: Record<string, unknown>) => {
      await groupApi.update(groupId!, {
        name: values.name as string | undefined,
        description: values.description as string | undefined,
      })
      message.success('更新成功')
      navigate(`/groups/${groupId}`)
    },
    { manual: true, onError: () => message.error('更新失败') }
  )

  if (detailLoading) return <Spin size="large" />

  return (
    <div className={styles.container}>
      <PageHeader title="编辑组" onBack={() => navigate(`/groups/${groupId}`)} />
      <Card variant="borderless">
        <Form form={form} layout="vertical" onFinish={handleSubmit} className={styles.form}>
          <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <TextArea rows={4} placeholder="请输入描述" />
          </Form.Item>
          <Form.Item>
            <FormActions loading={loading} submitText="保存" cancelPath={`/groups/${groupId}`} />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
