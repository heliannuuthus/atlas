import { useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Form, Input, Card, message, Spin } from 'antd'
import { getMiniprogramDetail, updateMiniprogram } from '@/mock/api/miniprogram'
import { PageHeader, PlatformSelect, FormActions } from '@/components'
import styles from './index.module.scss'

const { TextArea } = Input

export function Edit() {
  const { id } = useParams<{ id: string }>()
  const [form] = Form.useForm()

  const { loading } = useRequest(
    async () => {
      if (!id) throw new Error('ID is required')
      return await getMiniprogramDetail(id)
    },
    {
      ready: !!id,
      onSuccess: data => {
        form.setFieldsValue(data)
      },
    }
  )

  const { run: handleSubmit, loading: submitting } = useRequest(
    async (values: Record<string, unknown>) => {
      if (!id) throw new Error('ID is required')
      await updateMiniprogram(id, values)
      message.success('更新成功')
    },
    {
      manual: true,
      onSuccess: () => {
        window.location.href = `/miniprogram/${id}`
      },
      onError: () => {
        message.error('更新失败')
      },
    }
  )

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Card>
        <PageHeader title="编辑小程序" backPath={`/miniprogram/${id}`} />

        <Form form={form} layout="vertical" onFinish={handleSubmit} className={styles.form}>
          <Form.Item
            name="name"
            label="小程序名称"
            rules={[{ required: true, message: '请输入小程序名称' }]}
          >
            <Input placeholder="请输入小程序名称" />
          </Form.Item>

          <Form.Item
            name="appId"
            label="AppID"
            rules={[{ required: true, message: '请输入AppID' }]}
          >
            <Input placeholder="请输入AppID" />
          </Form.Item>

          <Form.Item
            name="platform"
            label="平台"
            rules={[{ required: true, message: '请选择平台' }]}
          >
            <PlatformSelect />
          </Form.Item>

          <Form.Item
            name="version"
            label="版本号"
            rules={[{ required: true, message: '请输入版本号' }]}
          >
            <Input placeholder="请输入版本号，如：1.0.0" />
          </Form.Item>

          <Form.Item name="description" label="描述">
            <TextArea rows={4} placeholder="请输入小程序描述" showCount maxLength={500} />
          </Form.Item>

          <Form.Item name="logo" label="Logo URL">
            <Input placeholder="请输入Logo URL" />
          </Form.Item>

          <Form.Item name="owner" label="负责人">
            <Input placeholder="请输入负责人" />
          </Form.Item>

          <Form.Item>
            <FormActions loading={submitting} submitText="保存" cancelPath={`/miniprogram/${id}`} />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
