# 业务切换设计方案

## 设计理念

作为业务聚合平台，Atlas 需要支持快速、直观地在不同业务模块间切换。参考浏览器标签页和 IDE 的设计，采用 **顶部 Tab 导航 + 侧边栏业务菜单** 的组合方案。

## 核心特性

### 1. 顶部业务 Tab 导航
- **类似浏览器标签页**：显示最近访问的业务模块
- **快速切换**：点击 Tab 即可切换业务
- **可关闭**：支持关闭不需要的 Tab
- **视觉反馈**：当前业务显示活跃状态指示器

### 2. 业务感知的侧边栏
- **动态菜单**：根据当前业务显示对应的菜单项
- **业务标题**：顶部显示当前业务名称
- **自动切换**：路由变化时自动更新菜单

### 3. 快捷键支持
- **Cmd/Ctrl + 1-9**：快速切换到第 1-9 个业务模块
- **提升效率**：无需鼠标操作即可切换

### 4. 状态管理
- **最近访问记录**：自动记录最近访问的业务（最多 5 个）
- **持久化存储**：使用 Zustand + localStorage 持久化
- **路由同步**：路由变化时自动同步业务状态

## 使用方式

### 切换业务

1. **点击顶部 Tab**：直接点击业务 Tab 切换
2. **快捷键**：`Cmd/Ctrl + 数字键`（1-9）
3. **直接访问路由**：访问业务路径时自动识别并切换

### 添加新业务模块

在 `src/config/business.ts` 中配置：

```typescript
export const businessModules: BusinessModule[] = [
  {
    id: 'your-business',
    name: '你的业务',
    icon: 'your-icon',
    path: '/your-business',
    color: '#1890ff',
    description: '业务描述',
    enabled: true,
    order: 1,
  },
]

export const businessConfigs: Record<string, BusinessConfig> = {
  'your-business': {
    module: businessModules[0],
    menus: [
      {
        key: 'list',
        label: '列表',
        icon: <YourIcon />,
        path: '/your-business',
      },
    ],
    defaultPath: '/your-business',
  },
}
```

## 架构设计

### 文件结构

```
src/
├── types/
│   └── business.ts          # 业务模块类型定义
├── config/
│   └── business.ts          # 业务配置（模块列表、菜单配置）
├── store/
│   └── business.ts          # 业务状态管理
├── components/
│   └── BusinessTabs/       # 顶部 Tab 导航组件
├── layouts/
│   └── MainLayout/
│       └── Sidebar/        # 业务感知的侧边栏
└── hooks/
    └── useKeyboardShortcuts.ts  # 快捷键 Hook
```

### 数据流

```
路由变化 → syncBusinessFromPath() → useBusinessStore → 
  ├─→ BusinessTabs (更新 Tab)
  └─→ Sidebar (更新菜单)
```

## UI/UX 考虑

### 1. 视觉层次
- **顶部 Header**：租户选择、用户信息
- **业务 Tabs**：业务切换入口（第二层级）
- **侧边栏**：当前业务的子菜单（第三层级）
- **内容区**：业务具体内容

### 2. 交互反馈
- Tab 切换有平滑过渡动画
- 当前业务 Tab 显示活跃指示器（Badge）
- 侧边栏显示当前业务名称，增强上下文感知

### 3. 性能优化
- 业务模块懒加载（按需加载）
- Tab 数量限制（最多 5 个最近访问）
- 状态持久化避免重复计算

## 扩展性

### 未来可扩展功能

1. **业务搜索**：`Cmd/Ctrl + K` 打开业务搜索面板
2. **业务收藏**：支持收藏常用业务
3. **业务分组**：支持业务分组管理
4. **自定义快捷键**：用户自定义业务快捷键
5. **业务统计**：显示业务使用频率

## 最佳实践

1. **业务模块化**：每个业务独立的路由、状态、样式
2. **配置驱动**：通过配置文件管理业务，而非硬编码
3. **类型安全**：使用 TypeScript 确保类型安全
4. **状态隔离**：不同业务的状态互不干扰
5. **渐进增强**：基础功能优先，高级功能可选
