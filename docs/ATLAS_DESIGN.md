# Atlas 产品与界面设计

## 1. 产品定义

Atlas 是云原生业务系统之上的统一入口。它负责系统发现、统一搜索、访问历史与身份衔接，但不复制外部系统的业务导航。

- 平台工程师通过 Manifest 注册和扩展系统。
- 业务用户从 Atlas Header 切换系统或搜索具体功能。
- Hermes、Chaos、Zwei 保持独立部署、独立路由和独立业务上下文。
- Portal 首页只展示平台信息，不承担完整系统目录。

一句话定位：**统一进入业务系统的云原生 Portal。**

## 2. 导航模型

```text
Atlas Header
├── 系统入口：左上角九宫格转换按钮
├── 品牌与当前位置：Atlas / 工作台
├── 全局搜索：Cmd/Ctrl + K
├── 账户入口：Avatar / Name / OpenID
└── 展开层：产品与服务

Atlas Portal
├── 接入概况
├── 最近访问
└── 平台信息
```

系统入口属于全局导航，固定放在 Header 左上角。点击后由同一个悬浮 Nav 向下展开产品与服务，不创建独立侧栏或抽屉。Portal 不再使用页面内 hash 锚点。

## 3. 悬浮 Nav 与系统菜单

### Header

- 收起态为悬浮在页面上方的 64px 透明材质 Nav。
- 左上角 40px 轻量圆角按钮是全局系统入口，它是工具控件，不承担品牌识别。
- 按钮从九宫格转换为关闭符号，保持触发点位置不变。
- 中部搜索打开全局启动器；窄屏只保留搜索图标。
- 右侧展示真实 Avatar、Name 和 OpenID，hover 或点击展示身份摘要、个人入口和退出登录。

### 展开菜单

- Nav 本体从 60px 向下展开，顶栏位置与搜索、用户信息保持不动。
- 展开层只展示系统入口，不重复放置搜索框；搜索始终由 Header 中的唯一入口负责。
- 展开态使用 32px 圆角、折射材质和克制阴影建立浮层层级。
- 系统条目由 Manifest 动态生成，并按顺序进入。
- 点击遮罩或 Escape 关闭；关闭后焦点回到系统入口按钮。
- 系统色只用于图标、悬停边线和轻背景。

该交互参考 ReactBits Staggered Menu 的进入节奏，但只让菜单内容逐项进入；容器本身保持单层，不使用彩色底板、暗色、编号和展示型大字。

## 4. Portal 首页

首页的单一任务是回答三个问题：

1. Atlas 当前接入了多少系统和功能？
2. 用户最近进入过哪些真实目标？
3. 系统以什么方式接入和打开？

首页不再展示系统注册表、系统卡片墙、欢迎营销 Hero 或伪造的运行状态。系统选择统一收进左上角抽屉。

首页正文使用“统一业务平台”作为标题、“工作台”作为当前位置，不展示 Logo 或 Atlas 品牌名。

Portal 主体使用视口 `90%` 的流式工作台布局，Header 独立居中并使用视口宽度的 `50%`。搜索弹窗、文字段落等局部阅读组件可以单独限制宽度。

## 5. 视觉系统

### 设计性格

关键词：**清晰、稳定、圆润、云控制台。**

- 信息架构参考阿里云控制台的全局 Header、产品入口和信息分区方法。
- 视觉语言参考 Apple 的层级、圆角、系统字体和克制材质。
- 使用蓝白主系统，不使用深色常驻导航。
- 按钮使用 10–14px、系统条目使用 18px、内容面板使用 24px、展开 Nav 使用 32px 圆角。
- 不使用可见渐变、霓虹光晕与持续动画；透明材质只用于全局 Nav 这一处视觉签名。

### Nav 材质

- 主 Nav 参考 ReactBits Glass Surface，通过 SVG displacement map 对背景像素进行轻量折射，而不是单纯覆盖一层半透明白色。
- Atlas 降低了原始示例的色散与形变强度，确保长导航中的文字、搜索框和系统卡片保持清晰。
- Chrome 等支持 SVG backdrop filter 的浏览器启用折射；Safari、Firefox 和不支持 backdrop filter 的环境自动降级为常规 blur 与半透明背景。
- 位移贴图内部的线性渐变只用于计算折射方向，不作为界面可见色彩。

### Portal 背景

- 浅色背景参考 ReactBits Dot Grid，以 `#eef5fc` 为画布，叠加可辨识的蓝灰点阵，不使用可见渐变。
- 点阵仅在鼠标附近产生轻微颜色变化和排斥位移，不响应点击冲击，也不持续运行逐帧动画。
- `prefers-reduced-motion` 下点阵保持静态；Canvas 像素比最高限制为 1.5。
- 点阵是页面唯一环境图形，替代此前 Header 后方的装饰色片，并为玻璃折射提供参照。

### 平台色彩

| Token                   | 色值      | 用途                   |
| ----------------------- | --------- | ---------------------- |
| `--atlas-primary`       | `#1677ff` | 系统入口、主操作、焦点 |
| `--atlas-command`       | `#0b4fbd` | 深蓝交互备用色         |
| `--atlas-signal`        | `#6ba6ff` | 辅助蓝色               |
| `--atlas-primary-soft`  | `#eaf3ff` | 图标与交互浅背景       |
| `--atlas-ink`           | `#1d2633` | 主文字                 |
| `--atlas-muted`         | `#657287` | 次级文字               |
| `--atlas-canvas`        | `#eef5fc` | Portal 明亮冷蓝背景    |
| `--atlas-surface`       | `#ffffff` | Header、面板和抽屉     |
| `--atlas-border`        | `#e6eaf0` | 常规分隔               |
| `--atlas-border-strong` | `#dfe5ee` | 面板边界               |

### 系统情绪色

- Hermes：烧橙 `#b94e20`，表达秩序、信任与边界。
- Chaos：工业灰 `#545d6b`，表达在混乱中建立结构。
- Zwei：暖红 `#b83f37`，表达温暖、鲜活与食欲。

系统情绪色不进入 Portal 的大面积背景，避免破坏蓝白平台识别。

### 站点图标与系统识别

- 页面 UI 不展示头像或图形 Logo；Header 只显示“统一业务平台”文字。
- `heliannuuthus.jpg` 仅通过 Portal `index.html` 用作浏览器 favicon，不参与页面布局。
- 全局系统按钮是九宫格工具图标，使用半透明浅色背景，不得设计成第二个品牌标志。
- Hermes、Chaos、Zwei 不设置独立 Logo；Portal 系统卡片通过产品名称、业务描述和一条情绪色标识区分。
- 三个业务应用的 Header 或侧栏只展示产品名称，不添加首字母、图形符号或替代 Logo。
- 情绪色统一由 `@atlas/ui` 的 `PRODUCT_BRAND_COLORS` 输出，业务应用不得维护另一份近似色。

### 字体

- 标题：SF Pro Display / SF Pro SC / Apple 系统字体。
- 正文与控件：SF Pro Text / SF Pro SC / PingFang SC。
- 数字、快捷键和技术字段：IBM Plex Mono / SFMono / Consolas。
- 不从外部 CDN 拉取字体。

## 6. 动效规范

- 按钮反馈：140–160ms。
- Nav 展开：340ms，使用 `cubic-bezier(0.16, 1, 0.3, 1)`。
- 系统条目间隔：38ms。
- 菜单内容只动画 `transform`、`opacity` 和颜色；Nav 容器因形态转换单独动画高度与圆角。
- `prefers-reduced-motion` 下取消错峰和形态转换。

## 7. Manifest 协议

```ts
interface AtlasAppManifest {
  id: string
  name: string
  category: string
  description: string
  origin: string
  homePath: string
  color: string
  tint: string
  icon: ReactNode
  capabilities: Array<{
    id: string
    name: string
    path: string
    icon: ReactNode
    keywords?: string[]
  }>
}
```

Header 抽屉、全局搜索和 Portal 统计都从同一份 Manifest 派生。后续可扩展权限、租户、版本、区域和真实健康探针。

## 8. 响应式与无障碍

- 820px 以下：Header 搜索收为图标。
- 520px 以下：抽屉占据视口宽度并保留 16px 退出边界。
- 900px 以下：首页信息面板改为单列。
- 所有核心触点至少 44px；紧凑桌面按钮最低 36px并保留可见焦点。
- 展开菜单支持 Escape、click-away、背景滚动锁与焦点返回。
- 跳到主要内容使用按钮聚焦，不修改 URL hash。

## 9. 演进路线

### Phase 1：统一 Portal

- 完成悬浮 Nav、展开系统菜单、启动器、最近访问和 Manifest 统计。

### Phase 2：共享平台壳

- 将 Header 系统入口下沉到共享 UI 包。
- Hermes、Chaos、Zwei 接入相同的跨系统入口和返回路径。
- 根据权限过滤系统与功能。

### Phase 3：云原生运行信息

- 接入服务注册中心、版本、区域和发布信息。
- 只有接入真实探针后才展示健康、延迟与故障状态。
- 最近访问同步到账户。

## 10. 明确不做

- 不使用 hash 路由承载 Portal 导航。
- 不用 iframe 拼装外部系统。
- 不伪造健康、环境或生产指标。
- 不使用常驻深色侧栏和应用卡片墙。
- 不为“高级感”添加可见渐变、泛滥的玻璃卡片和无任务价值的装饰。
