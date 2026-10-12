# 数据结构与种子数据

> 本文件定义所有写死数据的**类型、种子内容、计算规则和状态**。
> 页面和 AI 剧本里出现的数字都从这里来；**数值冲突时以本文件为准**。
>
> ⚠️ 种子数据是虚构的，用来让开发不被素材卡住：
> - **Archive 部分必须换成古德真实做过的 ELC 项目**，或者在演示里明确说是示意数据。不能让 EL 的人看到"我们没做过"的东西
> - 换数据时**保留 id 和 §7 列出的数字**，或者同步修改 AI_SCRIPT.md / DEMO_SCRIPT.md

---

## 1. 文件与约定

```
web/src/
  config/brand.ts                 # 品牌配置（§2）
  lib/types.ts                    # 类型（§3）
  lib/pricing.ts  lib/dates.ts    # 计算（§5）
  lib/filters.ts                  # 筛选与 URL（§5）
  lib/rfq-email.ts                # 邮件模板（§8）
  stores/rfq.ts  chat.ts  ui.ts   # 状态（§6）
  data/index.ts                   # 按 brand.dataDir 导出当前客户的数据
  data/estee-lauder/
    dictionaries.ts               # 品牌、场景、品类、地区（§4.1）
    products.ts                   # 24 个商品（§4.2）
    cases.ts                      # 20 个案例（§4.3）
    ranking.ts                    # 排行（§4.4）
    chat-script.ts                # AI 剧本（见 AI_SCRIPT.md §7）
    consistency.test.ts           # 一致性测试（§7）
```

约定：

- 所有用户可见文字只用英文；货币统一 **USD**
- 日期一律用 `'YYYY-MM-DD'` 字符串，按 **UTC** 计算和格式化（会议在西雅图，演示机可能在别的时区，不按 UTC 会差一天）
- id 一旦确定不再修改：`arc-001`…`arc-012`、`ext-001`…`ext-012`、`case-01`…`case-20`、`rk-01`…`rk-10`
- 图片在 `web/public/demo/`，路径是：
  - 商品：`/demo/products/<id>/01.jpg`
  - 案例：`/demo/cases/<id>/cover.jpg`、`/demo/cases/<id>/01.jpg`、`/demo/cases/<id>/items/01.jpg`
  - 排行：`/demo/ranking/drinkware/<id>.jpg`
  - `web/src/lib/demo-images.ts` 的名单里没有的路径，显示 PlaceholderImage。不要再写到 `/images/`

---

## 2. 品牌配置

换客户只改这个文件和 `data/<客户>/`，组件里不允许写死 "Estée Lauder"。

```ts
// web/src/config/brand.ts
export const brand = {
  id: 'estee-lauder',
  dataDir: 'estee-lauder',
  wordmark: 'Estée Lauder',             // CSS uppercase 显示为 ESTÉE LAUDER
  logoSrc: null as string | null,       // 有官方 SVG 后填 '/brand/estee-lauder-wordmark.svg'
  productName: 'Product Intelligence',  // 登录页副标题。Home 眉标目前写死同一句，不读这个字段
  poweredBy: 'GoodFlow',
  user: {
    name: 'Anna Chen',
    initials: 'AC',
    title: 'Gifting & Procurement, Estée Lauder APAC',
    email: 'buyer@esteelauder.com',
    password: 'demo',
  },
  rfq: {
    to: 'sales@goodflow.example',       // 待确认：可用设计稿登录页页脚的古德邮箱
    defaultNeededBy: '2027-01-15',
    defaultRegion: 'APAC' as const,
    currency: 'USD' as const,
  },
  demoToday: '2026-10-20',              // "今天"固定，所有相对日期按它算，演示结果不随真实日期变化
  advisor: { name: 'GoodFlow', engine: 'script' as 'script' | 'model' }, // 面板标题用 GoodFlow，不是 Gift Advisor
} as const
```

---

## 3. 类型

```ts
// web/src/lib/types.ts
export type BrandId = 'estee-lauder' | 'la-mer' | 'mac' | 'clinique' | 'jo-malone-london'
export type OccasionId = 'lunar-new-year' | 'holiday' | 'vip' | 'launch' | 'employee'
export type CategoryId = 'drinkware' | 'home-scent' | 'beauty-accessories' | 'textiles' | 'stationery' | 'festive'
export type Region = 'APAC' | 'EMEA' | 'Americas' | 'Global'
export type Source = 'archive' | 'external'
export type ShippingTerms = 'EXW' | 'FOB' | 'DAP'

export type PriceTier = { moq: number; unitPrice: number; leadTimeDays: number }

type ProductBase = {
  id: string
  name: string
  brands: BrandId[]         // archive：为哪个品牌做的（1 个）；external：推荐给哪些品牌（1 个以上）
  category: CategoryId
  occasions: OccasionId[]   // 第一个是主场景，用于眉标
  year: number              // archive：活动年份；external：入库年份
  images: string[]          // 1:1，第一张是封面
  inspiration?: string
  material: string
  packaging: string
  size: string
  priceTiers: PriceTier[]   // 3 档，按 moq 升序
  clicks: number            // 排序 "Most clicked" 用
  featured?: boolean
}

export type ArchiveProduct = ProductBase & {
  source: 'archive'
  campaign: string          // 'Lunar New Year 2026 · APAC VIP'
  regions: Region[]
  notes: string             // 当时送给谁、什么场景，一句话
}

export type ExternalProduct = ProductBase & {
  source: 'external'
  maker: string             // 'Kiln & Co.'
}

export type Product = ArchiveProduct | ExternalProduct

export type CaseItem = { name: string; spec: string; image: string }

export type Case = {
  id: string
  title: string             // 句首大写，句号结尾，≤ 48 字符；卡片上 CSS 转大写
  client: string            // 'Estée Lauder · Greater China' / 'Heritage museum IP'
  kind: 'elc' | 'industry' | 'ip'
  occasions: OccasionId[]
  year: number
  region: Region
  cover: string
  coverAspect: '3/4' | '4/5' | '1/1' | '4/3'
  images: string[]          // 3–5 张，16:10
  description: string       // 2–3 句
  takeaway: string          // WHY IT WORKED，1–2 句
  items: CaseItem[]         // 4–8 个
  featured?: boolean
}

export type RankingMetric = 'searchHeat' | 'caseClicks' | 'purchaseVolume'

export type RankingItem = {
  id: string
  name: string
  image: string             // 4:5
  productId?: string        // 有的话点击打开 ProductDialog
  metrics: Record<RankingMetric, number>
  searchHeatPrevRank: number | null   // 上期名次；null = NEW
}

export type RankingBoard = {
  id: 'drinkware' | 'home-scent'
  label: string
  period: string            // 'Jul–Sep 2026'
  items: RankingItem[]      // 10 个；名次按指标实时排序，不写死
}

export type RfqLine = {
  productId: string
  qty: number
  terms: ShippingTerms
  selected: boolean
  addedAt: number
}
```

---

## 4. 种子数据

### 4.1 字典

```ts
// web/src/data/estee-lauder/dictionaries.ts
export const BRANDS = [
  { id: 'estee-lauder', label: 'Estée Lauder' },
  { id: 'la-mer', label: 'La Mer' },
  { id: 'mac', label: 'MAC' },
  { id: 'clinique', label: 'Clinique' },
  { id: 'jo-malone-london', label: 'Jo Malone London' },
] as const

export const OCCASIONS = [
  { id: 'lunar-new-year', label: 'Lunar New Year', short: 'LNY' },
  { id: 'holiday', label: 'Holiday Season', short: 'Holiday' },
  { id: 'vip', label: 'VIP Gifting', short: 'VIP' },
  { id: 'launch', label: 'Launch Events', short: 'Launch' },
  { id: 'employee', label: 'Employee Gifts', short: 'Employee' },
] as const

export const CATEGORIES = [
  { id: 'drinkware', label: 'Drinkware' },
  { id: 'home-scent', label: 'Home & Scent' },
  { id: 'beauty-accessories', label: 'Beauty Accessories' },
  { id: 'textiles', label: 'Textiles & Bags' },
  { id: 'stationery', label: 'Stationery' },
  { id: 'festive', label: 'Festive & Packaging' },
] as const

export const PRICE_OPTIONS = [
  { value: null, label: 'Any' },
  { value: 20, label: 'Under $20' },
  { value: 60, label: 'Under $60' },
  { value: 120, label: 'Under $120' },
] as const
```

- 用 **Lunar New Year**，不用 CNY：这是 EL 官方和海外团队的说法
- 品类是**礼品品类**，不是 EL 自己的产品线（Fragrance / Skincare / Makeup）

### 4.2 商品（24 个）

★ = AI 剧本或演示脚本直接引用，**数字不能改**（见 §7）。

**完整写法示例**：

```ts
// web/src/data/estee-lauder/products.ts
export const PRODUCTS: Product[] = [
  {
    id: 'arc-001',
    source: 'archive',
    name: 'Year of the Horse Lacquer Trunk',
    brands: ['estee-lauder'],
    category: 'beauty-accessories',
    occasions: ['lunar-new-year', 'vip'],
    year: 2026,
    campaign: 'Lunar New Year 2026 · APAC VIP',
    regions: ['APAC'],
    notes:
      'Sent to top-tier VIPs in Greater China with the Advanced Night Repair Lunar New Year set; the most-clicked archive item of the season.',
    inspiration: 'Red lacquer and a gold-leaf horse, echoing the Lunar New Year 2026 key visual.',
    material: 'Lacquered MDF, brass hardware, velvet lining',
    packaging: 'Rigid gift box with gold-foil sleeve',
    size: '24 × 16 × 12 cm',
    images: ['/images/products/arc-001/01.png', '/images/products/arc-001/02.png', '/images/products/arc-001/03.png'],
    priceTiers: [
      { moq: 3000, unitPrice: 38, leadTimeDays: 70 },
      { moq: 10000, unitPrice: 33, leadTimeDays: 80 },
      { moq: 30000, unitPrice: 29, leadTimeDays: 95 },
    ],
    clicks: 3920,
    featured: true,
  },
  {
    id: 'ext-005',
    source: 'external',
    name: 'Year of the Goat Porcelain Tea Set',
    maker: 'Kiln & Co.',
    brands: ['estee-lauder', 'la-mer'],
    category: 'drinkware',
    occasions: ['lunar-new-year', 'vip'],
    year: 2026,
    inspiration: 'A hand-painted goat in gold on white porcelain — quiet enough for a vanity, festive enough for the season.',
    material: 'Porcelain, hand-painted gold',
    packaging: 'Lacquer-finish box with insert',
    size: 'Teapot 400 ml + 4 cups',
    images: ['/images/products/ext-005/01.png', '/images/products/ext-005/02.png'],
    priceTiers: [
      { moq: 500, unitPrice: 56, leadTimeDays: 75 },
      { moq: 2000, unitPrice: 49, leadTimeDays: 85 },
      { moq: 5000, unitPrice: 44, leadTimeDays: 95 },
    ],
    clicks: 1390,
  },
  // …其余按下表
]
```

**Estée Lauder Archive（12 个，其中 Estée Lauder 7 个）**

| id | name | brand | category | occasions | year · campaign | regions | notes | material / packaging / size | 阶梯价：MOQ · 单价 · 交期 | clicks | featured |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ★arc-001 | Year of the Horse Lacquer Trunk | estee-lauder | beauty-accessories | lunar-new-year, vip | 2026 · Lunar New Year 2026 · APAC VIP | APAC | （见上方示例） | 见示例 | 3,000 · $38.00 · 70d ／ 10,000 · $33.00 · 80d ／ 30,000 · $29.00 · 95d | 3,920 | ✓ |
| ★arc-002 | Gilded Horse Compact Mirror | la-mer | beauty-accessories | lunar-new-year, vip | 2026 · Lunar New Year 2026 · VIP Renewal | APAC | Sent with La Mer VIP renewal kits in Korea and Japan. | Zinc alloy, gold plating, glass / Velvet pouch in a printed box / Ø 7.5 cm | 3,000 · $24.00 · 60d ／ 10,000 · $20.50 · 70d ／ 30,000 · $18.00 · 85d | 2,780 | ✓ |
| ★arc-003 | Silk Red Envelope Set | estee-lauder | festive | lunar-new-year, vip | 2026 · Lunar New Year 2026 · APAC Counters | APAC | Six embroidered silk envelopes in a magnetic box, used in VIP boxes and as a gift-with-purchase across APAC counters. | Silk, gold-thread embroidery / Magnetic paperboard box / 17 × 9 cm, set of 6 | 5,000 · $9.50 · 45d ／ 20,000 · $8.20 · 55d ／ 50,000 · $7.10 · 70d | 2,610 | |
| ★arc-004 | Holiday Velvet Vanity Pouch | estee-lauder | textiles | holiday | 2025 · Holiday 2025 · Gift with Purchase | EMEA, Americas | Midnight-blue velvet pouch for the Advanced Night Repair holiday set. | Cotton velvet, satin lining / Polybag in carton / 20 × 14 × 6 cm | 10,000 · $4.80 · 50d ／ 30,000 · $4.10 · 60d ／ 100,000 · $3.40 · 75d | 1,880 | ✓ |
| ★arc-005 | Midnight Ceramic Candle | jo-malone-london | home-scent | holiday, vip | 2025 · Holiday 2025 · London VIP Dinner | EMEA | Hand-glazed vessel for Jo Malone London's VIP dinner in London. | Hand-glazed ceramic, soy wax / Rigid box with ribbon / Ø 9 × 10 cm, 220 g | 1,000 · $26.00 · 55d ／ 3,000 · $22.50 · 65d ／ 10,000 · $19.00 · 80d | 1,450 | ✓ |
| arc-006 | Night Repair Media Kit Box | estee-lauder | festive | launch | 2025 · Launch Events 2025 · Media Kit | Global | Magnetic midnight-blue box for the 2025 serum relaunch, sent to 1,200 editors and creators worldwide. | FSC paperboard, magnetic closure, EVA insert / Shipper carton / 30 × 22 × 8 cm | 1,000 · $14.00 · 40d ／ 5,000 · $11.50 · 50d ／ 20,000 · $9.80 · 60d | 1,270 | |
| arc-007 | Year of the Snake Lipstick Charm | mac | beauty-accessories | lunar-new-year | 2025 · Lunar New Year 2025 · Gift with Purchase | APAC | Enamel snake charm clipped to lipstick cases for the Year of the Snake gift-with-purchase in Greater China and Southeast Asia. | Zinc alloy, enamel / Backing card in polybag / 4 × 3 cm | 10,000 · $3.20 · 45d ／ 30,000 · $2.70 · 55d ／ 100,000 · $2.20 · 70d | 1,130 | |
| arc-008 | Wellness Week Tote Kit | clinique | textiles | employee | 2025 · Employee Gifts 2025 · Wellness Week | Americas | Canvas tote with a bottle and towel for 4,000 employees during Wellness Week. | Organic cotton canvas, stainless steel / Kraft mailer box / 38 × 40 cm tote | 2,000 · $18.00 · 40d ／ 5,000 · $15.50 · 50d ／ 20,000 · $13.00 · 60d | 640 | |
| arc-009 | Pearl Moon Jewelry Dish | estee-lauder | home-scent | vip | 2025 · Mid-Autumn 2025 · APAC VIP | APAC | Porcelain dish with a pearl-glaze moon, paired with mooncakes for VIP clients in Hong Kong and Singapore. | Porcelain, pearl glaze / Rigid box with foam insert / Ø 12 cm | 2,000 · $16.00 · 50d ／ 5,000 · $13.80 · 60d ／ 20,000 · $11.50 · 75d | 980 | |
| arc-010 | Year of the Snake Porcelain Cup Pair | estee-lauder | drinkware | lunar-new-year, vip | 2025 · Lunar New Year 2025 · APAC VIP | APAC | A pair of gold-rim porcelain cups for VIP tea ceremonies at flagship counters in Shanghai and Taipei. | Bone china, 24k gold rim / Lacquer-finish box / 150 ml × 2 | 2,000 · $21.00 · 60d ／ 5,000 · $18.20 · 70d ／ 20,000 · $15.60 · 85d | 1,560 | |
| ★arc-011 | Gold-Foil Notebook Set | estee-lauder | stationery | holiday, launch | 2024 · Holiday 2024 · Paris Press Preview | EMEA | Two gold-foil notebooks and a brass pen for the Holiday 2024 press preview in Paris; still the most re-requested media gift. | Cotton paper, brass / Slipcase / A5 × 2 + pen | 1,000 · $12.00 · 35d ／ 5,000 · $9.60 · 45d ／ 20,000 · $8.10 · 60d | 2,030 | ✓ |
| arc-012 | Ocean Linen Tote | la-mer | textiles | launch | 2025 · Launch Events 2025 · Seoul Pop-up | APAC | Sea-washed linen tote for guests at the Seoul flagship pop-up. | Washed linen, cotton webbing / Tissue wrap in mailer / 42 × 36 cm | 2,000 · $11.00 · 40d ／ 5,000 · $9.40 · 50d ／ 20,000 · $8.00 · 60d | 870 | |

**External Picks（12 个）**

| id | name | maker | brands（推荐给） | category | occasions | year | material / packaging / size | 阶梯价：MOQ · 单价 · 交期 | clicks |
|---|---|---|---|---|---|---|---|---|---|
| ext-001 | Gold-Leaf Lantern Diffuser | Hearth Studio | estee-lauder, jo-malone-london | home-scent | lunar-new-year, vip | 2026 | Ceramic, gold leaf, rattan reeds / Rigid box / Ø 10 × 14 cm, 150 ml | 1,000 · $48.00 · 55d ／ 3,000 · $42.00 · 65d ／ 10,000 · $37.00 · 80d | 1,240 |
| ★ext-002 | Cloud-Wool Throw Blanket | Northloom | estee-lauder, la-mer | textiles | vip, lunar-new-year, holiday | 2026 | Merino wool blend / Fabric bag in rigid box / 130 × 170 cm | 1,000 · $42.00 · 60d ／ 3,000 · $37.50 · 70d ／ 10,000 · $33.00 · 85d | 1,680 |
| ext-003 | Refillable Glass Atomizer | Vessel Lab | estee-lauder, jo-malone-london | beauty-accessories | vip, launch | 2025 | Glass, aluminum / Paper tube / 10 ml | 3,000 · $7.80 · 40d ／ 10,000 · $6.40 · 50d ／ 30,000 · $5.30 · 65d | 920 |
| ext-004 | Vegan Leather Travel Kit | Fieldnote | estee-lauder, clinique, mac | textiles | employee, vip | 2025 | Plant-based leather, recycled lining / Kraft box / 22 × 14 × 8 cm | 2,000 · $14.50 · 45d ／ 5,000 · $12.80 · 55d ／ 20,000 · $10.90 · 70d | 1,050 |
| ★ext-005 | Year of the Goat Porcelain Tea Set | Kiln & Co. | estee-lauder, la-mer | drinkware | lunar-new-year, vip | 2026 | 见示例 | 500 · $56.00 · 75d ／ 2,000 · $49.00 · 85d ／ 5,000 · $44.00 · 95d | 1,390 |
| ext-006 | 2027 Recycled Paper Desk Calendar | Paperhouse | estee-lauder, clinique | stationery | employee, holiday | 2026 | Recycled paper, soy ink / Paper sleeve / 21 × 15 cm | 3,000 · $6.20 · 35d ／ 10,000 · $4.90 · 45d ／ 30,000 · $4.10 · 55d | 610 |
| ★ext-007 | Glass Straw Cup 500ml | Clearline | estee-lauder, clinique | drinkware | launch, employee | 2026 | Borosilicate glass, bamboo lid, glass straw / Kraft box / 500 ml | 3,000 · $6.80 · 35d ／ 10,000 · $5.60 · 45d ／ 30,000 · $4.70 · 60d | 4,120 |
| ★ext-008 | Double-Wall Ceramic Tumbler | Kiln & Co. | estee-lauder, mac | drinkware | lunar-new-year, employee, launch | 2026 | Double-wall ceramic, available in red glaze / Kraft box / 380 ml | 3,000 · $9.90 · 45d ／ 10,000 · $8.40 · 55d ／ 30,000 · $7.20 · 70d | 4,860 |
| ★ext-009 | Insulated Travel Cup 350ml | Tidewell | clinique, mac | drinkware | employee | 2025 | 316 stainless steel, leak-proof lid / Color box / 350 ml | 5,000 · $7.40 · 40d ／ 20,000 · $6.10 · 50d ／ 50,000 · $5.20 · 65d | 1,960 |
| ★ext-010 | Smart Temperature Bottle | Tidewell | estee-lauder, la-mer | drinkware | vip, launch | 2026 | Stainless steel, LED temperature cap / Rigid box / 450 ml | 2,000 · $18.50 · 50d ／ 5,000 · $16.20 · 60d ／ 20,000 · $14.00 · 75d | 3,010 |
| ext-011 | Silk Sleep Set | Atelier Rouge | estee-lauder, la-mer | textiles | vip, holiday | 2026 | Mulberry silk, 22 momme / Rigid box with ribbon / Eye mask + pillowcase 50 × 75 cm | 1,000 · $28.00 · 50d ／ 3,000 · $24.50 · 60d ／ 10,000 · $21.00 · 75d | 1,170 |
| ext-012 | Gold-Foil Red Envelope Box | Paperhouse | estee-lauder, mac, clinique | festive | lunar-new-year | 2026 | Specialty paper, gold foil / Shrink-wrapped / 9 × 17 cm, set of 8 | 5,000 · $3.60 · 30d ／ 20,000 · $2.90 · 40d ／ 50,000 · $2.40 · 50d | 830 |

设计约束：

- 每个品牌 × 每个 Source 至少 1 个商品，任何单选筛选都不会出现空结果
- 4 个上榜商品（ext-007 / 008 / 009 / 010）的 `clicks` 和排行榜的 `caseClicks` 相同
- 默认视图（Brand = Estée Lauder，Source = Archive）按 Featured 排序时，arc-001 在第一个

### 4.3 案例（20 个）

**完整写法示例**：

```ts
// web/src/data/estee-lauder/cases.ts
export const CASES: Case[] = [
  {
    id: 'case-01',
    title: 'A golden horse gallops into the New Year.',
    client: 'Heritage museum IP',
    kind: 'ip',
    occasions: ['lunar-new-year'],
    year: 2026,
    region: 'APAC',
    cover: '/images/cases/case-01/cover.jpg',
    coverAspect: '3/4',
    images: ['/images/cases/case-01/01.jpg', '/images/cases/case-01/02.jpg', '/images/cases/case-01/03.jpg', '/images/cases/case-01/04.jpg'],
    description:
      "A Lunar New Year 2026 collection built around a gilded horse from the museum's bronze collection. A desk ornament, lacquer packaging and embroidered red envelopes were sold in limited runs across Greater China.",
    takeaway:
      'It turned a heritage motif into objects people display, not discard. The ornament stayed on desks long after the holiday, keeping the brand in view for months.',
    items: [
      { name: 'Gilded Horse Ornament', spec: 'Zinc alloy, gold plating · 9 × 7 cm', image: '/images/cases/case-01/items/01.png' },
      { name: 'Red Lacquer Gift Box', spec: 'Lacquered paperboard · 22 × 22 × 8 cm', image: '/images/cases/case-01/items/02.png' },
      { name: 'Embroidered Red Envelopes', spec: 'Silk · set of 6', image: '/images/cases/case-01/items/03.png' },
      { name: 'Gold-Foil Greeting Card', spec: 'Cotton paper · A6', image: '/images/cases/case-01/items/04.png' },
    ],
    featured: true,
  },
  // …其余按下表
]
```

**20 个案例的槽位**（标题和客户是占位，业务侧按 ASSETS_SPEC.md 换成真实案例；**保持场景分布**）

| id | title（占位） | client（占位） | kind | occasions | year | aspect | featured |
|---|---|---|---|---|---|---|---|
| case-01 | A golden horse gallops into the New Year. | Heritage museum IP | ip | lunar-new-year | 2026 | 3/4 | ✓ |
| case-02 | Night repair, day-long glow. | Estée Lauder · Global | elc | launch | 2025 | 4/5 | ✓ |
| case-03 | Sea, salt and a linen tote. | La Mer · Seoul | elc | launch | 2025 | 1/1 | |
| case-04 | The Year of the Snake, in porcelain. | Estée Lauder · Greater China | elc | lunar-new-year, vip | 2025 | 4/5 | ✓ |
| case-05 | A candlelit evening in London. | Jo Malone London · UK | elc | holiday, vip | 2025 | 3/4 | ✓ |
| case-06 | Wellness Week, packed to go. | Clinique · North America | elc | employee | 2025 | 4/3 | |
| case-07 | Lipstick, but make it a charm. | MAC · Southeast Asia | elc | lunar-new-year | 2025 | 1/1 | |
| case-08 | Gold foil for the front row. | Estée Lauder · Paris | elc | holiday, launch | 2024 | 4/5 | |
| case-09 | Red envelopes worth keeping. | Luxury department store | industry | lunar-new-year | 2026 | 4/5 | |
| case-10 | A spa day in a box. | Five-star hotel spa | industry | vip | 2025 | 3/4 | |
| case-11 | When art meets the vanity. | Contemporary art museum IP | ip | vip | 2025 | 4/3 | |
| case-12 | A little bear, a big New Year. | Character IP collaboration | ip | lunar-new-year | 2026 | 3/4 | |
| case-13 | Clear glass, clear conscience. | Sustainable lifestyle brand | industry | launch | 2026 | 1/1 | |
| case-14 | Moonlight in a tin. | Premium tea house | industry | vip | 2025 | 4/5 | |
| case-15 | One tote, every free journey. | Lifestyle retailer | industry | employee | 2025 | 3/4 | |
| case-16 | A winter forest on the desk. | Boutique hotel group | industry | holiday | 2025 | 4/5 | |
| case-17 | The animated holiday. | Animation studio IP | ip | holiday | 2024 | 4/3 | |
| case-18 | Silk for a good night's sleep. | Luxury bedding brand | industry | vip | 2026 | 3/4 | |
| case-19 | Pixels and powder. | Game IP collaboration | ip | launch | 2026 | 1/1 | |
| case-20 | A garden that travels. | Botanical garden IP | ip | employee | 2025 | 4/5 | |

分布：

- ELC 7 个、行业 7 个、IP 6 个
- Lunar New Year 5 个（case-01、04、07、09、12），满足演示脚本"至少 4 个"
- 行业案例**避开美妆竞品**（欧莱雅、LVMH 美妆、资生堂、Chanel 等），除非业务侧确认可以放

排序：`featured` 优先 → `year` 降序 → `id` 升序。case-01 在 For You 和 Lunar New Year 下都排第一。

### 4.4 排行

```ts
// web/src/data/estee-lauder/ranking.ts
export const METRICS = [
  { id: 'searchHeat', label: 'Search heat', unit: 'SEARCHES' },
  { id: 'caseClicks', label: 'Case clicks', unit: 'CLICKS' },
  { id: 'purchaseVolume', label: 'Public purchase volume', unit: 'UNITS' },
] as const
```

**Drinkware · Jul–Sep 2026（P0）**

| id | name | productId | searchHeat | 上期名次 | caseClicks | purchaseVolume |
|---|---|---|---|---|---|---|
| rk-01 | ★Glass Straw Cup 500ml | ext-007 | **18,420**（#1） | 4 → ▲3 | 4,120（#2） | 154,300（#3） |
| rk-02 | ★Smart Temperature Bottle | ext-010 | 16,950（#2） | 1 → ▼1 | 3,010（#4） | 64,900（#7） |
| rk-03 | ★Double-Wall Ceramic Tumbler | ext-008 | 15,310（#3） | 3 → = | **4,860**（#1） | 131,800（#4） |
| rk-04 | ★Insulated Travel Cup 350ml | ext-009 | 13,880（#4） | 2 → ▼2 | 1,960（#7） | **212,000**（#1） |
| rk-05 | ★Matte Stoneware Mug | — | 11,240（#5） | 5 → = | 2,240（#6） | 186,500（#2） |
| rk-06 | Bamboo Lid Glass Tumbler | — | 9,870（#6） | 9 → ▲3 | 3,540（#3） | 41,300（#9） |
| rk-07 | Portable Cold Brew Bottle | — | 8,650（#7） | NEW | 2,680（#5） | 23,700（#10） |
| rk-08 | Collapsible Silicone Cup | — | 7,420（#8） | 6 → ▼2 | 860（#10） | 87,200（#6） |
| rk-09 | Enamel Camping Mug | — | 6,180（#9） | 7 → ▼2 | 1,180（#9） | 98,400（#5） |
| rk-10 | Frosted Glass Coffee Cup | — | 5,030（#10） | 8 → ▼2 | 1,520（#8） | 52,600（#8） |

- 各指标内没有并列；名次在代码里按指标降序计算
- "上期名次"只在 Search heat 视图显示（`searchHeatPrevRank`）。显示规则：上升 ▲n，下降 ▼n，不变 `=`，`null` 显示 NEW

**Trending searches**（P1，关键词带）：

`glass straw cup` · `year of the goat` · `red lacquer` · `eco packaging` · `smart bottle` · `silk pouch` · `refillable` · `ceramic tumbler` · `gold foil` · `travel kit`

**Forecast · Q1 2027**（P1）：

| 状态 | 主题 | 一句话 |
|---|---|---|
| RISING | Clear glass drinkware | Search heat +38% quarter over quarter, led by launch events. |
| STEADY | Insulated travel cups | Still the volume leader for employee gifting. |
| COOLING | Plastic tumblers | Down 21% as briefs move to glass and ceramic. |

**Home & Scent**（P1）：结构相同，10 个条目，素材到了再补。

---

## 5. 计算与筛选规则

### 5.1 价格与日期

```ts
// web/src/lib/pricing.ts
export const tierFor = (p: Product, qty: number) =>
  [...p.priceTiers].reverse().find((t) => qty >= t.moq) ?? p.priceTiers[0]
export const nextTier = (p: Product, qty: number) => p.priceTiers.find((t) => t.moq > qty) // 没有更高档时返回 undefined
export const fromPrice = (p: Product) => p.priceTiers[0].unitPrice                       // 卡片 "From $38.00"
export const lineTotal = (p: Product, qty: number) => qty * tierFor(p, qty).unitPrice

// web/src/lib/dates.ts（全部按 UTC）
export const addDays = (iso: string, days: number) => {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}
export const orderBy = (neededBy: string, leadDays: number) => addDays(neededBy, -leadDays)
export const daysUntil = (iso: string, today = brand.demoToday) =>
  Math.round((Date.parse(iso) - Date.parse(today)) / 86_400_000)
export const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
export const money = (n: number, digits: 0 | 2 = 2) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: digits, maximumFractionDigits: digits })
```

规则：

- **数量**：最小值 = 第一档 MOQ；步进 500；可以直接输入，失焦时把小于最小值的数修正为最小值
- **单价**：取 `qty ≥ moq` 的最高一档
- **交期**：取当前档的 `leadTimeDays`，按日历天计算
- **最晚下单日**：`Needed by − 交期`。询价单用所有选中行里交期最长的一行
- **金额显示**：单价 2 位小数（`$38.00`）；小计和总额 0 位小数（`$231,500`）
- **运输条款**（EXW / FOB / DAP）：只记录，不影响 Demo 价格，邮件里写明 "terms affect final quote"

### 5.2 Categories 筛选

| 组 | 匹配 | 组内 | 组间 |
|---|---|---|---|
| Source | `all` / `archive` / `external` | 单选 | AND |
| Brands | `product.brands` 和已选有交集 | OR | AND |
| Category | `product.category` 在已选里 | OR | AND |
| Occasion | `product.occasions` 和已选有交集 | OR | AND |
| Price | `fromPrice(p) <= maxPrice` | 单选 | AND |
| q（P1） | name / maker / campaign 包含关键词，不区分大小写 | — | AND |

- **数量角标**：某个选项的数量 = 其他组条件不变、本组只选这一项时的结果数
- **排序**：
  - Featured：`featured` 优先，再按 `clicks` 降序
  - Newest：`year` 降序，再按 `clicks` 降序
  - Price: low to high：`fromPrice` 升序
  - Most clicked：`clicks` 降序

### 5.3 URL 参数

| 页面 | 参数 | 值 |
|---|---|---|
| `/categories` | `source` | `all` \| `archive` \| `external` |
| | `brand` `category` `occasion` | 逗号分隔的 id |
| | `maxPrice` | `20` \| `60` \| `120` |
| | `q` `sort` | 字符串 / `featured` \| `newest` \| `price-asc` \| `clicks` |
| `/ranking` | `board` `metric` | `drinkware` / `searchHeat` \| `caseClicks` \| `purchaseVolume` |
| `/rfq` | `export=1` | 自动打开导出弹窗，打开后从 URL 去掉 |
| 任意页 | `reset=1` | 清空询价单和对话，执行后从 URL 去掉 |

默认值规则：

- `/categories` **没有任何参数**时，使用默认值 `source=archive&brand=estee-lauder`
- **只要有任意一个参数**，没写的组就不筛选。AI 和首页的深链都靠这条规则
- `Clear all` 清空 Brands / Category / Occasion / Price，保留 Source
- 改筛选时用 `router.replace`，不产生历史记录，返回键不会一格一格回退

用到的深链（全部可以直接打开）：

| 来源 | 链接 | 结果数 |
|---|---|---|
| 首页 `View Estée Lauder Archive` | `/categories` | 7 |
| A1 `Open in Categories` | `/categories?source=archive&occasion=lunar-new-year` | 5 |
| A3 `Open in Categories` | `/categories?source=archive&occasion=holiday` | 3 |
| B1 `Open in Categories` | `/categories?source=all&occasion=lunar-new-year&maxPrice=60` | 10 |

---

## 6. 状态（zustand）

```ts
// web/src/stores/rfq.ts — persist 到 localStorage，key 'gf:el:rfq:v1'
type RfqState = {
  lines: RfqLine[]
  project: string                 // 默认 ''
  neededBy: string                // 默认 brand.rfq.defaultNeededBy
  region: Region                  // 默认 brand.rfq.defaultRegion
  notes: string
  add: (ids: string[], opts?: { project?: string; notes?: string }) => { added: number; skipped: number }
  update: (id: string, patch: Partial<Pick<RfqLine, 'qty' | 'terms' | 'selected'>>) => void
  remove: (id: string) => void
  setMeta: (patch: Partial<Pick<RfqState, 'project' | 'neededBy' | 'region' | 'notes'>>) => void
  reset: () => void
}
// add()：已在询价单里的跳过；新加入的 qty = 第一档 MOQ，terms = 'EXW'，selected = true
// opts.project / opts.notes 只在对应字段为空时写入

// web/src/stores/chat.ts — persist 到 sessionStorage，key 'gf:el:chat:v1'，只存 status = 'done' 的消息和 open
type ChatState = {
  open: boolean
  messages: ChatMessage[]         // 类型见 AI_SCRIPT.md §6
  streamingId: string | null
  setOpen: (open: boolean) => void
  send: (text: string, opts?: { forceTurnId?: string; productId?: string; caseId?: string }) => Promise<void>
  skip: () => void                // 当前回复立即输出完
  reset: () => void
}

// web/src/stores/ui.ts — 不持久化
type UiState = {
  productId: string | null        // 全局 ProductDialog，AI 面板、排行、网格都调用它
  caseId: string | null           // 全局 CaseDialog
  openProduct: (id: string) => void
  openCase: (id: string) => void
  close: () => void
}

// selectors
export const rfqSummary = (lines: RfqLine[]) => {
  const sel = lines.filter((l) => l.selected)
  const leads = sel.map((l) => ({ days: tierFor(product(l.productId), l.qty).leadTimeDays, productId: l.productId }))
  return {
    count: sel.length,
    totalQty: sel.reduce((s, l) => s + l.qty, 0),
    total: sel.reduce((s, l) => s + lineTotal(product(l.productId), l.qty), 0),
    maxLead: leads.sort((a, b) => b.days - a.days)[0] ?? { days: 0, productId: '' },
  }
}
```

注意事项：

- **水合**：persist 用 `skipHydration: true`，在 root layout 的 `<StoreHydrator>` 里调用 `rehydrate()`。顶栏角标在水合完成前不渲染，否则静态导出页面会报 hydration mismatch
- **重置**：任意页带 `?reset=1`，或头像菜单点 `Reset demo` → `rfq.reset()` + `chat.reset()` → `router.replace(pathname)`
- **登录**：不做路由守卫。`/login` 是演示入口；Sign out 回到 `/login`

---

## 7. 一致性核对清单

改了 §4 的任何数据，先跑 `pnpm test`。下面这些数字出现在其他文档里，必须一致：

| 出现在 | 内容 | 依赖的数据 |
|---|---|---|
| DEMO Step 4、UI_SPEC §4.5、剧本 D1 | Lacquer Trunk 3,000 件 × $38.00 = $114,000；交期 70 天 → Order by **Nov 6, 2026** | arc-001 第 1 档 |
| DEMO Step 6、UI_SPEC §4.5 | 10,000 件以上 $33.00；交期 80 天 → **Oct 27, 2026**；总额 **$447,500** | arc-001 第 2 档 |
| 剧本 A1 | 3 件 LNY 2026 货按 clicks 排序：Trunk → Mirror → Envelope；交期 45–70 天；MOQ 从 3,000 起 | arc-001 / 002 / 003 |
| 剧本 A3 | Holiday 档案 3 件 | arc-004 / 005 / 011 |
| 剧本 B1、B2、B3，DEMO Step 5–6，UI_SPEC §4.7 | 4 件，$38.00 / $9.50 / $42.00 / $56.00，交期 70 / 45 / 60 / 75 天；Order by **Nov 1, 2026**；总额 **$231,500** | arc-001、arc-003、ext-002、ext-005 第 1 档 |
| 剧本 B1 步骤 | `10 fit · top 4`：LNY 且单价 ≤ $60 的有 10 件，交期都早于 Jan 15, 2027 | 全部商品 |
| 剧本 C3 | $9.90 + $9.50 = **$19.40** 每盒；杯子交期 45 天 | ext-008、arc-003 |
| 剧本 C1 / C2，DEMO Step 3 | 三个指标的第 1 名依次是 Glass Straw Cup / Double-Wall Ceramic Tumbler / Insulated Travel Cup；18,420 searches ▲3；212,000 / 186,500 / 154,300 units | 排行 Drinkware |
| DEMO Step 4、UI_SPEC §4.4 | Brand = Estée Lauder + Archive = **7** 个；切到 External 不为空 | 商品 |
| DEMO Step 2 | Lunar New Year 案例 ≥ 4 个，case-01 排第一 | 案例 |

**一致性测试**（vitest）：

```ts
// web/src/data/estee-lauder/consistency.test.ts
import { describe, expect, it } from 'vitest'
import { PRODUCTS } from './products'
import { CASES } from './cases'
import { DRINKWARE } from './ranking'
import { lineTotal, tierFor } from '@/lib/pricing'
import { orderBy } from '@/lib/dates'

const p = (id: string) => PRODUCTS.find((x) => x.id === id)!
const atMoq = (id: string) => ({ id, qty: p(id).priceTiers[0].moq })
const top = (m: 'searchHeat' | 'caseClicks' | 'purchaseVolume') =>
  [...DRINKWARE.items].sort((a, b) => b.metrics[m] - a.metrics[m])[0].name

describe('demo numbers', () => {
  it('B1 basket', () => {
    const lines = ['arc-001', 'arc-003', 'ext-002', 'ext-005'].map(atMoq)
    expect(lines.reduce((s, l) => s + lineTotal(p(l.id), l.qty), 0)).toBe(231_500)
    const maxLead = Math.max(...lines.map((l) => tierFor(p(l.id), l.qty).leadTimeDays))
    expect(orderBy('2027-01-15', maxLead)).toBe('2026-11-01')
  })
  it('trunk tiers', () => {
    expect(orderBy('2027-01-15', 70)).toBe('2026-11-06')
    expect(lineTotal(p('arc-001'), 10_000)).toBe(330_000)
    expect(orderBy('2027-01-15', tierFor(p('arc-001'), 10_000).leadTimeDays)).toBe('2026-10-27')
  })
  it('C3 box price', () => {
    expect(p('ext-008').priceTiers[0].unitPrice + p('arc-003').priceTiers[0].unitPrice).toBeCloseTo(19.4)
  })
  it('default categories view', () => {
    expect(PRODUCTS.filter((x) => x.source === 'archive' && x.brands.includes('estee-lauder'))).toHaveLength(7)
    expect(PRODUCTS.filter((x) => x.source === 'external' && x.brands.includes('estee-lauder')).length).toBeGreaterThan(0)
  })
  it('B1 candidates', () => {
    const fit = PRODUCTS.filter((x) => x.occasions.includes('lunar-new-year') && x.priceTiers[0].unitPrice <= 60)
    expect(fit).toHaveLength(10)
  })
  it('ranking leaders', () => {
    expect(top('searchHeat')).toBe('Glass Straw Cup 500ml')
    expect(top('caseClicks')).toBe('Double-Wall Ceramic Tumbler')
    expect(top('purchaseVolume')).toBe('Insulated Travel Cup 350ml')
  })
  it('cases', () => {
    expect(CASES.filter((c) => c.occasions.includes('lunar-new-year')).length).toBeGreaterThanOrEqual(4)
  })
})
```

---

## 8. RFQ 邮件模板

```ts
// web/src/lib/rfq-email.ts
export function buildRfqEmail(s: RfqState): { to: string; subject: string; body: string }
```

- 只包含选中的行，顺序和询价单一致
- Subject：`RFQ — {project || 'Gift sourcing'} — {n} items`
- Archive 商品第二行写 `Archive · {campaign}`；External 写 `External Pick · {maker}`

**标准输出**（演示主线：B1 的 4 件全部按 MOQ 加入，Project 和 Notes 由 AI 自动填入；可作为快照测试的期望值）：

```
To: sales@goodflow.example
Subject: RFQ — Lunar New Year 2027 VIP Gifting — 4 items

Hi GoodFlow team,

Please quote the following items for Estée Lauder — Lunar New Year 2027 VIP Gifting.

Needed by: Jan 15, 2027 (order by Nov 1, 2026)
Delivery region: APAC

1. Year of the Horse Lacquer Trunk
   Archive · Lunar New Year 2026 · APAC VIP
   Qty 3,000 · $38.00/unit · 70-day lead time · EXW
   Subtotal: $114,000

2. Silk Red Envelope Set
   Archive · Lunar New Year 2026 · APAC Counters
   Qty 5,000 · $9.50/unit · 45-day lead time · EXW
   Subtotal: $47,500

3. Cloud-Wool Throw Blanket
   External Pick · Northloom
   Qty 1,000 · $42.00/unit · 60-day lead time · EXW
   Subtotal: $42,000

4. Year of the Goat Porcelain Tea Set
   External Pick · Kiln & Co.
   Qty 500 · $56.00/unit · 75-day lead time · EXW
   Subtotal: $28,000

Estimated total: $231,500
Pricing is indicative and based on volume tiers; shipping terms affect the final quote.

Notes: Re-run archive pieces with Year of the Goat artwork.

Best regards,
Anna Chen
Gifting & Procurement, Estée Lauder APAC
buyer@esteelauder.com
```
