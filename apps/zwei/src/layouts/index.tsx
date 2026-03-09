import { useNavigate, useLocation } from 'react-router-dom'
import {
  BookOutlined,
  HeartOutlined,
  HistoryOutlined,
  TagsOutlined,
  FireOutlined,
  StarOutlined,
  HomeOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { MainLayout, Sidebar, Breadcrumb, Header, UserMenu, SearchTrigger } from '@atlas/ui'
import type { SidebarMenuItem } from '@atlas/ui'

const BRAND_COLOR = '#ea580c'

const zweiMenus: SidebarMenuItem[] = [
  { key: 'dashboard', label: '概览', icon: <AppstoreOutlined />, path: '/' },
  {
    key: 'recipes', label: '菜谱管理', icon: <BookOutlined />, path: '/recipes',
    section: '内容管理',
    children: [
      { key: 'recipes-list', label: '菜谱列表', icon: <BookOutlined />, path: '/recipes' },
      { key: 'recipes-categories', label: '分类管理', icon: <TagsOutlined />, path: '/recipes/categories' },
    ],
  },
  { key: 'favorites', label: '收藏管理', icon: <HeartOutlined />, path: '/favorites' },
  { key: 'history', label: '浏览历史', icon: <HistoryOutlined />, path: '/history' },
  {
    key: 'tags', label: '标签管理', icon: <TagsOutlined />, path: '/tags',
    section: '配置',
    children: [
      { key: 'tags-cuisine', label: '菜系标签', icon: <TagsOutlined />, path: '/tags/cuisine' },
      { key: 'tags-flavor', label: '口味标签', icon: <TagsOutlined />, path: '/tags/flavor' },
      { key: 'tags-scene', label: '场景标签', icon: <TagsOutlined />, path: '/tags/scene' },
      { key: 'tags-taboo', label: '禁忌选项', icon: <TagsOutlined />, path: '/tags/taboo' },
    ],
  },
  { key: 'recommend', label: '推荐系统', icon: <FireOutlined />, path: '/recommend' },
  {
    key: 'home', label: '首页内容', icon: <HomeOutlined />, path: '/home',
    children: [
      { key: 'home-banners', label: '轮播图', icon: <StarOutlined />, path: '/home/banners' },
      { key: 'home-recommend', label: '推荐菜谱', icon: <StarOutlined />, path: '/home/recommend' },
      { key: 'home-hot', label: '热门菜谱', icon: <StarOutlined />, path: '/home/hot' },
    ],
  },
  { key: 'settings', label: '设置', icon: <SettingOutlined />, path: '/settings', bottom: true },
]

const zweiLogo = {
  icon: (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#ea580c" />
      <circle cx="16" cy="13" r="5" stroke="#fff" strokeWidth="2" fill="none" />
      <path d="M9 24c0-3.87 3.13-7 7-7s7 3.13 7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  text: 'Zwei',
}

const breadcrumbConfig = {
  appName: 'Zwei',
  defaultPath: '/',
  routeNameMap: {
    recipes: '菜谱管理',
    categories: '分类管理',
    favorites: '收藏管理',
    history: '浏览历史',
    tags: '标签管理',
    recommend: '推荐系统',
    home: '首页内容',
    banners: '轮播图',
    hot: '热门菜谱',
    cuisine: '菜系标签',
    flavor: '口味标签',
    scene: '场景标签',
    taboo: '禁忌选项',
    settings: '设置',
  },
}

export function ZweiLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <MainLayout
      renderSidebar={(collapsed) => (
        <Sidebar
          collapsed={collapsed}
          menus={zweiMenus}
          logo={zweiLogo}
          brandColor={BRAND_COLOR}
          onLogoClick={() => navigate('/')}
          selectedKeys={[location.pathname]}
          onMenuClick={(key) => navigate(key)}
        />
      )}
      header={
        <Header
          left={<Breadcrumb config={breadcrumbConfig} />}
          center={<SearchTrigger />}
          right={<UserMenu brandColor={BRAND_COLOR} />}
        />
      }
    />
  )
}
