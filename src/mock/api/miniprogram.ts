import { delay } from '@/utils/delay'
import { mockMiniprogramList } from '../data/miniprogram'
import type {
  Miniprogram,
  MiniprogramListParams,
  MiniprogramListResponse,
} from '@/types/miniprogram'
import { MiniprogramStatus } from '@/types/miniprogram'

/**
 * 模拟 API 延迟
 */
const API_DELAY = 500

/**
 * 获取小程序列表
 */
export async function getMiniprogramList(
  params: MiniprogramListParams
): Promise<MiniprogramListResponse> {
  await delay(API_DELAY)

  let list = [...mockMiniprogramList]

  // 关键词搜索
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase()
    list = list.filter(
      (item) =>
        item.name.toLowerCase().includes(keyword) ||
        item.appId.toLowerCase().includes(keyword) ||
        item.description?.toLowerCase().includes(keyword)
    )
  }

  // 平台筛选
  if (params.platform) {
    list = list.filter((item) => item.platform === params.platform)
  }

  // 状态筛选
  if (params.status) {
    list = list.filter((item) => item.status === params.status)
  }

  // 分页
  const total = list.length
  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize
  const paginatedList = list.slice(start, end)

  return {
    list: paginatedList,
    total,
    page: params.page,
    pageSize: params.pageSize,
  }
}

/**
 * 获取小程序详情
 */
export async function getMiniprogramDetail(id: string): Promise<Miniprogram> {
  await delay(API_DELAY)

  const item = mockMiniprogramList.find((item) => item.id === id)
  if (!item) {
    throw new Error(`小程序不存在: ${id}`)
  }

  return { ...item }
}

/**
 * 创建小程序
 */
export async function createMiniprogram(
  data: Partial<Miniprogram>
): Promise<Miniprogram> {
  await delay(API_DELAY)

  const newItem: Miniprogram = {
    id: String(mockMiniprogramList.length + 1),
    name: data.name || '未命名小程序',
    appId: data.appId || '',
    platform: data.platform!,
    status: data.status || MiniprogramStatus.DRAFT,
    version: data.version || '1.0.0',
    description: data.description,
    logo: data.logo,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    owner: data.owner,
    tags: data.tags,
  }

  mockMiniprogramList.push(newItem)
  return { ...newItem }
}

/**
 * 更新小程序
 */
export async function updateMiniprogram(
  id: string,
  data: Partial<Miniprogram>
): Promise<Miniprogram> {
  await delay(API_DELAY)

  const index = mockMiniprogramList.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error(`小程序不存在: ${id}`)
  }

  const updatedItem: Miniprogram = {
    ...mockMiniprogramList[index],
    ...data,
    updatedAt: new Date().toISOString(),
  }

  mockMiniprogramList[index] = updatedItem
  return { ...updatedItem }
}

/**
 * 删除小程序
 */
export async function deleteMiniprogram(id: string): Promise<void> {
  await delay(API_DELAY)

  const index = mockMiniprogramList.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error(`小程序不存在: ${id}`)
  }

  mockMiniprogramList.splice(index, 1)
}

/**
 * 发布小程序
 */
export async function publishMiniprogram(id: string): Promise<Miniprogram> {
  await delay(API_DELAY)

  const index = mockMiniprogramList.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error(`小程序不存在: ${id}`)
  }

  const updatedItem: Miniprogram = {
    ...mockMiniprogramList[index],
    status: MiniprogramStatus.REVIEWING,
    updatedAt: new Date().toISOString(),
  }

  mockMiniprogramList[index] = updatedItem
  return { ...updatedItem }
}
