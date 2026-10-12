# Demo 素材规范（发给业务侧）

> 用途：GoodFlow × Estée Lauder 复赛 Demo，之后也会作为标准提案物料
> 填写模板：`assets/templates/cases.csv`、`assets/templates/products.csv`
> **截止时间：10 月 14 日（周三）18:00，已过。** 开发侧已经用 `web/public/demo/` 里的示意图片上线。之后换真实素材时按 id 替换那个目录里的文件，不要改页面代码，也不要写到 `public/images/`。`assets/` 只放原始参考和 CSV 模板，页面不读它。

---

## 1. 要什么

| 素材 | 数量 | 用在哪 | 优先级 |
|---|---|---|---|
| 案例 | 20 个 | 首页瀑布流、案例详情弹窗 | P0 |
| Estée Lauder Archive 商品 | 12 个（其中 Estée Lauder 品牌至少 6 个，其余 ELC 品牌至少各 1 个） | 品类专区、AI 回答、询价单 | **P0，最重要** |
| External Picks 商品 | 12 个 | 品类专区、AI 回答 | P0 |
| 排行榜：杯子 / 水具 | 10 张图 | 排行榜页 | P0（亢总待办，先用古德库里的杯子） |
| 排行榜：香氛礼盒 | 10 张图 | 排行榜第二个榜单 | P1 |
| Estée Lauder 英文 Logo | 1 个 SVG | 每个页面 | P0（没有的话开发侧用衬线字排，见 §5） |

**场景分布**（每个案例和商品至少选 1 个）：

| 场景 | 案例至少 | 商品至少 |
|---|---|---|
| Lunar New Year | 5 | 6 |
| Holiday Season | 3 | 3 |
| VIP Gifting | 4 | 6 |
| Launch Events | 3 | 3 |
| Employee Gifts | 3 | 3 |

**案例来源**：ELC 系品牌约 7 个，美妆 / 奢品行业约 7 个，IP 联名约 6 个。

---

## 2. 案例（20 个）

### 2.1 字段

| 字段 | 必填 | 要求 | 示例 |
|---|---|---|---|
| id | ✓ | `case-01` … `case-20`，不要改 | case-01 |
| title | ✓ | 英文短句，句首大写、句号结尾，≤ 48 个字符 | A golden horse gallops into the New Year. |
| client | ✓ | 客户名或类型。不能公开的写类型 | Heritage museum IP |
| kind | ✓ | `elc` / `industry` / `ip` | ip |
| occasions | ✓ | 1–2 个场景，用 `\|` 分隔 | lunar-new-year |
| year | ✓ | 项目年份 | 2026 |
| region | ✓ | APAC / EMEA / Americas / Global | APAC |
| description | ✓ | 英文 2–3 句：做了什么、给谁、什么场景 | A Lunar New Year 2026 collection built around… |
| takeaway | ✓ | 英文 1–2 句：为什么有效（会显示在 WHY IT WORKED） | It turned a heritage motif into objects people display… |
| items | ✓ | 4–8 个单品，格式 `名称 · 规格`，用 `\|` 分隔 | Gilded Horse Ornament · Zinc alloy · 9 × 7 cm |
| featured | | 想排在前面的写 `yes`，最多 6 个 | yes |
| can_show_publicly | ✓ | 能否给 EL 和其他客户看：`yes` / `no` | yes |
| image_owner | ✓ | 图片版权归属 | GoodFlow |

### 2.2 图片

| 图 | 数量 | 比例 | 尺寸 | 要求 |
|---|---|---|---|---|
| 封面 cover | 1 | 3:4、4:5、1:1 或 4:3，不同案例混着用 | 长边 ≥ 1600px | 主体清楚，**画面里不要有大段中文字**（全站英文界面） |
| 图集 | 3–5 | 16:10 | ≥ 2000 × 1250px | 第一张是全景，后面是细节 |
| 单品图 | 每个单品 1 张 | 1:1 | ≥ 800 × 800px | 浅色或纯色底，有抠图更好 |

### 2.3 文件命名

```
cases/
  case-01/
    cover.jpg
    01.jpg  02.jpg  03.jpg
    items/
      01.png  02.png  03.png  04.png   # 顺序和 items 字段一致
```

---

## 3. 商品（24 个）

### 3.1 字段

| 字段 | 必填 | 要求 | 示例 |
|---|---|---|---|
| id | ✓ | Archive 用 `arc-001`…`arc-012`；External 用 `ext-001`…`ext-012` | arc-001 |
| source | ✓ | `archive`（古德给 ELC 做过的货）/ `external`（外部推荐） | archive |
| name | ✓ | 英文名，≤ 40 个字符 | Year of the Horse Lacquer Trunk |
| brands | ✓ | Archive 写当时给哪个品牌做的（1 个）；External 写推荐给哪些品牌，用 `\|` 分隔 | estee-lauder |
| category | ✓ | drinkware / home-scent / beauty-accessories / textiles / stationery / festive | beauty-accessories |
| occasions | ✓ | 1–3 个场景，用 `\|` 分隔 | lunar-new-year\|vip |
| year | ✓ | Archive 写活动年份；External 写入库年份 | 2026 |
| campaign | Archive 必填 | `场景 年份 · 项目名` | Lunar New Year 2026 · APAC VIP |
| regions | Archive 必填 | 用 `\|` 分隔 | APAC |
| notes | Archive 必填 | 英文一句话：当时送给谁、什么场景 | Sent to top-tier VIPs in Greater China with… |
| maker | External 必填 | 供应商或品牌名，可以用化名 | Kiln & Co. |
| inspiration | | 英文 1–2 句设计灵感 | Red lacquer and a gold-leaf horse… |
| material | ✓ | 英文 | Lacquered MDF, brass hardware, velvet lining |
| packaging | ✓ | 英文 | Rigid gift box with gold-foil sleeve |
| size | ✓ | 英文，单位 cm 或 ml | 24 × 16 × 12 cm |
| moq_1 / price_1 / lead_1 | ✓ | 第 1 档：起订量 / 美元单价 / 交期天数 | 3000 / 38 / 70 |
| moq_2 / price_2 / lead_2 | ✓ | 第 2 档 | 10000 / 33 / 80 |
| moq_3 / price_3 / lead_3 | ✓ | 第 3 档 | 30000 / 29 / 95 |
| featured | | 首页右栏展示，写 `yes`，最多 5 个，只限 Archive | yes |
| can_show_publicly | ✓ | `yes` / `no` | yes |
| image_owner | ✓ | 图片版权归属 | GoodFlow |

### 3.2 价格和交期要求

- 统一用 **USD 单价**，3 档阶梯价：起订量越大，单价越低，交期越长
- **要能撑起 AI 剧本**：
  - Lunar New Year 场景里，第 1 档单价 ≤ $60 的商品至少 6 个
  - 第 1 档交期全部 ≤ 90 天，保证能赶上 2027-01-15 到店
- 价格是**示意价**，页面上会标注 "Indicative pricing"

### 3.3 图片

| 图 | 数量 | 比例 | 尺寸 | 要求 |
|---|---|---|---|---|
| 商品图 | 1–3 张 | 1:1 | ≥ 1200 × 1200px | **优先透明底 PNG**，其次纯白或浅灰底；主体占画面 70–80%；不要有中文字和水印 |

```
products/
  arc-001/
    01.png  02.png  03.png
```

---

## 4. 排行榜（10 张）

| 字段 | 要求 |
|---|---|
| id | `rk-01` … `rk-10` |
| name | 英文名，≤ 32 个字符 |
| image | 4:5，≥ 1000 × 1250px，**10 张统一背景色和光线**，主体居中 |
| 关联商品 | 如果和 External Picks 里的某个商品是同一件，写上它的 `ext-xxx` |
| 指标 | 搜索热度、案例点击、公开采购量。有古德真实数据就填真实数据；没有的话开发侧用示意数据，页面会标注 |

文件：`ranking/drinkware/rk-01.jpg` … `rk-10.jpg`

---

## 5. 品牌素材

| 素材 | 要求 | 没有的话 |
|---|---|---|
| ESTÉE LAUDER 英文 wordmark | SVG，黑色单色；有金色版更好 | 开发侧用 Bodoni Moda 衬线字排版（全大写，加宽字距），视觉上接近 |
| 品牌色 | 官方色值（确认主色是黑色还是藏蓝） | 用 REQUIREMENTS.md 里的 Demo 色板 |
| 使用授权 | 确认 Demo 可以使用 EL Logo 和产品图 | 演示时标注 "for demo purposes only" |

---

## 6. 交付方式

- 上传到共享盘：`GoodFlow Demo / EL 素材 / 2026-10-14`，按上面的目录放
- 两个 CSV 填好后放在根目录
- 一次传不完可以分批，每批在群里说一声

**文案要求**：

- 全部英文，美式拼写
- 不要中文、不要 emoji
- 写 Lunar New Year，不写 CNY

**开发侧会做的处理**（业务侧不用管）：

- 压缩和裁切
- 统一商品图底色
- 英文文案润色
- 按 id 接入页面

---

## 7. 交付前自查

- [ ] 20 个案例，每个都有封面、图集、单品图
- [ ] 24 个商品，Archive 和 External 各 12 个
- [ ] Archive 里每个品牌至少 1 个；Estée Lauder 至少 6 个
- [ ] Lunar New Year 案例至少 5 个
- [ ] 所有价格都是 3 档、USD
- [ ] `can_show_publicly` 全部填写；填 `no` 的不会出现在 Demo 里
- [ ] 图片里没有大段中文字、水印、其他品牌的 Logo
- [ ] 文件名和 id 一致
