/**
 * 小程序相关类型定义
 */

export enum MiniprogramStatus {
  DRAFT = 'draft', // 草稿
  REVIEWING = 'reviewing', // 审核中
  PUBLISHED = 'published', // 已发布
  OFFLINE = 'offline', // 已下线
  REJECTED = 'rejected', // 审核拒绝
}

export enum MiniprogramPlatform {
  WECHAT = 'wechat', // 微信小程序
  ALIPAY = 'alipay', // 支付宝小程序
  BYTEDANCE = 'bytedance', // 字节跳动小程序
}

export interface Miniprogram {
  id: string
  name: string
  appId: string
  appSecret?: string
  platform: MiniprogramPlatform
  status: MiniprogramStatus
  version: string
  description?: string
  logo?: string
  qrCode?: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  owner?: string
  tags?: string[]
}

export interface MiniprogramListParams {
  page: number
  pageSize: number
  platform?: MiniprogramPlatform
  status?: MiniprogramStatus
  keyword?: string
}

export interface MiniprogramListResponse {
  list: Miniprogram[]
  total: number
  page: number
  pageSize: number
}
