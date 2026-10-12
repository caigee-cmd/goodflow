# GoodFlow Demo 产品需求（增补定稿）

本文件覆盖会议纪要之后明确的品牌与页面规则。实现时以本文为准；冲突处覆盖纪要里的「通用品牌墙登录页」。

**Fluxa 本地登录页只给排行榜做布局参考，不给登录页用。**

---

## 1. 品牌与语言

### 1.1 语言

- 全站 UI **只出英文**。
- 文案、导航、按钮、筛选、空态、AI 预设对话全部英文。
- Logo 使用英文：**ESTÉE LAUDER**（带 é）。
- 不提供中文切换。目的：海内外团队同一套界面，降低跨团队沟通成本。

### 1.2 每页必须有英文 Logo

每个页面（含登录、首页、品类专区、排行榜、购物车）固定露出 Estée Lauder 英文 wordmark。

建议位置：

- 登录页：表单正上方居中，字号最大
- 其余页：顶栏左侧，点击回到 Home
- 不要用 GoodFlow / 古德 作为主 Logo；GoodFlow 最多作为极小产品署名（footer 或登录副标题）

Logo 处理：

- 优先用官方英文 wordmark（黑或 EL Gold，放在浅色底上）
- 没有矢量稿时，先用高质量衬线字排 `ESTÉE LAUDER`，字距加宽，全大写
- 不要用中文「雅诗兰黛」字标

### 1.3 色调：Estée Lauder，不是 Nio 黑白、也不是通用品牌墙

视觉素材（案例图、产品图）仍可参考 Nio Life 的克制、留白、冷淡构图。  
**UI 色板必须是 Estée Lauder 品牌色**，不要做成 Nio 黑白车机风，也不要彩虹品牌墙。

Demo 色板（可先用，有官方规范再替换）：

| Token | Hex | 用途 |
|---|---|---|
| `el-black` | `#1A1410` | 主文字、Logo、主按钮 |
| `el-gold` | `#C4A574` | 强调、选中、排行榜第一名、主 CTA 描边 |
| `el-gold-deep` | `#8C6B3E` | hover、标题点缀 |
| `el-ivory` | `#F7F4EF` | 页面底 |
| `el-cream` | `#EFE8DC` | 卡片底、次级区块 |
| `el-taupe` | `#8A7E72` | 次要文字、未选中筛选项 |
| `el-line` | `#DDD4C8` | 分割线 |

规则：

- 背景用象牙色，不用纯白、不用深色主题
- 主按钮：黑底金字或黑底白字；不要大面积高饱和红
- 选中态、排行榜高亮用 EL Gold，不要用蓝紫科技色
- 阴影极弱；圆角偏小（6–10px）
- 不要用 Fluxa 登录页的紫/青 aurora 当全站背景

---

## 2. 登录页（指定 Estée Lauder，不要抄 Fluxa）

登录页 **不是** Fluxa 布局。Fluxa `/auth` 的全屏居中玻璃卡，只给 `/ranking` 用。

登录页要做的只有：

- **禁止**通用服务品牌墙、多品牌 logo 宫格
- **指定** Estée Lauder 单品牌：表单区上方是英文 `ESTÉE LAUDER`，不要品牌墙
- 雀巢项目只借鉴「单品牌定制」这件事，不复用品牌墙结构，也不套 Fluxa
- 色板用本文 1.3 的象牙 / 黑 / EL Gold
- 英文 UI：Email、Password、Sign in
- Demo 任意账号可进；可预填 `buyer@esteelauder.com` / `demo`
- 可选 Continue as guest，点了直接进 Home

登录页保持克制、短路径即可，不要做成海报式全屏舞台。

---

## 3. 页面结构（增补后）

| 路由 | 页面 | 说明 |
|---|---|---|
| `/login` | Sign in | Estée Lauder 单品牌登录，**不是** Fluxa 布局 |
| `/` | Home | 左案例瀑布，右品类栏；顶栏有 EL Logo |
| `/categories` | Category Gallery | **新增** 品类专区，可按 Brands 筛选 |
| `/ranking` | Ranking | **新增** 堆叠排行榜；**布局仿 Fluxa 登录页** |
| `/rfq` | RFQ List | 询价单 + 导出询价邮件（英文）。没有 `/cart` |

AI 聊天不是独立路由，Home / Category / Ranking 右下角浮层即可。

顶栏（登录页除外）：

```
[ ESTÉE LAUDER ]    Home    Products    Archive    Ranking    RFQ List     [Ask]
```

全部英文。

---

## 4. 品类专区 `/categories`

独立页，不要和首页右侧那条品类栏混成同一个页面。首页品类栏只是入口，点进去进本页。

### 4.1 筛选

顶部或左侧筛选条，英文：

- **Brands**：多选。必须包含 `Estée Lauder`，另外可放 `La Mer` `MAC` `Clinique` `Jo Malone London` 等 ELC 系品牌作陪衬（写死数据）
- **Category**：Fragrance / Skincare / Makeup / Gifting
- **Source**（数据源标签，会议共识）：
  - `Estée Lauder Archive`：雅诗兰黛历史做过的货（入库）
  - `External Picks`：外部推荐品类
- 两个数据源共用同一套列表，只靠 Source / Brand 区分，不拆两个页面

默认选中：`Brand = Estée Lauder` + `Source = Estée Lauder Archive`，进页就能看到「做过的货」。

### 4.2 Estée Lauder Archive（做过的货入库）

单独做一套写死数据，例如 8–12 个 SKU，字段用英文：

- name, brand (`Estée Lauder`), category
- image
- source: `archive`
- year / campaign（如 `2023 CNY Gift Set`）
- notes：当时送给谁、场景（英文一句话）

这就是「雅诗兰黛历史产品库」。外部推荐用另一组 `source: external` 数据。

### 4.3 列表

- 常规电商网格：图 + 英文名 + 品牌 + Source badge
- 点卡片进详情弹窗，可 Add to RFQ
- 筛选入口可以是页内常驻条，不必再做侧边浮动；首页那侧边浮动是另一条入口，不要重复发明两套筛选 UI

---

## 5. 排行榜页 `/ranking`（布局仿 Fluxa 登录页）

独立页，不再只是首页里的一块。  
**页面骨架抄本地 Fluxa 登录页**（`/Users/cj/Documents/personal/project/fluxa/src/app/auth/page.tsx`），中间那张卡换成堆叠排行榜，而不是登录表单。

Fluxa 登录页结构（要搬到排行榜的）：

- 全屏：`min-h-screen flex items-center justify-center`
- 背后一层氛围背景（Fluxa 是 aurora；这里改成象牙底 + 极淡 EL Gold 径向光，**不要紫青**）
- 上方居中：Logo + 大标题 + 一句副标题
- 中间一块玻璃卡：`backdrop-blur-xl`、半透明、视觉焦点

对应到本页：

```
全屏象牙底 + 极淡金色光晕          ← 仿 Fluxa aurora 层
        │
        ▼
  ESTÉE LAUDER                    ← 英文 Logo，居中
  Ranking                         ← 大标题
  Fragrance Gift Sets · This Season
        │
        ▼
  居中舞台（玻璃卡 / 大画布）
    同一品类图片错层堆叠（杯子或香氛礼盒）
    第 1 名最大、EL Gold 边
    点某一名，该图抬到最前（Motion layout）
        │
        ▼
  下方或卡内底部：4–10 名缩略图 + Number Ticker
  Search heat / Case clicks / Public purchase volume
```

不从 Fluxa 搬的：表单、Google OAuth、主题切换、紫色 gradient、Fluxa Logo。

这页同时覆盖亢总待办：先用杯子素材做出堆叠效果，截图确认。不接真实数据。

---

## 6. 英文 UI 文案底稿（先定这些）

| 中文原意 | 英文 |
|---|---|
| 登录 | Sign in |
| 首页 | Home |
| 品类专区 | Products（`/categories`）；只看历史库时顶栏是 Archive |
| 排行榜 | Ranking |
| 购物车 / 询价 | RFQ List（路由 `/rfq`，不要写成 Cart） |
| 品牌 | Brands |
| 品类 | Category |
| 雅诗兰黛历史库 | Estée Lauder Archive |
| 外部推荐 | External Picks |
| 加入购物车 | Add to RFQ |
| 导出询价邮件 | Export RFQ |
| 问 AI | Ask |
| 案例 | Stories |
| 产品 | Products |

AI 预设问题也用英文，例如：

- `What did we gift APAC VIPs last CNY?`
- `Show Estée Lauder archive sets under $200`
- `Rank fragrance gifts by search heat`

---

## 7. 明确不做

- 中文 UI / 中英切换
- 通用品牌墙登录
- 多品牌 Logo 墙
- 真实登录、ERP、库存
- 移动端
- 随机提问的全量 AI
- 个人中心、历史咨询
