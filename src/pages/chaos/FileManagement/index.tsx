import { useState } from 'react'
import { Card, Button, Input, message, Upload, Typography, Space, List, Tag } from 'antd'
import type { UploadProps } from 'antd'
import { CopyOutlined, CheckCircleOutlined, CloudUploadOutlined } from '@ant-design/icons'
import styles from './index.module.scss'

const { Text, Paragraph } = Typography
const { Dragger } = Upload

interface UploadResult {
  key: string
  file_name: string
  file_size: number
  content_type: string
  public_url: string
}

export function FileManagement() {
  const [customPath, setCustomPath] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<UploadResult[]>([])

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url)
    message.success('已复制到剪贴板')
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const uploadProps: UploadProps = {
    name: 'file',
    action: '/api/chaos/files',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
    },
    data: () => (customPath ? { path: customPath } : {}),
    multiple: true,
    showUploadList: true,
    onChange(info) {
      if (info.file.status === 'done') {
        const result = info.file.response as UploadResult
        message.success(`${info.file.name} 上传成功`)
        setUploadedFiles(prev => [result, ...prev])
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`)
      }
    },
  }

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.header}>
          <div className={styles.title}>文件上传</div>
        </div>

        <div className={styles.uploadSection}>
          <div className={styles.pathInput}>
            <Text type="secondary">自定义路径（可选）：</Text>
            <Input
              placeholder="例如: images/logo.png（留空则自动生成）"
              value={customPath}
              onChange={e => setCustomPath(e.target.value)}
              style={{ width: 400, marginLeft: 8 }}
            />
          </div>

          <Dragger {...uploadProps} className={styles.dragger}>
            <p className="ant-upload-drag-icon">
              <CloudUploadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">支持单个或批量上传，文件将上传到 Cloudflare R2</p>
          </Dragger>
        </div>

        {uploadedFiles.length > 0 && (
          <div className={styles.resultSection}>
            <Text strong>本次上传结果：</Text>
            <List
              size="small"
              dataSource={uploadedFiles}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button
                      type="link"
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() => handleCopy(item.public_url)}
                    >
                      复制链接
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<CheckCircleOutlined style={{ fontSize: 20, color: '#52c41a' }} />}
                    title={
                      <Space>
                        <Text>{item.file_name}</Text>
                        <Tag bordered={false}>{formatSize(item.file_size)}</Tag>
                      </Space>
                    }
                    description={
                      <Paragraph
                        copyable={{ text: item.public_url }}
                        ellipsis
                        style={{ marginBottom: 0, maxWidth: 500 }}
                      >
                        {item.public_url}
                      </Paragraph>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </Card>
    </div>
  )
}
