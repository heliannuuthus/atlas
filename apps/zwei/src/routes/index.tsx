import { Routes, Route } from 'react-router-dom'
import { ZweiLayout } from '@/layouts'
import { AuthCallback } from '@/pages/auth/Callback'
import { Dashboard } from '@/pages/Dashboard'
import { Recipes } from '@/pages/Recipes'
import { Categories } from '@/pages/Recipes/Categories'
import { Favorites } from '@/pages/Favorites'
import { History } from '@/pages/History'
import { Tags } from '@/pages/Tags'
import { Recommend } from '@/pages/Recommend'
import { Home as ZweiHome } from '@/pages/Home'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/" element={<ZweiLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="recipes" element={<Recipes />} />
        <Route path="recipes/categories" element={<Categories />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="history" element={<History />} />
        <Route path="tags" element={<Tags />} />
        <Route path="tags/cuisine" element={<Tags />} />
        <Route path="tags/flavor" element={<Tags />} />
        <Route path="tags/scene" element={<Tags />} />
        <Route path="tags/taboo" element={<Tags />} />
        <Route path="recommend" element={<Recommend />} />
        <Route path="home" element={<ZweiHome />} />
        <Route path="home/banners" element={<ZweiHome />} />
        <Route path="home/recommend" element={<ZweiHome />} />
        <Route path="home/hot" element={<ZweiHome />} />
      </Route>
    </Routes>
  )
}
