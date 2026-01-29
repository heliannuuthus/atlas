// 各服务的 API 基础路径配置
export const apiEndpoints = {
  hermes: import.meta.env.VITE_API_HERMES_URL || 'https://hermes.heliannuuthus.com/api',
  zwei: import.meta.env.VITE_API_ZWEI_URL || 'https://zwei.heliannuuthus.com/api',
  auth: import.meta.env.VITE_API_AUTH_URL || 'https://auth.heliannuuthus.com/api',
} as const

export type ServiceName = keyof typeof apiEndpoints

/**
 * 根据路径前缀获取对应的服务基础 URL
 * @param path 请求路径，如 /hermes/users, /zwei/orders, /auth/login
 * @returns 完整的 URL
 */
export function getServiceUrl(path: string): { baseUrl: string; servicePath: string } {
  // 移除开头的斜杠以便解析
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  const segments = normalizedPath.split('/')
  const service = segments[0] as ServiceName

  if (service in apiEndpoints) {
    // 移除服务前缀，保留剩余路径
    const servicePath = '/' + segments.slice(1).join('/')
    return {
      baseUrl: apiEndpoints[service],
      servicePath,
    }
  }

  // 默认使用 hermes 服务
  return {
    baseUrl: apiEndpoints.hermes,
    servicePath: path,
  }
}

export const env = {
  // 保留旧的 apiBaseUrl 以兼容现有代码，默认指向 hermes
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || apiEndpoints.hermes,
  apiEndpoints,
  appTitle: import.meta.env.VITE_APP_TITLE || 'Atlas 中台管理平台',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
