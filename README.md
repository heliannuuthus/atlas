<p align="center">
  <img src="./assets/brand/hero-ice.png" width="256" alt="Atlas emblem suspended in a clear ice block" />
</p>

<h1 align="center">Atlas</h1>

<p align="center">
  <strong>The unified operations workspace for Heliantheon products.</strong><br />
  Heliantheon 产品的统一运营与管理工作台。
</p>

## Overview / 项目简介

Atlas is a Turborepo containing the shared portal and focused administration applications for Hermes, Chaos, and Zwei.

Atlas 使用 Turborepo 组织统一门户以及 Hermes、Chaos、Zwei 的领域管理应用，提供跨系统搜索、入口聚合和一致的管理体验。

## Applications

| Application   | Purpose                                                                |
| ------------- | ---------------------------------------------------------------------- |
| `apps/portal` | Atlas product launcher and unified workspace                           |
| `apps/hermes` | Identity, application, service, group, and relationship administration |
| `apps/chaos`  | Message-template, delivery, and file operations                        |
| `apps/zwei`   | Recipe, tag, favorite, and recommendation operations                   |

Shared domain utilities live in `packages/shared`. Domain-independent primitives come from `@heliannuuthus/ui`; `packages/ui` is limited to Atlas-specific composition and compatibility code.

## Development

```bash
pnpm install
pnpm dev
pnpm dev:portal
pnpm dev:hermes
pnpm dev:chaos
pnpm dev:zwei
```

## Verification

```bash
pnpm type-check
pnpm lint
pnpm css:check
pnpm build
pnpm format:check
```

Architecture and product decisions are documented under [`docs/`](docs/).
