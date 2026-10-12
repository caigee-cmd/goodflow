> **已于 2026-10-12 归档，不要当规格。** 项目已在 `web/`。不要再跑 `pnpm create next-app`，不要按本文建 `/cart` 或 `public/images/`。询价单是 `/rfq`，图片在 `web/public/demo/`。启动见根目录 README.md。

# GoodFlow Demo 技术栈（定稿，已归档）

一句话：**Next.js + Tailwind + shadcn/ui + Motion + Magic UI，AI 聊天用 AI Elements。**

| 层 | 选型 | 用途 |
|---|---|---|
| 框架 | Next.js + React | App Router、页面、静态 Demo 部署 |
| 样式 | Tailwind CSS | 全站样式、Nio Life 冷淡风 token |
| 组件底座 | shadcn/ui | Button / Dialog / Sheet / Input / Card 等基础件 |
| 动效 | Motion（原 Framer Motion） | 页面过渡、列表入场、堆叠排行榜 |
| 视觉组件 | Magic UI | Marquee、Bento、Shimmer、Blur Fade 等现成动效块 |
| 可选补刀 | Animate UI **或** Cult UI（二选一） | Magic UI 缺的具体动画再加 |
| AI 聊天浮层 | AI Elements | 对话、推荐、结果展示 |
| 完整会话（可选） | assistant-ui | 只有聊天要做成完整会话时再加 |

本 Demo **不接后端**。页面数据写死；AI 对话走预设剧本，不接真实模型。

品牌、英文 UI、品类专区、排行榜以 [REQUIREMENTS.md](./REQUIREMENTS.md) 为准。色板是 **Estée Lauder**（象牙底 + 黑 + EL Gold），不是 Nio 黑白。

**Fluxa 登录页只给 `/ranking` 做全屏居中舞台参考，登录页不要抄。**

---

## 前期可以先做的事

代码还没写时，这些就能先做完。做完后真正搭页面会快很多。

### 0. 本机工具（一次装好）

```bash
node -v          # 建议 20+
pnpm -v          # 没有就：npm i -g pnpm
```

后面统一用 **pnpm**。组件 CLI 全部走 `pnpm dlx`，不必全局装 shadcn。

### 1. 建项目（建议现在就建）

```bash
cd /Users/cj/Documents/work/yct/goodflow
pnpm create next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

交互里选：

- TypeScript：Yes
- Tailwind：Yes
- App Router：Yes
- `src/`：Yes
- 别名 `@/*`：Yes

如果目录里已有 Markdown / `assets/`，create-next-app 会问是否覆盖。**不要覆盖文档和 `assets/`。** 可以先建到临时目录再把文件挪进来，或选「非空目录继续」。

### 2. 初始化 shadcn（组件 CLI 的底座）

```bash
pnpm dlx shadcn@latest init
```

建议选项：

- Style：New York
- Base color：Neutral（先选 Neutral，随后在 `globals.css` 改成 EL 象牙/黑/金）
- CSS variables：Yes

装完会得到 `components.json`、`src/lib/utils.ts`、`src/components/ui/`。  
之后 **Magic UI / Cult UI / AI Elements 都走这套 CLI**，不要再装第二套组件系统。

### 3. 装动效库

```bash
pnpm add motion
```

代码里这样引：

```ts
import { motion } from "motion/react"
```

不要再装 `framer-motion`。

### 4. 用 CLI 预拉基础组件（强烈建议先做）

对照纪要里的页面，这些 shadcn 组件几乎一定会用到：

```bash
pnpm dlx shadcn@latest add button input textarea card dialog sheet \
  dropdown-menu select checkbox badge separator scroll-area \
  tabs tooltip avatar skeleton
```

和 Demo 路径的对应关系：

| 组件 | 用在哪 |
|---|---|
| `sheet` | 侧边浮动品类筛选（非常驻） |
| `dialog` | AI 结果 / 商品详情 |
| `card` | 案例卡、商品卡 |
| `scroll-area` | 瀑布流、聊天记录 |
| `badge` | 数据源标签：历史库 / 外部推荐 |
| `input` + `button` | 搜索、询价、登录 |
| `skeleton` | 案例/商品加载占位 |

### 5. 用 CLI 预拉 Magic UI（视觉和动效的主力）

Magic UI 没有独立 CLI，走 shadcn registry：

```bash
pnpm dlx shadcn@latest add @magicui/marquee
pnpm dlx shadcn@latest add @magicui/bento-grid
pnpm dlx shadcn@latest add @magicui/animated-list
pnpm dlx shadcn@latest add @magicui/blur-fade
pnpm dlx shadcn@latest add @magicui/shimmer-button
pnpm dlx shadcn@latest add @magicui/shine-border
pnpm dlx shadcn@latest add @magicui/number-ticker
pnpm dlx shadcn@latest add @magicui/animated-shiny-text
pnpm dlx shadcn@latest add @magicui/magic-card
```

和 Demo 的对应关系：

| Magic UI | 用在哪 |
|---|---|
| Marquee | 首页案例瀑布 / 品牌墙替代滚动 |
| Bento Grid | 首页案例区、数据价值堆叠展示的骨架 |
| Animated List | 推荐结果、排行榜条目入场 |
| Blur Fade | 页面区块入场（冷淡、克制） |
| Shimmer Button / Shine Border | 主 CTA、登录、加入购物车 |
| Number Ticker | 点击量、采购量等数据价值数字 |
| Magic Card | 商品卡 hover |

堆叠式排行榜 **没有现成组件**，后面用 Motion 的 `layout` + 绝对定位自己做。这是亢总待办里要先试的那一块。

### 6. AI 聊天浮层 CLI（建议先拉最小集）

```bash
pnpm dlx ai-elements@latest add conversation
pnpm dlx ai-elements@latest add message
pnpm dlx ai-elements@latest add prompt-input
pnpm dlx ai-elements@latest add suggestion
```

本 Demo **不接真实模型**。组件拉下来后，用写死的 `messages` 数组演预设剧本即可：

1. 用户点建议问题  
2. 假流式回复  
3. 出商品推荐卡片  
4. 点商品进详情 / 加购  

`assistant-ui` 这周先不要装。只有聊天要做成完整多轮会话、还要工具调用时再加。

### 7. 可选补刀（先别装，缺了再加）

二选一，不要两个都装：

```bash
# 方案 A
pnpm dlx shadcn@latest add @animate-ui/<component>

# 方案 B
pnpm dlx shadcn@latest add @cult-ui/halo-button
```

缺什么再搜：

```bash
pnpm dlx shadcn@latest search @magicui -q "stack"
pnpm dlx shadcn@latest search @cult-ui -q "card"
```

### 8. 设计 token 可以先定（不写页面也能做）

对着 Estée Lauder，先在 `src/app/globals.css` 里定死（详见 REQUIREMENTS.md）：

- 背景：`#F7F4EF` 象牙色，不要纯白、不要深色主题
- 主文字 / 主按钮：`#1A1410`
- 强调 / 选中 / 排行榜第一名：`#C4A574` EL Gold
- 次要文字：`#8A7E72`
- 圆角：偏小（6–10px）；阴影极弱
- 字体：英文 UI。标题可用衬线（Logo / 大标题），正文用 Grotesk（Geist / Inter）
- 每页顶栏或登录表单上方必须有英文 wordmark：`ESTÉE LAUDER`

`/ranking` 布局抄 Fluxa 登录页（全屏居中 + 玻璃舞台），背景改成极淡金色光，不要紫青 aurora。登录页保持普通单品牌表单，不要套这套舞台。

素材已经在 `assets/`：

- 案例 / 产品图：`assets/pdf/photos/`
- 整页参考：`assets/pdf/pages/`
- 时间线、数据维度图：`assets/feishu/`

把 `assets/pdf/photos/` 拷到 `public/images/`，页面里就能直接 `/images/xxx.jpeg`。

### 9. 建议的目录（建完项目后按这个放）

```
src/
  app/
    page.tsx                 # Home：左案例瀑布 + 右品类入口
    login/page.tsx           # Estée Lauder 单品牌登录（不要 Fluxa 舞台）
    categories/page.tsx      # 品类专区：Brands + Archive / External
    ranking/page.tsx         # 堆叠排行榜（布局仿 Fluxa 登录页）
    cart/page.tsx            # Cart + Export RFQ
  components/
    ui/                      # shadcn + Magic UI CLI 生成
    ai-elements/             # AI Elements CLI 生成
    brand/                   # ESTÉE LAUDER wordmark
    cases/                   # 案例瀑布
    ranking/                 # 堆叠排行榜（自研 Motion）
    chat/                    # AI 浮层包装
  data/
    cases.ts                 # 写死 ~20 个英文案例
    products.ts              # 写死商品，含 archive / external
    brands.ts                # Estée Lauder 及 ELC 系品牌
    chat-script.ts           # 英文预设对话剧本
public/
  images/                    # 从 assets 拷过来的图
  brand/estee-lauder.svg     # 英文 Logo（有稿就放）
```

---

## 建议的动手顺序（1 周）

1. **今天 / 明天上午**：第 0–4 步。项目能跑，shadcn 组件能 import。
2. **明天下午**：第 5 步 Magic UI + 第 8 步 token。做一页空白首页，把 Marquee / Card 丢上去看风格。
3. **同步给亢总的试做**：`/ranking`。全屏居中仿 Fluxa 登录页骨架，中间做杯子/香氛堆叠。这是风险最高的动效，越早试越好。
4. **再往后**：`/login`（EL 单品牌，普通表单）→ Home → `/categories`（Brands + Archive）→ AI 浮层英文剧本。

不要先做：个人中心、历史咨询、后端登录、ERP/库存、移动端、随机提问。
