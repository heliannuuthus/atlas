import React from 'react'
import {
  MobileOutlined,
  UserOutlined,
  SettingOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  ApartmentOutlined,
  CloudServerOutlined,
  AppstoreAddOutlined,
  TeamOutlined,
  ShareAltOutlined,
  BookOutlined,
  HeartOutlined,
  HistoryOutlined,
  TagsOutlined,
  FireOutlined,
  StarOutlined,
  HomeOutlined,
  DashboardOutlined,
  NodeIndexOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import type { BusinessConfig, BusinessModule } from '@/types/business'

export const businessModules: BusinessModule[] = [
  {
    id: 'zwei',
    name: 'Zwei',
    icon: 'appstore',
    path: '/zwei',
    color: '#1890ff',
    description: '菜谱管理、收藏、推荐、标签等业务',
    enabled: true,
    order: 1,
  },
  {
    id: 'miniprogram',
    name: '小程序管理',
    icon: 'mobile',
    path: '/miniprogram',
    color: '#1890ff',
    description: '管理微信、支付宝、字节跳动小程序',
    enabled: false,
    order: 2,
  },
  {
    id: 'users',
    name: '用户管理',
    icon: 'user',
    path: '/users',
    color: '#52c41a',
    description: '用户信息、权限、角色管理',
    enabled: false,
    order: 2,
  },
  {
    id: 'data',
    name: '数据统计',
    icon: 'database',
    path: '/data',
    color: '#722ed1',
    description: '业务数据分析和报表',
    enabled: false,
    order: 3,
  },
  {
    id: 'settings',
    name: '系统设置',
    icon: 'setting',
    path: '/settings',
    color: '#fa8c16',
    description: '系统配置和参数管理',
    enabled: false,
    order: 4,
  },
  {
    id: 'hermes',
    name: 'Hermes',
    icon: 'appstore',
    path: '/hermes',
    color: '#13c2c2',
    description: '身份与访问管理：域、服务、应用、关系、组',
    enabled: true,
    order: 5,
  },
]

const iconMap: Record<string, React.ReactNode> = {
  mobile: <MobileOutlined />,
  user: <UserOutlined />,
  database: <DatabaseOutlined />,
  setting: <SettingOutlined />,
  appstore: <AppstoreOutlined />,
  apartment: <ApartmentOutlined />,
  cloud: <CloudServerOutlined />,
  app: <AppstoreAddOutlined />,
  team: <TeamOutlined />,
  share: <ShareAltOutlined />,
}

export const businessConfigs: Record<string, BusinessConfig> = {
  zwei: {
    module: businessModules[0],
    menus: [
      {
        key: 'dashboard',
        label: '概览',
        icon: <AppstoreOutlined />,
        path: '/zwei',
      },
      {
        key: 'recipes',
        label: '菜谱管理',
        icon: <BookOutlined />,
        path: '/zwei/recipes',
        children: [
          {
            key: 'recipes-list',
            label: '菜谱列表',
            icon: <BookOutlined />,
            path: '/zwei/recipes',
          },
          {
            key: 'recipes-categories',
            label: '分类管理',
            icon: <TagsOutlined />,
            path: '/zwei/recipes/categories',
          },
        ],
      },
      {
        key: 'favorites',
        label: '收藏管理',
        icon: <HeartOutlined />,
        path: '/zwei/favorites',
      },
      {
        key: 'history',
        label: '浏览历史',
        icon: <HistoryOutlined />,
        path: '/zwei/history',
      },
      {
        key: 'tags',
        label: '标签管理',
        icon: <TagsOutlined />,
        path: '/zwei/tags',
        children: [
          {
            key: 'tags-cuisine',
            label: '菜系标签',
            icon: <TagsOutlined />,
            path: '/zwei/tags/cuisine',
          },
          {
            key: 'tags-flavor',
            label: '口味标签',
            icon: <TagsOutlined />,
            path: '/zwei/tags/flavor',
          },
          {
            key: 'tags-scene',
            label: '场景标签',
            icon: <TagsOutlined />,
            path: '/zwei/tags/scene',
          },
          {
            key: 'tags-taboo',
            label: '禁忌选项',
            icon: <TagsOutlined />,
            path: '/zwei/tags/taboo',
          },
        ],
      },
      {
        key: 'recommend',
        label: '推荐系统',
        icon: <FireOutlined />,
        path: '/zwei/recommend',
      },
      {
        key: 'home',
        label: '首页内容',
        icon: <HomeOutlined />,
        path: '/zwei/home',
        children: [
          {
            key: 'home-banners',
            label: '轮播图',
            icon: <StarOutlined />,
            path: '/zwei/home/banners',
          },
          {
            key: 'home-recommend',
            label: '推荐菜谱',
            icon: <StarOutlined />,
            path: '/zwei/home/recommend',
          },
          {
            key: 'home-hot',
            label: '热门菜谱',
            icon: <StarOutlined />,
            path: '/zwei/home/hot',
          },
        ],
      },
    ],
    defaultPath: '/zwei',
  },
  miniprogram: {
    module: businessModules[1],
    menus: [
      {
        key: 'list',
        label: '小程序列表',
        icon: <MobileOutlined />,
        path: '/miniprogram',
      },
      {
        key: 'create',
        label: '创建小程序',
        icon: <MobileOutlined />,
        path: '/miniprogram/create',
      },
    ],
    defaultPath: '/miniprogram',
  },
  users: {
    module: businessModules[1],
    menus: [
      {
        key: 'list',
        label: '用户列表',
        icon: <UserOutlined />,
        path: '/users',
      },
    ],
    defaultPath: '/users',
  },
  data: {
    module: businessModules[2],
    menus: [
      {
        key: 'dashboard',
        label: '数据看板',
        icon: <DatabaseOutlined />,
        path: '/data',
      },
    ],
    defaultPath: '/data',
  },
  settings: {
    module: businessModules[3],
    menus: [
      {
        key: 'general',
        label: '通用设置',
        icon: <SettingOutlined />,
        path: '/settings',
      },
    ],
    defaultPath: '/settings',
  },
  hermes: {
    module: businessModules[4],
    menus: [
      {
        key: 'dashboard',
        label: '概览',
        icon: <DashboardOutlined />,
        path: '/hermes/dashboard',
      },
      {
        key: 'domains',
        label: '域管理',
        icon: <ApartmentOutlined />,
        path: '/hermes/domains',
      },
      {
        key: 'services',
        label: '服务管理',
        icon: <CloudServerOutlined />,
        path: '/hermes/services',
      },
      {
        key: 'applications',
        label: '应用管理',
        icon: <AppstoreAddOutlined />,
        path: '/hermes/applications',
      },
      {
        key: 'relationships',
        label: '关系管理',
        icon: <ShareAltOutlined />,
        path: '/hermes/relationships',
        children: [
          {
            key: 'rel-list',
            label: '关系列表',
            icon: <UnorderedListOutlined />,
            path: '/hermes/relationships',
          },
          {
            key: 'rel-graph',
            label: '关系图谱',
            icon: <NodeIndexOutlined />,
            path: '/hermes/relationships/graph',
          },
        ],
      },
      {
        key: 'groups',
        label: '组管理',
        icon: <TeamOutlined />,
        path: '/hermes/groups',
      },
    ],
    defaultPath: '/hermes/dashboard',
  },
}

export function getBusinessIcon(iconName: string): React.ReactNode {
  return iconMap[iconName] || <AppstoreOutlined />
}

export function getCurrentBusiness(pathname: string): BusinessModule | null {
  const segments = pathname.split('/').filter(Boolean)
  const firstSegment = segments[0]
  return (
    businessModules.find((m) => m.id === firstSegment || m.path.includes(firstSegment)) ||
    null
  )
}

export function getEnabledBusinesses(): BusinessModule[] {
  return businessModules.filter((m) => m.enabled).sort((a, b) => a.order - b.order)
}
