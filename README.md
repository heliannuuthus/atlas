<p align="center">
  <img src="./assets/brand/hero-ice.png" width="256" alt="Atlas logo" />
</p>

<h1 align="center">Atlas</h1>

Atlas 是 Heliantheon 的管理台。一个 Turborepo 把共享门户和 Hermes、Chaos、Zwei 各自的管理界面收在一起，提供一个跨系统搜索、入口聚合、风格统一的运营体验。

Atlas is the Heliantheon admin workspace: a Turborepo that ties the shared portal together with focused administration apps for Hermes, Chaos, and Zwei.

## 应用

| 应用 | 用途 |
| --- | --- |
| `apps/portal` | 产品入口与统一工作区 |
| `apps/hermes` | 身份、应用、服务、用户组与关系数据的管理 |
| `apps/chaos` | 邮件模板、投递与文件操作 |
| `apps/zwei` | 菜谱、标签、收藏与推荐相关操作 |

领域相关的共享能力放在 `packages/shared`。领域无关的基础组件统一来自 `@heliannuuthus/ui`；`packages/ui` 只保留 Atlas 特有的组合与历史兼容代码。

## 开发

```bash
pnpm install
pnpm dev
pnpm dev:portal
pnpm dev:hermes
pnpm dev:chaos
pnpm dev:zwei
```

## 验证

```bash
pnpm type-check
pnpm lint
pnpm css:check
pnpm build
pnpm format:check
```

架构与产品决策记录在 [`docs/`](docs/) 里。