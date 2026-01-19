# Atlas 中台管理平台

基于 Vite + React + Ant Design 6 + ahooks 构建的现代化中台管理平台。

**Atlas** 是统一聚合后端 Helios 的管理前端，提供多平台（Zwei、Atlas 等）的统一管理界面。

## 技术栈

- **Vite** - 构建工具
- **React 18** - UI 框架
- **Ant Design 6** - UI 组件库
- **ahooks** - React Hooks 库
- **Zustand** - 状态管理
- **React Router** - 路由管理
- **TypeScript** - 类型支持
- **Sass** - CSS 预处理器
- **pnpm** - 包管理器

## 功能特性

- 🏢 多租户切换（左上角下拉栏）
- 📱 Zwei 小程序管理（列表、详情、创建、编辑）
- 💾 本地缓存管理（localStorage/sessionStorage）
- 🎨 现代化 UI 设计
- 🔄 流畅的交互体验
- 📦 组件化设计，高度可复用

## 项目结构

```
atlas/
├── src/
│   ├── components/      # 可复用组件
│   ├── hooks/          # 自定义 Hooks
│   ├── layouts/        # 布局组件
│   ├── pages/          # 页面组件
│   ├── store/          # 状态管理
│   ├── utils/          # 工具函数
│   ├── types/          # 类型定义
│   ├── mock/           # 模拟数据和 API
│   └── styles/         # 全局样式
├── public/             # 静态资源
└── package.json        # 依赖配置
```

## 开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview

# 代码格式化
pnpm format

# 检查代码格式
pnpm format:check

# 类型检查
pnpm type-check

# 代码检查
pnpm lint
```

## 主要功能模块

### 1. 租户管理
- 左上角租户切换下拉框
- 租户信息持久化存储
- 自动初始化默认租户

### 2. 小程序管理
- **列表页**：支持搜索、筛选、分页
- **详情页**：查看小程序完整信息
- **创建页**：新建小程序
- **编辑页**：修改小程序信息
- 支持状态管理（草稿、审核中、已发布等）
- 支持多平台（微信、支付宝、字节跳动）

### 3. 缓存管理
- localStorage 封装
- sessionStorage 封装
- 类型安全的存储操作
- 自动序列化/反序列化

## 注意事项

- 当前使用假数据，后续需要接入真实 API
- 登录和鉴权功能暂未实现
- 所有数据存储在浏览器本地存储中
