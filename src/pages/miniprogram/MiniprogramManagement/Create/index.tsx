import { useRequest } from 'ahooks'
import { Form, Input, Card, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { createMiniprogram } from '@/mock/api/miniprogram'
import { MiniprogramStatus } from '@/types/miniprogram'
import { PageHeader, PlatformSelect, FormActions } from '@/components'
import styles from './index.module.scss'

const { TextArea } = Input

export function Create() {
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const { run: handleSubmit, loading } = useRequest(
    async (values: Record<string, unknown>) => {
      await createMiniprogram({
        ...values,
        status: MiniprogramStatus.DRAFT,
      })
      message.success('创建成功')
      navigate('/miniprogram')
    },
    {
      manual: true,
      onError: () => {
        message.error('创建失败')
      },
    }
  )

  return (
    <div className={styles.container}>
      <Card>
        <PageHeader title="新建小程序" backPath="/miniprogram" />

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
            initialValue="1.0.0"
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
            <FormActions loading={loading} submitText="创建" cancelPath="/miniprogram" />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
