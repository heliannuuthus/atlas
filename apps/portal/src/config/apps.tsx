import type { ReactNode } from 'react'
import {
  ApartmentOutlined,
  AppstoreAddOutlined,
  BookOutlined,
  CloudServerOutlined,
  CloudUploadOutlined,
  FileTextOutlined,
  FireOutlined,
  HeartOutlined,
  TagsOutlined,
  TeamOutlined,
} from '@ant-design/icons'

export interface AtlasCapability {
  id: string
  name: string
  path: string
  icon: ReactNode
  keywords?: string[]
}

export interface AtlasAppManifest {
  id: string
  name: string
  category: string
  mood: string
  description: string
  origin: string
  homePath: string
  color: string
  tint: string
  icon: ReactNode
  capabilities: AtlasCapability[]
}

export interface AtlasLaunchTarget {
  key: string
  appId: string
  appName: string
  name: string
  description: string
  href: string
  color: string
  tint: string
  icon: ReactNode
  keywords: string[]
}

export interface RecentLaunch {
  key: string
  visitedAt: number
}

const createAppIcon = (color: string, path: ReactNode) => (
  <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <rect width="40" height="40" rx="12" fill={color} />
    {path}
  </svg>
)

export const atlasApps: AtlasAppManifest[] = [
  {
    id: 'hermes',
    name: 'Hermes',
    category: '身份与权限',
    mood: '秩序、信任与边界',
    description: '管理身份、应用、服务与访问关系',
    origin: 'https://hermes.heliannuuthus.com',
    homePath: '/',
    color: '#b94e20',
    tint: '#fff1e8',
    icon: createAppIcon(
      '#b94e20',
      <path
        d="M12.5 11.5v17M27.5 11.5v17M12.5 20h15"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    ),
    capabilities: [
      { id: 'domains', name: '选择域', path: '/', icon: <ApartmentOutlined /> },
      {
        id: 'services',
        name: '服务管理',
        path: '/?next=services',
        icon: <CloudServerOutlined />,
      },
      {
        id: 'applications',
        name: '应用管理',
        path: '/?next=applications',
        icon: <AppstoreAddOutlined />,
      },
      { id: 'groups', name: '组管理', path: '/?next=groups', icon: <TeamOutlined /> },
    ],
  },
  {
    id: 'chaos',
    name: 'Chaos',
    category: '消息与文件',
    mood: '在混乱中建立结构',
    description: '集中处理消息模板、发送任务与文件',
    origin: 'https://chaos.heliannuuthus.com',
    homePath: '/dashboard',
    color: '#545d6b',
    tint: '#f0f2f5',
    icon: createAppIcon(
      '#545d6b',
      <>
        <path
          d="M11.5 13.5l7 6.5-7 6.5M28.5 13.5l-7 6.5 7 6.5"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="20" cy="20" r="2.5" fill="white" fillOpacity=".72" />
      </>
    ),
    capabilities: [
      { id: 'templates', name: '邮件模板', path: '/templates', icon: <FileTextOutlined /> },
      { id: 'files', name: '文件管理', path: '/files', icon: <CloudUploadOutlined /> },
    ],
  },
  {
    id: 'zwei',
    name: 'Zwei',
    category: '内容与推荐',
    mood: '温暖、鲜活、有食欲',
    description: '运营菜谱、内容标签与个性化推荐',
    origin: 'https://zwei.heliannuuthus.com',
    homePath: '/',
    color: '#b83f37',
    tint: '#fff0ee',
    icon: createAppIcon(
      '#b83f37',
      <>
        <path
          d="M12 21h16c-.8 5-3.5 7.5-8 7.5S12.8 26 12 21Z"
          stroke="white"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M16 17c-1.4-1.3-1.4-3 0-4.5M21 17c-1.4-1.3-1.4-3 0-4.5M26 17c-1.4-1.3-1.4-3 0-4.5"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </>
    ),
    capabilities: [
      { id: 'recipes', name: '菜谱管理', path: '/recipes', icon: <BookOutlined /> },
      { id: 'favorites', name: '收藏管理', path: '/favorites', icon: <HeartOutlined /> },
      { id: 'recommend', name: '推荐系统', path: '/recommend', icon: <FireOutlined /> },
      { id: 'tags', name: '标签管理', path: '/tags', icon: <TagsOutlined /> },
    ],
  },
]

export const launchTargets: AtlasLaunchTarget[] = atlasApps.flatMap(app => [
  {
    key: `${app.id}:home`,
    appId: app.id,
    appName: app.name,
    name: app.name,
    description: app.description,
    href: `${app.origin}${app.homePath}`,
    color: app.color,
    tint: app.tint,
    icon: app.icon,
    keywords: [app.name, app.description],
  },
  ...app.capabilities.map(capability => ({
    key: `${app.id}:${capability.id}`,
    appId: app.id,
    appName: app.name,
    name: capability.name,
    description: `${app.name} · ${app.description}`,
    href: `${app.origin}${capability.path}`,
    color: app.color,
    tint: app.tint,
    icon: capability.icon,
    keywords: [app.name, capability.name, ...(capability.keywords ?? [])],
  })),
])

const RECENT_STORAGE_KEY = 'atlas:recent-launches'

export function getRecentLaunches(): RecentLaunch[] {
  try {
    const value = window.localStorage.getItem(RECENT_STORAGE_KEY)
    if (!value) return []
    const parsed = JSON.parse(value) as RecentLaunch[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function openLaunchTarget(target: AtlasLaunchTarget) {
  recordLaunchTarget(target)
  window.location.assign(target.href)
}

export function recordLaunchTarget(target: AtlasLaunchTarget) {
  const recent = getRecentLaunches().filter(item => item.key !== target.key)
  const next = [{ key: target.key, visitedAt: Date.now() }, ...recent].slice(0, 6)

  try {
    window.localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Navigation should still work when storage is unavailable.
  }
}

export function getTargetByKey(key: string) {
  return launchTargets.find(target => target.key === key)
}
