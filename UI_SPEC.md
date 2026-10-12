# UI 规格：视觉、组件、逐页

> 目标：一眼看上去就是 Estée Lauder，而不是"又一个 shadcn 后台"。
> 高级感来自：衬线大写、留白、细线、慢缓动、少量金色。**不来自**：发光、流光、聚光灯、渐变。
>
> 设计基准 1440×900；投屏验收 1920×1080；最小 1280×800 不破版。不做移动端。

---

## 1. Token

### 1.1 颜色

| Token | Hex | 用途 | 在象牙底上的对比度 |
|---|---|---|---|
| `el-black` | `#1A1410` | 主文字、主按钮、Logo | 约 16.6:1 |
| `el-gold` | `#C4A574` | 描边、填充、选中条、第 1 名边框。**不能做文字色** | 约 2.1:1（黑底上做文字约 7.8:1，可以） |
| `el-gold-deep` | `#8C6B3E` | 金色文字、hover、引用角标 | 象牙底 4.47:1，卡片底 4.8:1（13px 以下要加粗） |
| `el-ivory` | `#F7F4EF` | 页面底 | — |
| `el-paper` | `#FFFDF9` | **新增**：卡片、弹窗、面板等"浮起"的表面 | — |
| `el-cream` | `#EFE8DC` | 图片底、次级区块、选中行底色 | — |
| `el-taupe` | `#8A7E72` | 只用于 16px 以上的辅助文字、placeholder、图标 | 约 3.6:1 |
| `el-taupe-ink` | `#6F645A` | **新增**：所有次要文字、小字、眉标 | 约 5.2:1 |
| `el-line` | `#DDD4C8` | 分割线、输入框描边 | — |
| `el-danger` | `#9B3B2E` | 删除、错误（极少用） | — |

层级关系：页面 `ivory` → 卡片/弹窗 `paper` → 图片底/选中 `cream`。

### 1.2 shadcn 变量映射

`pnpm dlx shadcn@latest init` 之后，用下面这段替换 `globals.css` 里的 `:root`，**整段删掉 `.dark`**：

```css
:root {
  --radius: 0.5rem;
  --background: #F7F4EF;
  --foreground: #1A1410;
  --card: #FFFDF9;
  --card-foreground: #1A1410;
  --popover: #FFFDF9;
  --popover-foreground: #1A1410;
  --primary: #1A1410;
  --primary-foreground: #F7F4EF;
  --secondary: #EFE8DC;
  --secondary-foreground: #1A1410;
  --muted: #EFE8DC;
  --muted-foreground: #6F645A;
  --accent: #EFE8DC;
  --accent-foreground: #1A1410;
  --destructive: #9B3B2E;
  --border: #DDD4C8;
  --input: #DDD4C8;
  --ring: #C4A574;

  --el-black: #1A1410;
  --el-gold: #C4A574;
  --el-gold-deep: #8C6B3E;
  --el-ivory: #F7F4EF;
  --el-paper: #FFFDF9;
  --el-cream: #EFE8DC;
  --el-taupe: #8A7E72;
  --el-taupe-ink: #6F645A;
  --el-line: #DDD4C8;
}

@theme inline {
  --color-el-black: var(--el-black);
  --color-el-gold: var(--el-gold);
  --color-el-gold-deep: var(--el-gold-deep);
  --color-el-ivory: var(--el-ivory);
  --color-el-paper: var(--el-paper);
  --color-el-cream: var(--el-cream);
  --color-el-taupe: var(--el-taupe);
  --color-el-taupe-ink: var(--el-taupe-ink);
  --color-el-line: var(--el-line);

  --font-serif: var(--font-bodoni);
  --font-sans: var(--font-geist-sans);

  --shadow-el-sm: 0 1px 2px rgb(26 20 16 / 0.04);
  --shadow-el-md: 0 8px 24px rgb(26 20 16 / 0.06);
  --shadow-el-lg: 0 24px 64px rgb(26 20 16 / 0.10);

  --ease-el: cubic-bezier(0.22, 1, 0.36, 1);
}
```

### 1.3 字体

```ts
// app/layout.tsx
import { Bodoni_Moda, Geist } from 'next/font/google'
const bodoni = Bodoni_Moda({ subsets: ['latin'], variable: '--font-bodoni', display: 'swap' })
const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
```

- **Bodoni Moda**：wordmark、页面标题、弹窗标题、排行名次数字。**只用在 24px 及以上**，细笔画在投影仪上小字号会断。
- **Geist Sans**：其余全部。所有数字加 `tabular-nums`。
- next/font 在构建时下载并自托管，离线可用。

| 角色 | 字体 | 字号 / 行高 | 字重 | 其他 |
|---|---|---|---|---|
| Wordmark · 登录页 | Bodoni | 40 / 48 | 500 | uppercase，tracking .28em |
| Wordmark · 顶栏 | Bodoni | 18 / 24 | 500 | uppercase，tracking .28em |
| Display（Home H1） | Bodoni | 56 / 64 | 400 | 句首大写，tracking -.01em |
| 页面标题 | Bodoni | 40 / 48 | 400 | Categories / Ranking / RFQ List |
| 弹窗标题 | Bodoni | 30 / 38 | 400 | 案例标题 uppercase，tracking .04em |
| 排行名次 | Bodoni | 56（前三）/ 28（4–10） | 400 | `01` `02` 两位数 |
| 眉标 Eyebrow | Geist | 11 / 16 | 600 | uppercase，tracking .16em，`taupe-ink` |
| 导航 | Geist | 12 / 16 | 500 | uppercase，tracking .14em |
| 案例卡标题 | Geist | 13 / 18 | 600 | uppercase，tracking .06em，最多 2 行 |
| 商品名 | Geist | 15 / 22 | 500 | 1 行截断 |
| 正文 | Geist | 14 / 22 | 400 | |
| 小字 | Geist | 12 / 18 | 400 | `taupe-ink` |
| 按钮 | Geist | 12 / 16 | 600 | uppercase，tracking .12em |

**Wordmark 组件**：

```tsx
// 字距会在最后一个字母后多出一段空白，用负 margin 抵消，否则居中会偏左
<span className="font-serif uppercase tracking-[0.28em] mr-[-0.28em]">Estée Lauder</span>
```

CSS `uppercase` 会把 é 转成 É，数据里正常写 `Estée Lauder` 即可。

### 1.4 形状、阴影、间距

- **圆角**：按钮、输入框 6px；徽标 4px；卡片、图片 8px；弹窗、面板 10px。只有 chips、头像、图标按钮、轮播箭头用 `rounded-full`。
- **阴影**：静止状态用 `shadow-el-sm` 或不用；hover 只升一档到 `shadow-el-md`；弹窗用 `shadow-el-lg`。
- **描边**：全站 1px `el-line`。唯一例外是 2px 金色竖条（选中行、WHY IT WORKED 引用块）。
- **间距**：4px 网格。页面左右留白 40px，内容最大宽度 1360px；区块间距 64px；网格间距 24px；卡片内边距 16px。

### 1.5 动效

| 场景 | 参数 |
|---|---|
| 默认缓动 | `cubic-bezier(0.22, 1, 0.36, 1)` |
| hover | 200ms |
| 区块、卡片入场 | Blur Fade：透明度 0→1、y 8→0、blur 6px→0，450ms；列表每项延迟 40ms，最多 400ms |
| 页面切换 | `app/template.tsx` 里 opacity + y 8，450ms |
| 弹窗 | opacity + scale .98→1，300ms |
| AI 面板 | x 100%→0，400ms；页面 `padding-right` 同步过渡 |
| 筛选重排 | Motion `layout` + `AnimatePresence mode="popLayout"`，350ms |
| 排行重排 | spring，stiffness 260，damping 30 |
| 图片 hover | scale 1.03，600ms |
| 禁止 | 回弹（排行榜除外）、无限循环的发光或流光、视差、粒子 |
| 减少动效 | `prefers-reduced-motion` 时去掉位移，只保留淡入 |

---

## 2. 组件选型

### 2.1 用什么、不用什么

| 组件 | 结论 | 用法 |
|---|---|---|
| Magic UI · Blur Fade | ✅ | 所有区块、卡片入场 |
| Magic UI · Number Ticker | ✅ | 排行指标、询价单总额 |
| Magic UI · Marquee | ⚠️ 只用一处 | 排行榜页 TRENDING SEARCHES 关键词带；40s 一圈，hover 暂停 |
| Magic UI · Shine Border | ⚠️ 只给第 1 名 | 颜色改成 `#C4A574` 单色，duration 14s |
| Magic UI · Bento Grid | ❌ | 和"保留瀑布流"冲突 |
| Magic UI · Magic Card | ❌ | 聚光灯效果太科技；改用图片放大 + 阴影升一档 |
| Magic UI · Shimmer Button / Animated Shiny Text | ❌ | 默认流光和品牌调性不符；按钮 hover 改为文字变金色 |
| shadcn · Carousel | ✅ | 案例、商品图集 |
| shadcn · Toggle Group | ✅ | 场景 chips、Source 三段切换、排行指标切换 |
| shadcn · Sonner | ✅ | 加入询价单、复制成功 |
| shadcn · Hover Card | ✅ | AI 回答里的引用预览 |
| shadcn · Sheet | ❌ | 筛选只有一套常驻栏；AI 面板要推开页面，Sheet 是遮罩式 |
| 瀑布流 | 不装库 | 自己写约 30 行：ResizeObserver 量容器宽度 → `cols = max(2, floor((w + 24) / (272 + 24)))` → 第 i 个案例放进第 `i % cols` 列，每列是 `flex flex-col gap-6`。AI 面板推开后自动减一列。**不要用 CSS `columns`**：它按列从上往下排，featured 会全挤在第一列，而且 Motion 的 `layout` 动画在多栏布局里会错位 |

### 2.2 基础件样式

| 元件 | 规格 |
|---|---|
| 主按钮 | 黑底、象牙字；h-11（登录页 h-12）、px-6、圆角 6；hover 文字变 `#C4A574`（黑底金字） |
| 次按钮 | 1px 黑描边、黑字；hover 变黑底象牙字 |
| 金色按钮（Ask） | 1px `el-gold` 描边、`gold-deep` 字 + Sparkles 图标；hover 底色 `el-gold/10` |
| 文字链接 | 黑字；hover 变 `gold-deep`，下划线 offset 4px |
| 输入框 | h-10（登录页 h-12）、`paper` 底、`line` 描边；focus 时描边变 `el-gold` + 2px `el-gold/40` 外圈 |
| ARCHIVE 徽标 | 黑底 `#C4A574` 字，10px，600，tracking .14em，h-5，px-2，圆角 4 |
| EXTERNAL 徽标 | `paper` 底、`line` 描边、`taupe-ink` 字，其余同上 |
| Chips | h-9、px-4、`rounded-full`、`line` 描边、12px uppercase tracking .1em；选中为黑底象牙字；AI chip 金描边 + Sparkles |
| 三段切换 | h-10、圆角 6、`line` 描边；选中段黑底象牙字，选中块用 `layoutId` 滑动 |
| Checkbox | 16px、圆角 4；选中黑底、象牙色勾 |
| Toast | 黑底象牙字、圆角 8、底部居中；Undo / View 按钮用 `#C4A574` 字 |
| 图标 | lucide，stroke 1.5，16 / 18 / 20 三档 |

### 2.3 自研组件清单

`Wordmark` `Topbar` `Footer` `CaseCard` `CaseMasonry` `CaseDialog` `ProductCard` `ProductDialog` `PriceTierTable` `QuantityStepper` `SourceBadge` `FilterSidebar` `ActiveFilters` `RankingStage` `RankingList` `MetricSwitch` `TrendingMarquee` `RfqLineRow` `RfqSummary` `ExportDialog` `AdvisorPanel`（见 AI_SCRIPT.md）`PlaceholderImage` `EmptyState`

---

## 3. 全局框架

```
┌──────────────────────────────────────────────────────────────────┐
│ ESTÉE LAUDER     HOME  CATEGORIES  RANKING  RFQ LIST ④   [✦ Ask] (AC) │  72px
├──────────────────────────────────────────────┬───────────────────┤
│ main（AI 面板打开时 padding-right: 420px）     │ AdvisorPanel 420px │
│                                              │ （在顶栏下方）      │
├──────────────────────────────────────────────┤                   │
│ Powered by GoodFlow · Demo environment        │                   │
└──────────────────────────────────────────────┴───────────────────┘
```

**Topbar**（登录页不显示）

- 高 72px，`ivory/85` 底 + `backdrop-blur-md`；滚动超过 8px 后出现底部 1px `line`
- 左：Wordmark 18px，点击回 Home
- 中：导航 4 项，未选中 `taupe-ink`，hover 和选中为黑；选中项下方 6px 处有 1px 金色下划线，用 `layoutId="nav-underline"` 在各项之间滑动
- RFQ List 后面的数量角标：`#C4A574` 底黑字，10px，h-4，min-w-4；数量增加时 scale 1 → 1.25 → 1
- 右：金色 `✦ Ask` 按钮（打开或关闭面板）+ 头像 `AC`（下拉菜单：Anna Chen / buyer@esteelauder.com / Reset demo / Sign out）
- 搜索（P1）：放大镜图标，点击后展开 240px 输入框，回车跳 `/categories?source=all&q=…`

**Footer**：高 64px，12px `taupe-ink`。左边 `Powered by GoodFlow · Demo environment`，右边 `Data shown is illustrative`。

---

## 4. 逐页规格

### 4.1 Login `/login`

- **背景**：`ivory` 底，叠两层径向金光，24s 缓慢漂移（复用 Fluxa 的 `aurora` keyframes，换成下面的颜色）：
  ```css
  radial-gradient(60% 50% at 50% 35%, rgb(196 165 116 / 0.18), transparent 70%),
  radial-gradient(40% 40% at 80% 90%, rgb(196 165 116 / 0.10), transparent 70%);
  ```
- **顶部**（居中）：
  - Wordmark 40px
  - 下方 16px 处一条 40×1px 的 `el-gold` 细线
  - 再往下 16px：`GIFT INTELLIGENCE`，12px，tracking .32em，`taupe-ink`
- **卡片**：
  - 尺寸与表面：`max-w-md`，距顶部区块 40px；`rgb(255 253 249 / 0.72)` 底 + `backdrop-blur-xl` + 1px `line` 描边，圆角 10，`shadow-el-md`，内边距 32px
  - 标题：`Sign in`，Bodoni 24；下面一行 `Use your Estée Lauder account`，13px `taupe-ink`
  - 表单：Email、Password 两个输入框，h-12，左侧图标（Mail / Lock）；预填 `buyer@esteelauder.com` / `demo`
  - 按钮：`Sign in` 主按钮全宽 h-12 → 分隔线 `or` → `Continue as guest` 文字按钮
- **底部**：距页面底 24px，`Powered by GoodFlow · Demo environment`，11px
- **动效**：Wordmark blur-fade 700ms；卡片延迟 150ms 入场。提交时按钮转圈 600ms → 整页 opacity 到 0（350ms）→ 跳转 `/`

### 4.2 Home `/`

- **Hero**（居中，上 56px、下 32px）：
  - 眉标 `GIFT INTELLIGENCE`
  - H1 `Gifting, curated.`（Display 56px）
  - 副标题 `Industry cases for inspiration. Every gift we've made, one click away.`，16px `taupe-ink`
  - 背后叠一层登录页的金光，强度降到 40%
- **场景 chips**（居中，下距 40px）：`For You` `Lunar New Year` `Holiday Season` `VIP Gifting` `Launch Events` `Employee Gifts` `✦ Gift Advisor`
  - 前 6 个只筛左侧案例，`For You` 等于全部、featured 优先
  - 最后一个打开 AI 面板
- **主体**：`grid-cols-[1fr_320px] gap-10`
  - **左：案例瀑布流**
    - CaseCard：`paper` 底、圆角 8、内边距 16
    - 卡内从上到下：标题（13px uppercase，2 行）→ 图片（圆角 6，比例取数据 `coverAspect`，让瀑布流有高低节奏）→ 元信息行（11px 眉标：`LUNAR NEW YEAR · 2026`，右侧 client）
    - hover：卡片 `shadow-el-md`，图片 scale 1.03，标题变 `gold-deep`
    - 点击打开 CaseDialog；入场 Blur Fade，延迟 = index × 40ms
    - 切换 chip：每张卡 `layoutId={case.id}`，外层包 `LayoutGroup`，卡片可以跨列移动；离场淡出 200ms
  - **右：sticky 栏**（距顶 96px）
    - 卡片 1，From the Archive：`paper` 底、圆角 10、内边距 20
      - 眉标 `ESTÉE LAUDER COMPANIES`，标题 `From the Archive`（Bodoni 22）
      - 5 行 featured 商品：72px 方形缩略图（`cream` 底，圆角 6）+ 名称 14px + `2026 Lunar New Year` 12px + `From $38.00 · MOQ 3,000` 12px；hover 整行 `cream` 底
      - 底部链接 `View Estée Lauder Archive →`，跳 `/categories`（默认筛选）
    - 卡片 2，AI 入口：黑底象牙字、圆角 10、内边距 20
      - Sparkles 图标（金色）+ `Not sure where to start?`（Bodoni 20）+ `Ask the Gift Advisor about past gifts, budgets and trends.`（13px，象牙色 70%）
      - 金描边按钮 `Ask`

### 4.3 案例详情 CaseDialog

- **尺寸**：`max-w-[1200px] w-[92vw] h-[86vh]`，`paper` 底，圆角 10，内边距 32px；右上角 40px 圆形关闭按钮（1px `line` 描边）
- **头部**：眉标 `LUNAR NEW YEAR · 2026 · {CLIENT}`，标题 Bodoni 30 uppercase
- **主体**：`grid-cols-[1fr_300px] gap-8`
  - **左**
    - Carousel：16:10，圆角 8；左右 40px 圆形箭头（`paper/80` + blur）；下方圆点，当前项黑色 6px，其余 `line` 色
    - 描述：14 / 24，最大宽度 680px
    - WHY IT WORKED 引用块：左侧 2px `el-gold` 竖条，`cream/50` 底，内边距 16，眉标 + 14px 正文
  - **右**
    - 眉标 `IN THIS CASE`
    - 单品网格：两列，88px 圆形缩略图（`cream` 底，延续原设计稿），下面名称 12px uppercase + 规格 11px `taupe-ink`
    - 底部按钮：主按钮 `Browse similar gifts`（跳 `/categories?source=all&occasion=…`）+ 金描边按钮 `Ask about this case`

### 4.4 Categories `/categories`

- **页头**：
  - 左：`Categories`（40px）+ 副标题 `Every gift we've made for Estée Lauder Companies, and the best picks from outside.`
  - 右：Source 三段切换 `All · Estée Lauder Archive · External Picks`
- **主体**：`grid-cols-[240px_1fr] gap-10`
  - **左：筛选栏**（sticky，距顶 96px）
    - 顶部 `Clear all` 链接
    - 四组：Brands / Category / Occasion / Price per unit，组标题用眉标
    - 每项 32px 高：checkbox + 13px 标签，右侧数量 12px `taupe-ink` tabular
    - 价格是单选：`Any` / `Under $20` / `Under $60` / `Under $120`
  - **右：网格区**
    - 工具条：已选条件 chips（可点 × 移除）+ 结果数 `7 gifts` + 排序（Featured / Newest / Price: low to high / Most clicked）
    - 网格：`grid-cols-[repeat(auto-fill,minmax(232px,1fr))] gap-6`
- **ProductCard**：
  - 图片区：`cream` 底、圆角 8、正方形，商品图 `object-contain p-6`
  - 左上角徽标（ARCHIVE / EXTERNAL）
  - 右下角快速加入按钮：36px 圆形 `paper` 底，ShoppingBag+ 图标，hover 时出现，加入后变成对勾 1.5s
  - 图片下方：眉标（Archive：`ESTÉE LAUDER · LNY 2026`；External：`BY CLEARLINE`）→ 商品名 15px → `From $38.00 · MOQ 3,000`（13px tabular）
  - hover：图片 scale 1.04；卡片本身不抬起
- **筛选动画**：每张卡加 `layout`，用 `AnimatePresence mode="popLayout"` 包住，350ms
- **空状态**：
  - 文案：标题 `No gifts match these filters`（Bodoni 24）+ 一行说明
  - 按钮：`Clear filters` + `Ask the Advisor`
  - 原则：主线上不应该出现空状态

### 4.5 商品详情 ProductDialog

布局沿用原设计稿 page-04。

- **尺寸**：`max-w-[1120px] w-[92vw] h-[86vh]`，`grid-cols-[1.1fr_1fr]`
- **左：图片区**
  - `cream` 底大图（Carousel）
  - 下方一排 64px 缩略图
- **右：信息区**（ScrollArea）
  - 抬头：徽标 + 眉标品牌行 → 商品名 Bodoni 30
  - Archive 商品：
    - campaign 行：`Lunar New Year 2026 · APAC VIP`
    - ARCHIVE NOTE 块：`cream` 底，左侧金色竖条，内容是数据里的 notes
  - External 商品：显示 `By {maker} · Recommended for Estée Lauder, La Mer`
  - 规格表：两列 dl（标签用眉标，值 13px），依次是 INSPIRATION / MATERIAL / PACKAGING / SIZE
  - SHIPPING TERMS：radio-group 横排 `EXW` `FOB` `DAP`
  - 阶梯价：PriceTierTable，三列 `MOQ | Unit price | Lead time`
    - 当前数量所在的档：`cream` 底 + 左侧 2px 金条
    - 表下提示（可点击）：`Order 10,000+ to unlock $33.00/unit`，点击把数量设到 10,000
  - QUANTITY：QuantityStepper，`− 3,000 +`；步长 500，最小值为第一档 MOQ，也可以直接输入
- **右栏底部**（sticky）：
  - 估算行：`Est. $114,000 · Order by Nov 6, 2026 to land by Jan 15, 2027`，12px `taupe-ink`
  - 主按钮全宽 `Add to RFQ`；已在询价单里时显示 `In RFQ List ✓`，点击跳 `/rfq`
  - 金色文字按钮 `Ask about this item`

### 4.6 Ranking `/ranking`

- **页头**：
  - 左：眉标 `GOODFLOW PUBLIC DATA · JUL–SEP 2026` → `Ranking`（40px）→ `Drinkware · This season`
  - 右：榜单选择（Drinkware / Home & Scent，后者 P1）+ 指标三段切换 `Search heat · Case clicks · Public purchase volume`
- **关键词带**（P1）：
  - 高 40px，上下 1px `line`
  - 左侧固定标签 `TRENDING SEARCHES`
  - Marquee 内容：12px uppercase `taupe-ink`，词与词之间用金色 `·` 分隔
- **舞台**：高 520px，相对定位，前三名用绝对定位，坐标相对舞台中心：

  | 名次 | x | y | scale | rotate | z |
  |---|---|---|---|---|---|
  | 1 | 0 | 0 | 1 | 0° | 30 |
  | 2 | -240px | 24px | .84 | -4° | 20 |
  | 3 | +240px | 32px | .80 | +4° | 10 |
  | 悬停中的 2 或 3 | 不变 | 8px | .90 | 0° | 40 |

  - 卡片：宽 300px，图片 4:5、`cream` 底、圆角 8
  - 卡片下方：名次（Bodoni 56，第 1 名 `gold-deep`，其余黑）→ 名称 14px → 指标值（Number Ticker 20px tabular + 11px 单位 `SEARCHES` / `CLICKS` / `UNITS`）→ 名次变化 `▲ 3` / `▼ 1` / `NEW`（只在 Search heat 视图显示；上升 `gold-deep`，下降 `taupe`，不用红绿）
  - 第 1 名：Shine Border 金色单色 + 眉标 `NO. 1`
  - 悬停时其余卡片 opacity .7
- **4–10 名**：舞台下方一行 `grid-cols-7 gap-4`
  - 卡片：4:5 缩略图 + 名次 Bodoni 28 + 名称 13px + 指标值 13px tabular
  - hover：y -6
- **切换指标**：
  - 每个条目用 `layoutId={item.id}`，在舞台和列表之间飞到新位置，spring 260 / 30
  - Number Ticker 用 `key={metric}` 重放
  - 指标同步到 URL `?metric=`；AI 剧本 C2 会改这个参数
- **趋势预测**（P1）：眉标 `FORECAST · Q1 2027`，下面 3 张小卡 `RISING` / `STEADY` / `COOLING`
- **页脚声明**（12px `taupe-ink`）：`Based on GoodFlow public & anonymized data (Jul–Sep 2026). No Estée Lauder internal data is used.`
- **点击条目**：有 `productId` 的打开 ProductDialog；没有的不响应，光标保持默认

### 4.7 RFQ List `/rfq`

- **页头**：`RFQ List` + 副标题 `Request quotes from GoodFlow. Pricing is indicative and based on volume tiers.`
- **主体**：`grid-cols-[1fr_360px] gap-10`
  - **左：RfqLineRow 列表**
    - 每行：`paper` 底、圆角 8、内边距 16，`grid-cols-[24px_96px_1fr_auto]`
    - checkbox → 缩略图 → 信息区 → 价格区
    - 信息区：徽标 + 商品名 15px；规格 12px `taupe-ink`；控件行（运输条款 select + 数量 stepper + 下一档提示链接）
    - 价格区：单价 13px → 小计 16px 600 tabular → 删除图标
  - **右：RfqSummary**（sticky）
    - 眉标 `SUMMARY`
    - Project 输入框（AI 加入时自动填 `Lunar New Year 2027 VIP Gifting`）
    - 汇总：选中件数、总数量、`Est. total $231,500`（Geist 24 600 tabular，Number Ticker）
    - Needed by 日期输入（默认 2027-01-15）、Delivery region（select，默认 APAC）、Notes（3 行 textarea）
    - 提示块：`cream` 底 + Clock 图标，`Order by Nov 1, 2026 — longest lead time 75 days (Year of the Goat Porcelain Tea Set)`
    - 主按钮全宽 `Export RFQ` + 小字 `Indicative pricing · Final quote from GoodFlow sales`
- **ExportDialog**（`max-w-[720px]`）：
  - 字段：To（只读，取 `brand.ts` 里的收件人）、Subject 输入框、Body textarea（Geist Mono 13px，高 360px，可编辑）
  - 按钮：主按钮 `Copy email` → toast `Copied to clipboard`；次按钮 `Open in Mail`（mailto，正文太长时只带前 1,500 字）
  - 地址带 `?export=1` 时自动打开（AI 剧本 B3 用）
- **空状态**：`Your RFQ List is empty` + `Browse Categories` + `Ask the Advisor`

---

## 5. 状态

| 状态 | 规则 |
|---|---|
| hover | 只用一种变化：变色、放大图片或阴影升一档，三选一 |
| focus | `focus-visible`：2px `el-gold` 外圈，offset 2px |
| 选中 | 黑底象牙字；或 `cream` 底 + 2px 金色竖条 |
| 禁用 | opacity .4，不改颜色 |
| 加载 | 图片加载前显示 `cream` 底 + 轻微呼吸（opacity .6↔1，1.6s），加载完淡入 400ms |
| 空 | 统一用 EmptyState：Bodoni 24 标题 + 一行说明 + 1–2 个按钮 |
| 错误 | Demo 不应该出现；兜底文案 `Something went wrong — please refresh.` |

---

## 6. 图片

- 一律用 `next/image`；静态导出时 `images.unoptimized: true`，压缩由开发侧事先做好
- **案例图**：`object-cover`；**商品图**：`cream` 底上 `object-contain p-6`；**排行图**：`object-cover`，4:5
- 真实素材到位前用 `PlaceholderImage`：`cream` 底，中间放商品名首字母（Bodoni 40，`el-gold-deep`），按真实比例占位
- `assets/pdf/photos/` 里的是**设计稿截图**，不能当素材用

---

## 7. 反面清单（看到就改）

- 紫色、蓝色、青色，任何渐变按钮
- 发光、流光、聚光灯、霓虹描边
- 纯白 `#FFFFFF` 页面底、深色主题
- 金色 `#C4A574` 直接当文字放在浅色底上
- 12px 以下的 Bodoni
- 大于 10px 的圆角（`rounded-full` 的例外见 §1.4）、`shadow-lg` 以上的重阴影
- 弹跳动画（排行榜除外）、hover 时卡片大幅位移
- 中文、emoji、`Lorem ipsum`
- 多品牌 Logo 墙
