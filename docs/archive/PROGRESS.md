> **已于 2026-10-12 归档，不要当现状。** 文中「图片仍是占位」「引用角标和逐词输出还没做」停在 2026-10-09，和后来的代码不符。范围看 PLAN.md，做到哪了看 `web/src`。

# PROGRESS — 进度记录（已归档）

> 以下原文只作历史。不要根据它实现功能、改文案或改数字。
>
> 本文件只回答「做到哪了」。它不是需求、不是设计、不是数据、不是技术决策，也不是排期。
>
> - **不要**根据本文件决定功能怎么做、文案怎么写、数字用多少。
> - **不要**把这里的勾选、备注、日期当成产品规则或实现依据。
> - 和任何规格冲突时，**忽略本文件**。规格优先级见 [README.md](./README.md)：PLAN.md §4 拍板结论 → REQUIREMENTS.md → DATA_SCHEMA.md → UI_SPEC.md / AI_SCRIPT.md / DEMO_SCRIPT.md。
> - 做完并核对过的项，只在本文件把 `- [ ]` 改成 `- [x]`，可在该项下写一行事实（命令、路径）。不要把实现细节写回规格文档。
> - 未核对的不要勾。规格改了而代码还没跟上时，把对应项改回 `- [ ]` 并写一句差在哪。

最后更新：2026-10-09。主线可以点完。弹窗有淡入，复制和加入有提示，重置会清掉顾问对话，A1 回答里的 [1] 能打开漆盒。图片仍是占位。

---

## 当前

Gift Advisor 回答下面有追问。加入四件后出现 Draft the RFQ email，再点 Review & export 打开询价邮件。四件、总额 $231,500、最晚下单日 Nov 1, 2026 与 DATA_SCHEMA 样例一致。头像菜单可以 Reset demo 或 Sign out。

下一步是 **10/16**：整条主线连走一遍，并替换能拿到的真实素材。图片仍是占位。

还没做：逐词输出、引用角标 `[1]`、工具步骤逐条打勾、P1 剧本。

---

## 10/10 · 项目骨架与数据

- [x] `web/` 能 `pnpm dev`，入口是 `/login`
- [x] 设计 token（象牙 / 黑 / EL Gold）写在 `web/src/app/globals.css`，没有深色主题
- [x] 字体：Bodoni Moda（wordmark / 标题）+ Geist Sans（其余）
- [x] `Wordmark`、`Topbar`、`Footer` 出现在登录页以外的空白页上
- [x] 类型、品牌配置、24 个商品、20 个案例、Drinkware 排行 10 条
- [x] 价格、日期、筛选、RFQ 邮件模板按 DATA_SCHEMA.md §5 / §8
- [x] `cd web && pnpm test` 通过（DATA_SCHEMA.md §7 一致性测试）

## 10/11 · Ranking 堆叠

- [x] `/ranking` 舞台、三个指标切换、重排动画
- [ ] 截图给赵曼君确认（业务侧，不在本仓库打勾）

## 10/12 · Login、Home、案例详情

- [x] 主线 Step 1：`/login` 预填账号，Sign in 进入首页
- [x] 主线 Step 2：Hero、场景 chips、案例瀑布流、右栏、案例详情

## 10/13 · Categories、商品详情

- [x] 主线 Step 4：Source 切换、四组筛选、默认 EL + Archive、URL 同步、阶梯价

## 10/14 · RFQ

- [x] 主线 Step 6：行项目、阶梯价、汇总、Order by、导出弹窗、复制

## 10/15 · Gift Advisor

- [x] 主线 Step 5：面板、剧本 A1 / B1 / B2 / B3 / C1 / HELLO / FALLBACK

## 10/16–10/20 · 串线与交付

- [ ] 真实素材按 id 替换（没有素材则继续 PlaceholderImage）
- [ ] 主线全程走通
- [ ] P1（PLAN.md §1）
- [ ] 离线包 `web/out/`，断网可用
- [ ] 1920×1080 投屏
- [ ] 录屏
- [ ] 线上地址

## 验收（对应 PLAN.md §5，规格仍以 PLAN 为准）

- [ ] 主线 6 步连续走 3 遍不出错
- [ ] DATA_SCHEMA.md §7 一致性测试全部通过
- [ ] 随便输入 AI 都不报错
- [ ] `?reset=1` 恢复初始状态
- [ ] 每页都有 ESTÉE LAUDER wordmark
- [ ] 无中文 UI、无紫/蓝、无渐变按钮
- [ ] 1920×1080 下最小字号可读
- [ ] 动画无明显掉帧；本地首屏 2 秒内；主线 4 分钟以内

## P1 / P2

未开始。范围只看 [PLAN.md](./PLAN.md) §1，不在这里展开。
