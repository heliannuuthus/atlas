export const apiEndpoints = {
  hermes: import.meta.env.VITE_API_HERMES_URL || 'https://hermes.heliannuuthus.com/api',
  zwei: import.meta.env.VITE_API_ZWEI_URL || 'https://zwei.heliannuuthus.com/api',
  chaos: import.meta.env.VITE_API_CHAOS_URL || 'https://chaos.heliannuuthus.com/api',
  auth: import.meta.env.VITE_API_AUTH_URL || 'https://aegis.heliannuuthus.com/api',
} as const

export type ServiceName = keyof typeof apiEndpoints

export function getServiceUrl(path: string): { baseUrl: string; servicePath: string } {
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  const segments = normalizedPath.split('/')
  const service = segments[0] as ServiceName

  if (service in apiEndpoints) {
    const servicePath = '/' + segments.slice(1).join('/')
    return {
      baseUrl: apiEndpoints[service],
      servicePath,
    }
  }

  return {
    baseUrl: apiEndpoints.hermes,
    servicePath: path,
  }
}

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || apiEndpoints.hermes,
  apiEndpoints,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
