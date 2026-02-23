import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '@/layouts'
import { AuthGuard } from '@/components'
import { Home } from '@/pages/Home'
import { AuthCallback } from '@/pages/auth'
import {
  Dashboard,
  Recipes,
  Categories,
  Favorites,
  History,
  Tags,
  Recommend,
  Home as ZweiHome,
} from '@/pages/zwei'
import { MiniprogramManagement } from '@/pages/miniprogram'
import {
  DomainManagement,
  ServiceManagement,
  ApplicationManagement,
  RelationshipManagement,
  GroupManagement,
} from '@/pages/hermes'
import { ChaosManagement } from '@/pages/chaos'

export function AppRoutes() {
  return (
    <Routes>
      {/* 认证回调路由 - 不需要登录保护 */}
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* 受保护的路由 */}
      <Route
        path="/"
        element={
          <AuthGuard>
            <MainLayout />
          </AuthGuard>
        }
      >
        <Route index element={<Home />} />
        <Route path="zwei" element={<Dashboard />} />
        <Route path="zwei/recipes" element={<Recipes />} />
        <Route path="zwei/recipes/categories" element={<Categories />} />
        <Route path="zwei/favorites" element={<Favorites />} />
        <Route path="zwei/history" element={<History />} />
        <Route path="zwei/tags" element={<Tags />} />
        <Route path="zwei/tags/cuisine" element={<Tags />} />
        <Route path="zwei/tags/flavor" element={<Tags />} />
        <Route path="zwei/tags/scene" element={<Tags />} />
        <Route path="zwei/tags/taboo" element={<Tags />} />
        <Route path="zwei/recommend" element={<Recommend />} />
        <Route path="zwei/home" element={<ZweiHome />} />
        <Route path="zwei/home/banners" element={<ZweiHome />} />
        <Route path="zwei/home/recommend" element={<ZweiHome />} />
        <Route path="zwei/home/hot" element={<ZweiHome />} />
        <Route path="miniprogram/*" element={<MiniprogramManagement />} />
        <Route path="hermes/domains/*" element={<DomainManagement />} />
        <Route path="hermes/services/*" element={<ServiceManagement />} />
        <Route path="hermes/applications/*" element={<ApplicationManagement />} />
        <Route path="hermes/relationships/*" element={<RelationshipManagement />} />
        <Route path="hermes/groups/*" element={<GroupManagement />} />
        <Route path="chaos/*" element={<ChaosManagement />} />
      </Route>
    </Routes>
  )
}
