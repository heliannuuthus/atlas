export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  appTitle: import.meta.env.VITE_APP_TITLE || 'Atlas 中台管理平台',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
