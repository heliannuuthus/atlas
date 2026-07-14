# Atlas

Atlas 是 Helios 的中台管理前端，采用 Turborepo 组织多个 React/Vite 应用与共享包。

## 项目结构

| 路径 | 说明 |
|------|------|
| `apps/portal/` | 聚合入口/门户 |
| `apps/hermes/` | Hermes/IAM 管理界面 |
| `apps/zwei/` | Zwei 业务管理界面 |
| `apps/chaos/` | Chaos 运维管理界面 |
| `packages/ui/` | 共享 UI 组件 |
| `packages/shared/` | 共享类型、工具、服务能力 |
| `src/` | 兼容/历史源目录，新增能力优先放入 apps/packages |

## 技术栈

- React
- TypeScript
- Vite
- Turborepo
- Ant Design 6
- ahooks / Zustand / React Router
- Sass

## 常用命令

```bash
pnpm install
pnpm dev
pnpm dev:portal
pnpm dev:hermes
pnpm dev:zwei
pnpm dev:chaos
pnpm build
pnpm lint
pnpm type-check
pnpm format:check
```

## UI 与架构规则

- 新页面优先落在对应 `apps/<domain>/`，跨 app 复用能力放 `packages/shared` 或 `packages/ui`。
- UI 交互优先使用 Ant Design 6 组件；按钮、表单、表格、加载状态不要手写原生替代。
- API 调用走 services 层，不要在组件里散落 axios/fetch。
- 共享包保持领域无关；不要把某个 app 的业务状态塞进 `packages/ui`。
- 与 Helios API 对齐时，先确认后端字段和分页/错误语义，不要仅靠 mock 推断。

## 验证 Checklist

1. 修改单 app：运行对应 `pnpm dev:<app>` 或 `turbo build --filter=@atlas/<app>`。
2. 修改共享包：运行 `pnpm type-check` 与 `pnpm build`。
3. UI 改动至少检查桌面和窄屏布局。
4. 提交前运行 `pnpm lint` 或说明未运行原因。
