export const servicePlatforms = [
  {
    id: 'zwei',
    name: 'Zwei',
    nameEn: 'Zwei',
    description: '菜谱管理、收藏、推荐、标签等业务管理',
    color: '#1890ff',
    enabled: true,
  },
  {
    id: 'hermes',
    name: 'Hermes',
    nameEn: 'Hermes',
    description: '身份与访问管理：域、服务、应用、关系、组',
    color: '#13c2c2',
    enabled: true,
  },
] as const

export type ServicePlatformId = typeof servicePlatforms[number]['id']
