# Atlas 开发与 AI 协作约定

本文档约定 Atlas 前端开发中需要遵守的规范，供开发者和 AI Agent 参考。

## 列表与刷新

### 禁止列表页「刷新」按钮

- **列表页不提供「刷新」按钮**。列表数据依赖 `useRequest` 的 `refreshDeps`、路由/筛选变化或操作后回调（如删除成功后 `refresh()`）自动更新；用户通过重新进入页面或变更筛选条件即可看到最新数据。
- 新增或修改列表页时不得在工具栏或表头添加「刷新」按钮；若发现已有刷新按钮，应移除并遵守本规则。

## UI 与组件

### 优先使用 Ant Design

- **在实现或修改 UI 时，应主动、优先使用 Ant Design（antd）组件**，而不是手写原生 HTML + 自定义样式实现同等能力。
- 布局与结构：优先使用 `Layout`、`Card`、`Space`、`Grid`、`Divider` 等。
- 表单与输入：使用 `Form`、`Input`、`Select`、`DatePicker`、`Switch` 等。
- 数据展示：使用 `Table`、`Descriptions`、`List`、`Tag`、`Badge`、`Empty` 等。
- 反馈与导航：使用 `Button`、`Modal`、`message`、`Breadcrumb`、`Menu`、`Tabs`、`Dropdown` 等。
- 在 antd 能覆盖的场景下，避免用裸 `div`/`button` + 自写 SCSS 复刻卡片、列表、按钮等；若需定制样式，优先通过 antd 的 `className`、`styles`、`token` 或 ConfigProvider 扩展，保持技术栈统一与可维护性。
