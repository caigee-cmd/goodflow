# Gift Advisor（AI 面板）规格与剧本

> 原则：**像 AI，但永远不出错。**
> - 不接真实模型，全部走预设剧本
> - 但要让观众看到"它在查你们自己的数据"：工具步骤、引用、商品卡、可执行的按钮
> - 回复引擎做成可替换接口，以后接真模型不改 UI（见 §8）
>
> 依赖的数据和 id 见 [DATA_SCHEMA.md](./DATA_SCHEMA.md)，演示用法见 [DEMO_SCRIPT.md](./DEMO_SCRIPT.md)。

---

## 1. 形态

| 项 | 规格 |
|---|---|
| 位置 | 右侧停靠面板，宽 420px，在顶栏下方（`top-[72px] h-[calc(100vh-72px)]`） |
| 与页面的关系 | **推开**页面（main 加 `padding-right: 420px`），不遮挡；面板打开时页面仍可操作 |
| 名称 | `Gift Advisor` |
| 持久化 | 挂在 root layout 里，切换页面时对话不丢；状态放 zustand（见 DATA_SCHEMA.md §6） |
| 不做 | 右下角小气泡、全屏聊天页、语音、附件、模型选择、历史会话列表 |

**入口**（全部打开同一个面板）：

| 入口 | 位置 | 行为 |
|---|---|---|
| `✦ Ask` | 顶栏右侧 | 打开 / 关闭 |
| `✦ Gift Advisor` chip | Home 场景 chips 最后一个 | 打开 |
| AI 入口卡 `Ask` | Home 右栏底部 | 打开 |
| `Ask about this item` | 商品详情 | 关闭详情弹窗 → 打开面板 → 发送 D1 问题（带商品上下文） |
| `Ask about this case` | 案例详情 | 关闭详情弹窗 → 打开面板 → 发送 D2 问题（带案例上下文） |
| 浮钮 `✦ Ask`（P1） | 右下角，面板关闭时显示 | 打开 |

---

## 2. 视觉

| 区域 | 规格 |
|---|---|
| 面板 | `ivory` 底、左侧 1px `line`、阴影 `-8px 0 24px rgb(26 20 16 / .04)` |
| 头部 64px | 左：金色 Sparkles 图标 + `Gift Advisor`（Bodoni 18）；右：`New chat`（SquarePen 图标）、关闭（X 图标） |
| 空状态 | 金色 Sparkles 32px → 问候语（14px）→ 3 个建议问题（随当前页面变化，见 §5）；最下面一行 `Answers use Estée Lauder Archive and GoodFlow public data.`（11px `taupe-ink`） |
| 用户消息 | 靠右；黑底象牙字，圆角 10，最大宽度 85%，14px |
| AI 消息 | 无气泡、靠左；头部是 24px 金色圆形 Sparkles + 眉标 `GIFT ADVISOR`；正文 14 / 22 黑色 markdown |
| 工具步骤 | 12px `taupe-ink`；进行中显示 Loader 转圈，完成后显示 `gold-deep` 对勾，右侧灰字显示结果（如 `Top 3`）；全部完成后折叠成一行 `3 steps · 1.1s`，可展开 |
| 引用角标 | 正文里的 `[1]` 渲染成上标小胶囊（`gold-deep` 字、`cream` 底）；hover 用 HoverCard 显示 Archive 商品小卡（图 + 名称 + campaign）；点击打开 ProductDialog |
| Sources | 正文下方可折叠一行 `Sources · 3`，展开后是引用的商品列表 |
| 商品卡 | 横向紧凑卡，高 72px：缩略图 56px → 名称 13px 500 → `ARCHIVE · LNY 2026` 眉标 → `$38.00 · MOQ 3,000`；右侧 `Add` 小按钮；点卡片打开 ProductDialog；入场依次延迟 60ms |
| 动作按钮 | h-9、圆角 6。主动作黑底（如 `Add all 4 to RFQ`），次动作文字按钮带箭头（如 `Open in Categories →`） |
| 追问建议 | 胶囊样式，`line` 描边，12px；hover 时描边变 `el-gold`；出现在最后一条 AI 消息下方 |
| 输入框 | `paper` 底、圆角 10、1px `line`；textarea 自动增高 1–4 行；placeholder `Ask about gifts, budgets or trends…`；发送按钮是 32px 黑色圆形 ArrowUp，输出过程中变成方形 Stop（点击 = 立刻出完整内容） |

---

## 3. 节奏参数（假流式）

```ts
export const TIMING = {
  thinkingMs: 600,      // 用户消息发出后，先显示 Shimmer "Thinking…"
  stepMs: 350,          // 每个工具步骤：转圈 350ms → 打勾
  afterStepsMs: 200,    // 步骤全部完成后停顿
  tokenMs: 22,          // 正文逐词输出
  tokenJitterMs: 8,     // 每个词随机 ±8ms，避免机械感
  tableRowMs: 90,       // markdown 表格整行输出，不逐词（逐词会渲染出半张表）
  cardStaggerMs: 60,    // 正文结束后商品卡依次入场
  tailMs: 150,          // 卡片之后再出动作按钮和追问
} as const
```

- 一段 A1 的总时长约 4.5–5s，演示时不会冷场
- **点击正在输出的消息，或点 Stop**：剩余内容立刻全部出现。演讲者用来控制节奏
- 渲染 markdown 时复用 Fluxa 的 `splitStableMarkdown`（`fluxa/src/components/chat/streaming-markdown.ts`），只重新解析未闭合的尾部，避免闪烁
- 同一时间只允许一条回复在输出；输出中再发送消息，先把当前这条直接出完

---

## 4. 路由规则：用户输入 → 剧本

按顺序匹配，命中即停：

1. **入口强制**：从商品或案例详情进入时，直接走 D1 / D2
2. **建议问题完全匹配**：把输入归一化（小写、去标点、合并空格）后，和每个剧本的 `match.suggestions` 比较
3. **关键词匹配**：按 `TURNS` 数组的顺序，`keywords` 是"组内任一词命中、所有组都要命中"；纯字母数字的关键词按整词匹配，带符号的（如 `$`）按包含匹配
4. **兜底**：固定回复 `FALLBACK_REPLY` + 当前页面的 3 个建议问题。**永远不报错、不说 "I don't know"**

```ts
// web/src/lib/chat/router.ts
export const normalize = (s: string) =>
  s.toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z0-9$' ]+/g, ' ').replace(/\s+/g, ' ').trim()

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const hasKeyword = (q: string, k: string) =>
  /^[a-z0-9]/.test(k) && /[a-z0-9]$/.test(k)
    ? new RegExp(`(^|\\s)${escape(k)}(\\s|$)`).test(q)
    : q.includes(k)

export function routeTurn(text: string, turns: ScriptTurn[]): ScriptTurn | null {
  const q = normalize(text)
  return (
    turns.find((t) => t.match.suggestions?.some((s) => normalize(s) === q)) ??
    turns.find((t) => t.match.keywords?.length && t.match.keywords.every((g) => g.some((k) => hasKeyword(q, k)))) ??
    null
  )
}
```

---

## 5. 剧本总览

| id | 触发问题 | 做什么 | 优先级 |
|---|---|---|---|
| **A1** | What did we gift APAC VIPs last Lunar New Year? | 查 Archive，返回 3 件 2026 春节货 + 引用 | **P0 主线** |
| A2 | Why did the Lacquer Trunk perform best? | 解释爆款原因 | P1 |
| A3 | What did EMEA send for Holiday 2025? | 查欧洲圣诞 Archive | P1 |
| **B1** | Find Lunar New Year 2027 gifts under $60 per unit | 按预算和交期给 4 个方案 + `Add all 4 to RFQ` | **P0 主线** |
| **B2** | （系统消息，点 Add all 之后自动出现） | 报告加入件数和估算总额 | **P0 主线** |
| **B3** | Draft the RFQ email | 读询价单 → 跳 RFQ 页并打开导出弹窗 | **P0 主线** |
| **C1** | What's trending in drinkware this season? | 读排行数据，返回前 3 名 | **P0**（Home 和 Categories 的建议问题里有它） |
| C2 | Show by public purchase volume | 换指标；在 Ranking 页时页面同步重排 | P1 |
| C3 | Which of these suit a Lunar New Year VIP box? | 杯子 + 红包组合建议 | P1 |
| D1 | Is the {product} a good fit for Lunar New Year 2027 VIPs? | 按商品数据生成回答 | P1 |
| D2 | What can we learn from this case? | 按案例数据生成回答 | P1 |
| R1 | Can these land by Jan 15, 2027? | 读询价单，倒推最晚下单日 | P1 |
| HELLO | hi / hello / thanks | 问候 + 建议问题 | P0 |
| FALLBACK | 其他任何输入 | 引导 + 建议问题 | **P0** |

**未实现的剧本，它的问题不要出现在建议和追问里。**

**按页面显示的建议问题：**

| 页面 | 建议问题 |
|---|---|
| `/` | A1 · B1 · C1 |
| `/categories` | A1 · B1（`Which archive gifts can be re-run for 2027?`）· C1 |
| `/ranking` | C1 · C2 · C3 |
| `/rfq` | B3 · R1 · B1 |

C2、C3 还没做时，`/ranking` 的建议换成 C1 · A1 · B1；R1 还没做时，`/rfq` 的建议换成 B3 · B1 · A1。

---

## 6. 类型定义

```ts
// web/src/lib/chat/types.ts
import type { Case, Product, RfqLine, OccasionId, BrandId } from '@/lib/types'

export type ChatRoute = '/' | '/categories' | '/ranking' | '/rfq'

export type ChatContext = {
  route: ChatRoute
  productId?: string       // 从商品详情进入
  caseId?: string          // 从案例详情进入
  rfqLines: RfqLine[]
  neededBy: string         // 'YYYY-MM-DD'，来自询价单，默认 '2027-01-15'
}

export type Step = { label: string; result?: string }

export type ChatAction =
  | { type: 'add-to-rfq'; label: string; productIds: string[]; project?: string; notes?: string }
  | { type: 'navigate'; label: string; href: string; auto?: boolean } // auto：回答结束后，如果当前就在同一路由，自动执行（C2 用）
  | { type: 'open-rfq-export'; label: string }                        // 跳 /rfq?export=1

export type Helpers = {
  product: (id: string) => Product
  caseById: (id: string) => Case
  brandLabel: (id: BrandId) => string
  brandList: (ids: BrandId[]) => string                 // 'Estée Lauder and La Mer'
  occasionLabel: (id: OccasionId) => string
  money: (n: number, digits?: 0 | 2) => string          // '$38.00' / '$231,500'
  date: (iso: string) => string                         // 'Nov 1, 2026'
  orderBy: (neededBy: string, leadDays: number) => string // 返回 ISO 日期
  daysUntil: (iso: string) => number
  rfqSummary: (lines: RfqLine[]) => {
    count: number
    total: number
    maxLead: { days: number; productId: string }
  }
}

type TurnValue<T> = T | ((ctx: ChatContext, h: Helpers) => T)

export type ScriptTurn = {
  id: string
  match: { suggestions?: string[]; keywords?: string[][] }
  steps?: TurnValue<Step[]>
  reply: TurnValue<string>             // markdown；[1] 对应 citations[0]
  citations?: TurnValue<string[]>      // 商品或案例 id
  cards?: TurnValue<{ kind: 'product' | 'case'; ids: string[] } | undefined>
  actions?: TurnValue<ChatAction[]>
  followUps?: string[]
}

// 引擎输出给 UI 的数据块。以后接真模型，只要输出同样的 Chunk 即可
export type Chunk =
  | { type: 'step'; index: number; label: string; status: 'running' | 'done'; result?: string }
  | { type: 'text'; delta: string }
  | { type: 'citations'; ids: string[] }
  | { type: 'cards'; kind: 'product' | 'case'; ids: string[] }
  | { type: 'actions'; actions: ChatAction[] }
  | { type: 'followUps'; items: string[] }
  | { type: 'done'; turnId: string }

export interface ReplyEngine {
  reply(
    input: { text: string; forceTurnId?: string },
    ctx: ChatContext,
    control: { skip: boolean },   // UI 把 skip 设为 true，剩余内容立即输出
  ): AsyncIterable<Chunk>
}

// UI 里的消息结构
export type UserMessage = { id: string; role: 'user'; text: string }
export type AssistantMessage = {
  id: string
  role: 'assistant'
  turnId: string
  status: 'thinking' | 'streaming' | 'done'
  steps: (Step & { status: 'running' | 'done' })[]
  text: string
  citations: string[]
  cards?: { kind: 'product' | 'case'; ids: string[] }
  actions: ChatAction[]
  followUps: string[]
}
export type ChatMessage = UserMessage | AssistantMessage
```

**剧本引擎**（示意）：

```ts
// web/src/lib/chat/engine.ts
export const scriptEngine: ReplyEngine = {
  async *reply(input, ctx, control) {
    const turn = input.forceTurnId ? byId(input.forceTurnId) : routeTurn(input.text, TURNS)
    const t = turn ?? FALLBACK_TURN
    const sleep = (ms: number) => (control.skip ? Promise.resolve() : wait(ms))
    const r = <T,>(v: T | ((c: ChatContext, h: Helpers) => T)) =>
      typeof v === 'function' ? (v as (c: ChatContext, h: Helpers) => T)(ctx, helpers) : v

    await sleep(TIMING.thinkingMs)
    for (const [i, s] of (r(t.steps) ?? []).entries()) {
      yield { type: 'step', index: i, label: s.label, status: 'running' }
      await sleep(TIMING.stepMs)
      yield { type: 'step', index: i, label: s.label, status: 'done', result: s.result }
    }
    await sleep(TIMING.afterStepsMs)

    for (const piece of tokenize(r(t.reply))) {          // 普通行按词切；以 | 开头的表格行整行输出
      yield { type: 'text', delta: piece.text }
      await sleep(piece.isTableRow ? TIMING.tableRowMs : TIMING.tokenMs + jitter(TIMING.tokenJitterMs))
    }

    const citations = r(t.citations)
    if (citations?.length) yield { type: 'citations', ids: citations }
    const cards = r(t.cards)
    if (cards) { await sleep(TIMING.tailMs); yield { type: 'cards', ...cards } }
    const actions = r(t.actions)
    if (actions?.length) yield { type: 'actions', actions }
    yield { type: 'followUps', items: t.followUps ?? SUGGESTIONS_BY_ROUTE[ctx.route] }
    yield { type: 'done', turnId: t.id }
  },
}
```

---

## 7. 完整剧本（可直接存为 `web/src/data/estee-lauder/chat-script.ts`）

> 剧本里的商品事实和数字必须和 `products.ts`、`ranking.ts` 一致，核对清单见 DATA_SCHEMA.md §7。
> 拿到真实 Archive 数据后，**改文字不改结构**：id、引用、按钮都保持不变。

```ts
import type { ChatRoute, ScriptTurn } from '@/lib/chat/types'

const LNY_PROJECT = 'Lunar New Year 2027 VIP Gifting'

export const Q = {
  archiveLny: 'What did we gift APAC VIPs last Lunar New Year?',
  lny2027: 'Find Lunar New Year 2027 gifts under $60 per unit',
  rerun2027: 'Which archive gifts can be re-run for 2027?',
  trending: "What's trending in drinkware this season?",
  whyTrunk: 'Why did the Lacquer Trunk perform best?',
  emeaHoliday: 'What did EMEA send for Holiday 2025?',
  draftEmail: 'Draft the RFQ email',
  byVolume: 'Show by public purchase volume',
  vipBox: 'Which of these suit a Lunar New Year VIP box?',
  leadCheck: 'Can these land by Jan 15, 2027?',
} as const

// 详情页入口发出的问题
export const ENTRY_PROMPTS = {
  product: (name: string) => `Is the ${name} a good fit for Lunar New Year 2027 VIPs?`,
  case: () => 'What can we learn from this case?',
}

export const GREETING =
  "Hi Anna — I'm your **Gift Advisor**. I know every gift Estée Lauder Companies has made with GoodFlow, plus what's trending across the industry. What are you planning?"

export const SUGGESTIONS_BY_ROUTE: Record<ChatRoute, string[]> = {
  '/': [Q.archiveLny, Q.lny2027, Q.trending],
  '/categories': [Q.archiveLny, Q.rerun2027, Q.trending],
  '/ranking': [Q.trending, Q.byVolume, Q.vipBox],
  '/rfq': [Q.draftEmail, Q.leadCheck, Q.lny2027],
}

export const FALLBACK_REPLY =
  "I'm running in demo mode, so right now I'm focused on three things: **your gifting archive**, **budget-fit options** and **industry rankings**. Try one of these:"

// B2：执行 add-to-rfq 之后由 UI 追加的一条 AI 消息（不经过路由）
// total = 加入后整张询价单（选中行）的估算总额，用 money(total, 0) 格式化
export const rfqAddedReply = (added: number, skipped: number, total: string) =>
  `Added **${added} item${added === 1 ? '' : 's'}** to your RFQ List at MOQ quantities` +
  (skipped ? ` (${skipped} already there)` : '') +
  ` — estimated **${total}** in total. Want me to draft the RFQ email?`
export const RFQ_ADDED_ACTIONS = [{ type: 'navigate', label: 'Open RFQ List', href: '/rfq' }] as const
export const RFQ_ADDED_FOLLOW_UPS = [Q.draftEmail]

// 数组顺序就是关键词匹配的优先级
export const TURNS: ScriptTurn[] = [
  // ───────────── A · Archive recall ─────────────
  {
    id: 'A2',
    match: {
      suggestions: [Q.whyTrunk],
      keywords: [['why', 'perform', 'work', 'worked', 'best', 'popular'], ['trunk', 'lacquer']],
    },
    steps: [
      { label: 'Reading archive notes · Year of the Horse Lacquer Trunk' },
      { label: 'Comparing with other Lunar New Year 2026 pieces', result: '3 signals' },
    ],
    reply: `Three signals from the archive:

1. **It stayed on the vanity.** It was the only 2026 piece designed to be used after the holiday, so recipients kept posting it — that's what drove case clicks. [1]
2. **It matched the key visual.** Red lacquer with a gold horse mirrored the APAC Lunar New Year campaign, so counters could display it.
3. **Small batches were possible.** An MOQ of 3,000 let individual markets order without pooling volume.

A **Year of the Goat** edition for 2027 keeps all three advantages.`,
    citations: ['arc-001'],
    cards: { kind: 'product', ids: ['arc-001'] },
    followUps: [Q.lny2027],
  },
  {
    id: 'A1',
    match: {
      suggestions: [Q.archiveLny],
      keywords: [
        ['lunar', 'cny', 'new year', 'lny', 'spring festival'],
        ['last', '2026', 'did we', 'previous', 'before', 'history', 'past'],
      ],
    },
    steps: [
      { label: 'Searching Estée Lauder Archive' },
      { label: 'Filtering: APAC · Lunar New Year 2026' },
      { label: 'Ranking by case clicks', result: 'Top 3' },
    ],
    reply: `For **Lunar New Year 2026** (Year of the Horse), APAC gifting was built around three pieces:

1. **Year of the Horse Lacquer Trunk** — a red-lacquer vanity trunk for Estée Lauder's top-tier VIPs in Greater China, and the most-clicked archive item of the season. [1]
2. **Gilded Horse Compact Mirror** — a gold-finish compact sent with La Mer's VIP renewal kits in Korea and Japan. [2]
3. **Silk Red Envelope Set** — six embroidered silk envelopes in a magnetic box, used in VIP boxes and as a gift-with-purchase across APAC counters. [3]

Lead times were 45–70 days at MOQ, with MOQs starting at 3,000 units.`,
    citations: ['arc-001', 'arc-002', 'arc-003'],
    cards: { kind: 'product', ids: ['arc-001', 'arc-002', 'arc-003'] },
    actions: [
      { type: 'navigate', label: 'Open in Categories', href: '/categories?source=archive&occasion=lunar-new-year' },
    ],
    followUps: [Q.lny2027, Q.whyTrunk, Q.emeaHoliday],
  },
  {
    id: 'A3',
    match: {
      suggestions: [Q.emeaHoliday],
      keywords: [['emea', 'europe', 'holiday', 'christmas', 'london', 'paris']],
    },
    steps: [
      { label: 'Searching Estée Lauder Archive' },
      { label: 'Filtering: EMEA · Holiday 2024–2025', result: '3 matches' },
    ],
    reply: `For **Holiday 2025**, EMEA leaned on scent and keepsakes:

1. **Midnight Ceramic Candle** — Jo Malone London's hand-glazed vessel for the London VIP dinner. [1]
2. **Holiday Velvet Vanity Pouch** — the midnight-blue gift-with-purchase for the Advanced Night Repair holiday set, run in EMEA and the Americas. [2]

For press, the **Gold-Foil Notebook Set** from the Holiday 2024 Paris preview is still the most re-requested media gift. [3]`,
    citations: ['arc-005', 'arc-004', 'arc-011'],
    cards: { kind: 'product', ids: ['arc-005', 'arc-004', 'arc-011'] },
    actions: [{ type: 'navigate', label: 'Open in Categories', href: '/categories?source=archive&occasion=holiday' }],
    followUps: [Q.lny2027],
  },

  // ───────────── C · Trends（排在 B1 前面，因为 B1 的关键词更宽） ─────────────
  {
    id: 'C3',
    match: {
      suggestions: [Q.vipBox],
      keywords: [['vip box', 'vip'], ['these', 'drinkware', 'cup', 'cups', 'tumbler', 'mug']],
    },
    steps: [
      { label: 'Matching top drinkware with Lunar New Year archive pieces' },
      { label: 'Checking price and lead time', result: '1 pairing' },
    ],
    reply: `Pair the **Double-Wall Ceramic Tumbler** — available in a red-glaze finish — with the archive **Silk Red Envelope Set**. [1]

- About **$19.40 per box** at MOQ, far under a $60 budget
- The tumbler's 45-day lead time is safe for Jan 15, 2027
- It's #1 in case clicks this season, so it already looks good in finished gift boxes`,
    citations: ['arc-003'],
    cards: { kind: 'product', ids: ['ext-008', 'arc-003'] },
    actions: [{ type: 'add-to-rfq', label: 'Add both to RFQ', productIds: ['ext-008', 'arc-003'], project: LNY_PROJECT }],
    followUps: [Q.draftEmail],
  },
  {
    id: 'C2',
    match: {
      suggestions: [Q.byVolume],
      keywords: [['purchase volume', 'volume', 'units', 'best selling', 'bestseller', 'best seller']],
    },
    steps: [{ label: 'Re-ranking drinkware by public purchase volume' }],
    reply: `By **public purchase volume** the order changes: the **Insulated Travel Cup 350ml** leads with **212,000 units**, followed by the **Matte Stoneware Mug** (186,500) and the **Glass Straw Cup 500ml** (154,300).

Volume favors safe, everyday pieces; search heat shows where demand is heading.`,
    cards: { kind: 'product', ids: ['ext-009', 'ext-007'] },
    actions: [
      { type: 'navigate', label: 'Show on Ranking', href: '/ranking?board=drinkware&metric=purchaseVolume', auto: true },
    ],
    followUps: [Q.vipBox],
  },
  {
    id: 'C1',
    match: {
      suggestions: [Q.trending],
      keywords: [['trend', 'trending', 'trends', 'rank', 'ranking', 'popular', 'hot', 'search heat']],
    },
    steps: [
      { label: 'Reading GoodFlow public & anonymized data · Jul–Sep 2026' },
      { label: 'Ranking 10 drinkware items by search heat', result: 'Top 3' },
    ],
    reply: `Clear and insulated pieces are leading this season:

1. **Glass Straw Cup 500ml** — #1 in search heat with **18,420** searches, up 3 places. Driven by launch events and eco-packaging briefs.
2. **Smart Temperature Bottle** — #2, popular for tech-forward VIP kits.
3. **Double-Wall Ceramic Tumbler** — #3 in search heat, but **#1 in case clicks**: buyers look at it most when browsing finished cases.

By public purchase volume, the **Insulated Travel Cup 350ml** still leads with **212,000 units** — the safe choice for employee gifting.

_Source: GoodFlow public & anonymized data. No Estée Lauder internal data is used._`,
    cards: { kind: 'product', ids: ['ext-007', 'ext-010', 'ext-008'] },
    actions: [{ type: 'navigate', label: 'Open Ranking', href: '/ranking?board=drinkware&metric=searchHeat' }],
    followUps: [Q.vipBox, Q.byVolume],
  },

  // ───────────── B · Plan & RFQ ─────────────
  {
    id: 'B3',
    match: {
      suggestions: [Q.draftEmail],
      keywords: [['rfq', 'quote', 'quotation', 'email', 'draft', 'export']],
    },
    steps: (ctx, h) => [
      { label: 'Reading RFQ List', result: `${h.rfqSummary(ctx.rfqLines).count} items` },
      { label: 'Applying volume-tier pricing' },
      { label: 'Drafting email' },
    ],
    reply: (ctx, h) => {
      const s = h.rfqSummary(ctx.rfqLines)
      if (s.count === 0) return 'Your RFQ List is empty — add a few gifts first, then I can draft the email.'
      return `Here's a draft for **${s.count} items**, estimated **${h.money(s.total, 0)}**, needed by **${h.date(ctx.neededBy)}**. Everything stays editable before you send it.`
    },
    actions: (ctx, h) =>
      h.rfqSummary(ctx.rfqLines).count
        ? [{ type: 'open-rfq-export', label: 'Review & export' }]
        : [{ type: 'navigate', label: 'Browse Categories', href: '/categories' }],
    followUps: [Q.leadCheck],
  },
  {
    id: 'R1',
    match: {
      suggestions: [Q.leadCheck],
      keywords: [['lead time', 'deadline', 'land by', 'arrive', 'in time', 'on time', 'schedule']],
    },
    steps: [{ label: 'Reading RFQ List' }, { label: 'Checking lead times by volume tier' }],
    reply: (ctx, h) => {
      const s = h.rfqSummary(ctx.rfqLines)
      if (s.count === 0) return "Your RFQ List is empty — add a few gifts and I'll check them against your in-store date."
      const by = h.orderBy(ctx.neededBy, s.maxLead.days)
      const tight = h.daysUntil(by) < 7
      return `The longest lead time in your list is **${s.maxLead.days} days** (${h.product(s.maxLead.productId).name}). To land by **${h.date(ctx.neededBy)}**, place the order by **${h.date(by)}**.

${tight ? "That's tight — consider swapping that item for a faster option, or splitting the shipment." : 'You have room: all items can ship together.'}`
    },
    followUps: [Q.draftEmail],
  },
  {
    id: 'B1',
    match: {
      suggestions: [Q.lny2027, Q.rerun2027, 'Something similar for Lunar New Year 2027, under $60?'],
      keywords: [['under', 'budget', '$', 'cheap', 'price', 'cost', 'per unit', '2027', 're run', 'rerun', 'similar']],
    },
    steps: [
      { label: 'Reading brief: Lunar New Year 2027 · Year of the Goat · ≤ $60/unit' },
      { label: 'Searching Estée Lauder Archive + External Picks' },
      { label: 'Checking lead times against Jan 15, 2027', result: '10 fit · top 4' },
    ],
    reply: `2027 is the **Year of the Goat**, so I kept the red-and-gold language from 2026 and dropped the horse motifs. These four fit under $60 per unit and can land by **Jan 15, 2027**:

| Gift | Source | Unit price at MOQ | Lead time |
|---|---|---|---|
| Lacquer Trunk — Goat edition re-run | Archive | $38.00 | 70 days |
| Silk Red Envelope Set | Archive | $9.50 | 45 days |
| Cloud-Wool Throw Blanket | External Pick | $42.00 | 60 days |
| Year of the Goat Porcelain Tea Set | External Pick | $56.00 | 75 days |

Two are re-runs from the archive [1][2], so artwork and suppliers are already proven. **Order by Nov 1, 2026** to keep all four on schedule — the tea set has the longest lead time.`,
    citations: ['arc-001', 'arc-003'],
    cards: { kind: 'product', ids: ['arc-001', 'arc-003', 'ext-002', 'ext-005'] },
    actions: [
      {
        type: 'add-to-rfq',
        label: 'Add all 4 to RFQ',
        productIds: ['arc-001', 'arc-003', 'ext-002', 'ext-005'],
        project: LNY_PROJECT,
        notes: 'Re-run archive pieces with Year of the Goat artwork.',
      },
      { type: 'navigate', label: 'Open in Categories', href: '/categories?source=all&occasion=lunar-new-year&maxPrice=60' },
    ],
    followUps: [Q.whyTrunk, Q.trending],
  },

  // ───────────── D · 详情页入口（只能通过 forceTurnId 触发） ─────────────
  {
    id: 'D1',
    match: {},
    steps: (ctx, h) => [
      { label: `Reading product file · ${h.product(ctx.productId!).name}` },
      { label: `Checking price tiers and lead time against ${h.date(ctx.neededBy)}` },
    ],
    reply: (ctx, h) => {
      const p = h.product(ctx.productId!)
      const t = p.priceTiers[0]
      const origin =
        p.source === 'archive'
          ? `**${p.name}** was made for **${h.brandLabel(p.brands[0])}** — ${p.campaign}. ${p.notes}`
          : `**${p.name}** by ${p.maker} is an External Pick recommended for ${h.brandList(p.brands)}.`
      const fit = !p.occasions.includes('lunar-new-year')
        ? "It wasn't designed for Lunar New Year, but a red-and-gold sleeve and a Year of the Goat card would adapt it for VIPs."
        : /goat/i.test(p.name)
          ? "It's already designed for the **Year of the Goat** — a natural fit for a 2027 VIP box."
          : 'It already fits a Lunar New Year brief. For 2027, swap the zodiac motif for the **Year of the Goat** and keep the red-and-gold palette.'
      return `${origin}

At **${t.moq.toLocaleString('en-US')} units** it's **${h.money(t.unitPrice)} per unit** with a **${t.leadTimeDays}-day** lead time — order by **${h.date(h.orderBy(ctx.neededBy, t.leadTimeDays))}** to land by ${h.date(ctx.neededBy)}.

${fit}`
    },
    cards: (ctx) => ({ kind: 'product', ids: [ctx.productId!] }),
    actions: (ctx) => [{ type: 'add-to-rfq', label: 'Add to RFQ', productIds: [ctx.productId!], project: LNY_PROJECT }],
    followUps: [Q.lny2027, Q.leadCheck],
  },
  {
    id: 'D2',
    match: {},
    steps: (ctx, h) => [{ label: `Reading case file · ${h.caseById(ctx.caseId!).title}` }],
    reply: (ctx, h) => {
      const c = h.caseById(ctx.caseId!)
      return `**${c.title}** — ${c.client}, ${h.occasionLabel(c.occasions[0])} ${c.year}.

It was built around ${c.items.length} pieces: ${c.items.map((i) => i.name).join(', ')}.

**Why it worked:** ${c.takeaway}

Want to see gifts in the catalog that follow the same idea?`
    },
    actions: (ctx, h) => [
      {
        type: 'navigate',
        label: 'Browse similar gifts',
        href: `/categories?source=all&occasion=${h.caseById(ctx.caseId!).occasions[0]}`,
      },
    ],
    followUps: [Q.lny2027],
  },

  // ───────────── 寒暄 ─────────────
  {
    id: 'HELLO',
    match: { keywords: [['hi', 'hello', 'hey', 'thanks', 'thank you']] },
    reply: "Happy to help. I can look up past gifts in the archive, find options that fit a budget and deadline, or show what's trending.",
  },
]
```

**兜底剧本**：

```ts
export const FALLBACK_TURN: ScriptTurn = {
  id: 'FALLBACK',
  match: {},
  reply: FALLBACK_REPLY,
  // followUps 留空 → 引擎使用当前页面的 SUGGESTIONS_BY_ROUTE
}
```

---

## 8. 动作的执行规则

| 动作 | 执行 |
|---|---|
| `add-to-rfq` | 按第一档 MOQ 数量、`EXW` 加入；已在询价单里的跳过不重复。带了 `project` / `notes` 并且询价单对应字段还是空的，就填进去。之后：弹 toast `4 items added to RFQ List`（带 `View` 按钮）→ 顶栏角标跳一下 → 追加 B2 消息 |
| `navigate` | `router.push(href)`，面板保持打开；`auto: true` 并且当前已经在同一路由时，回答结束后自动执行 |
| `open-rfq-export` | `router.push('/rfq?export=1')`，导出弹窗自动打开 |
| 商品卡 `Add` | 等同于只有一个商品的 `add-to-rfq` |
| 引用 `[n]` / 商品卡点击 | 打开 ProductDialog（AI 面板保持打开） |

---

## 9. 组件映射

```bash
pnpm dlx ai-elements@latest add conversation
pnpm dlx ai-elements@latest add message
pnpm dlx ai-elements@latest add prompt-input
pnpm dlx ai-elements@latest add suggestion
pnpm dlx ai-elements@latest add shimmer
pnpm dlx ai-elements@latest add chain-of-thought
pnpm dlx ai-elements@latest add sources
pnpm dlx ai-elements@latest add inline-citation
pnpm dlx ai-elements@latest add loader
```

组件名以 CLI 当前列表为准（较新的版本里 `response` 可能已并入 `message`）。

| 需求 | 组件 |
|---|---|
| 消息列表，自动滚到底 | `conversation` |
| 消息行、markdown 渲染 | `message`（或 `response`） |
| 输入框 + 发送 / Stop | `prompt-input` |
| 建议问题、追问 | `suggestion` |
| "Thinking…" 闪光文字 | `shimmer` |
| 工具步骤 | `chain-of-thought` |
| 引用角标 + 悬停预览 | `inline-citation`（+ shadcn `hover-card`） |
| 底部 Sources 折叠 | `sources` |
| 商品卡、动作按钮 | 自研 `ChatProductCard`，复用全站的 ProductDialog 和询价单逻辑 |

**可以直接复用 Fluxa 的代码**（`/Users/cj/Documents/personal/project/fluxa/src/`）：

- `components/ai-elements/conversation.tsx`
- `components/ai-elements/response.tsx`
- `components/ai-elements/reasoning.tsx`
- `components/ai-elements/shimmer.tsx`
- `components/chat/streaming-markdown.ts`

拷过来后把配色改成 EL token。

---

## 10. 以后接真模型

UI 只依赖 `ReplyEngine` 接口，接真模型时新增一个 `modelEngine` 即可，UI 不改：

- 用 AI SDK `streamText`，提供 3 个工具：
  - `searchArchive({ occasion, region, year, maxPrice })`
  - `getRanking({ board, metric })`
  - `getRfqList()`
- 工具调用映射成 `step` 数据块，工具返回的 id 映射成 `citations` 和 `cards`
- System prompt 的约束：
  - 只用英文回答
  - 只推荐工具返回过的商品，引用必须用 id
  - 价格和交期以工具数据为准，不允许编造
- 演示现场仍然用 `scriptEngine`。开关放在 `config/brand.ts` 的 `advisor.engine: 'script' | 'model'`

---

## 11. 验收清单

- [ ] 3 条主线问题（A1 → B1 → B3），每段 6s 内结束
- [ ] 点击正在输出的消息，立刻出完整内容
- [ ] 引用 `[1]` 悬停能预览，点击打开对应的 Archive 商品
- [ ] `Add all 4 to RFQ`：toast、角标、B2 消息都出现；B2 里的估算总额 = 询价单页面的总额 = $231,500
- [ ] 重复点 `Add all` 不会重复加入（B2 提示 "already there"）
- [ ] 切换页面后对话还在；`New chat` 能清空；`?reset=1` 能清空
- [ ] 输入 `asdf`、`你好`、`what's the weather` → 兜底回复 + 3 个建议，不报错
- [ ] 面板打开时，瀑布流、品类网格、排行舞台都能正常重排，不被遮挡
