# GoodFlow × Estée Lauder Demo

企业服务创新赛复赛 Demo，**10 月 20 日交付**。之后作为标准提案物料，给雅诗兰黛和其他客户使用。

一句话：一个专属于 Estée Lauder 的礼赠选品空间。灵感（案例）→ 趋势（排行）→ 历史（Archive）→ 方案（AI）→ 询价（RFQ），一条线走完。

做到哪了看代码（`web/src`），不要另找进度文件。`docs/archive/` 里是过时的搭建手册和 10/9 进度快照，**不是规格**。

---

## 文档

| 文档 | 内容 | 给谁看 |
|---|---|---|
| [PLAN.md](./PLAN.md) | 范围（P0 / P1 / P2）、排期、交付物、已拍板结论、验收 | 所有人，先看这个 |
| [DEMO_SCRIPT.md](./DEMO_SCRIPT.md) | 3:45 主线脚本、讲解词、速查卡、备用支线、Q&A、兜底预案 | 演讲者、开发 |
| [REQUIREMENTS.md](./REQUIREMENTS.md) | 产品规则：品牌、语言、页面结构、明确不做 | 所有人 |
| [UI_SPEC.md](./UI_SPEC.md) | 视觉 token、组件选型、逐页规格、反面清单 | 开发 |
| [AI_SCRIPT.md](./AI_SCRIPT.md) | Gift Advisor 规格、类型、完整英文剧本、路由与兜底 | 开发 |
| [DATA_SCHEMA.md](./DATA_SCHEMA.md) | 类型、种子数据、计算规则、状态、邮件模板、**一致性清单** | 开发 |
| [ASSETS_SPEC.md](./ASSETS_SPEC.md) | 素材规范 + CSV 模板（`assets/templates/`） | **业务侧** |
| [智能纪要](./智能纪要-goodflow-demo亢总沟通-2026-10-09.md) | 10/9 会议纪要原文 | 背景，不当规格 |

## 优先级

文档之间冲突时，按这个顺序：

1. **PLAN.md §4 拍板后的结论**
2. **REQUIREMENTS.md**（产品规则）
3. **DATA_SCHEMA.md**（数字和数据）
4. **UI_SPEC.md / AI_SCRIPT.md / DEMO_SCRIPT.md**（具体实现）
5. 会议纪要（背景，不作为实现依据）

## 目录

```
goodflow/
  *.md                  # 现行规格
  docs/archive/         # 已过时，不要当规格
  assets/               # 原始参考（只读）：飞书配图、设计稿截图、CSV 模板。页面不读这里
  web/                  # Next.js 项目。页面图片在 web/public/demo/
```

## 已经定下来的事实

和旧文档冲突时，以这几条为准：

- 询价单叫 **RFQ List**，路由是 `/rfq`，没有 `/cart`，没有收藏。
- 顶栏是 `Home` `Products` `Archive` `Ranking` `RFQ List`，加 `Ask`。`Products` 和 `Archive` 都进 `/categories`（Archive 带 `?source=archive`）。
- 登录页眉标读 `brand.productName`，首页眉标写死同一句，现在都是 **Product Intelligence**，不是 Gift Intelligence。
- 顾问面板标题是 **GoodFlow**，不是 Gift Advisor。
- 图片在 `web/public/demo/{cases,products,ranking}/`。文件在 `web/src/lib/demo-images.ts` 的名单里就显示，否则退回占位。不要再拷到 `public/images/`。
- 项目已经建好。不要再跑 `create-next-app`，也不要按归档里的 TECH.md 重建目录。

## 快速开始

```bash
cd web
pnpm install
pnpm dev          # http://localhost:3000/login
pnpm test         # 数据一致性测试
pnpm build        # 静态导出到 web/out/
```
