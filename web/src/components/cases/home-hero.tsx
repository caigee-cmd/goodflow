"use client"

import { useRef, useState } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { HomeFloatingImages } from "./home-floating-images"
import { HomeSearch } from "./home-search"
import { CaseDialog } from "./case-dialog"
import { HeroCenterpiece } from "./hero-centerpiece"

// 首页全屏 hero：标题/搜索居中，浮动图铺满视口；向下滚动时图片向外扩散、文字上移淡出
export function HomeHero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion() ?? false
  const [openId, setOpenId] = useState<string | null>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })

  // 文字以约一半速度随页面上移（视差），同时淡出
  const contentY = useTransform(scrollYProgress, [0, 1], ["0svh", reduce ? "0svh" : "45svh"])
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.94])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, reduce ? 1 : 0])
  // 浮动层抵消页面滚动（相当于钉在视口里），扩散全程可见，下方内容从其上方滑过
  const layerY = useTransform(scrollYProgress, [0, 1], ["0svh", reduce ? "0svh" : "100svh"])

  return (
    <section
      ref={ref}
      className="relative flex h-[100svh] min-h-[560px] flex-col items-center justify-center px-10 text-center"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 55% at 50% 48%, rgb(196 165 116 / 0.09), transparent 72%)",
        }}
      />
      {/* 浮动层整体不接收指针，只有案例卡片自身 pointer-events-auto */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ y: layerY }}>
        <HomeFloatingImages progress={scrollYProgress} reduce={reduce} onOpen={setOpenId} />
      </motion.div>
      <motion.div className="pointer-events-none relative z-10 w-full" style={{ y: contentY, scale: contentScale, opacity: contentOpacity }}>
        {/* 绝对定位在标题上方，不改变标题/搜索的居中位置 */}
        <div className="absolute bottom-full left-1/2 hidden -translate-x-1/2 lg:block">
          <HeroCenterpiece />
        </div>
        <h1 className="pointer-events-auto mx-auto w-fit font-heading text-[44px] leading-[52px] font-medium tracking-[0.04em] uppercase md:text-[56px] md:leading-[64px]">
          Discover better merch
        </h1>
        <p className="pointer-events-auto mx-auto mt-3 w-fit font-heading text-[18px] leading-7 font-normal tracking-[0.08em] text-el-taupe-ink uppercase md:text-[22px]">
          Discover, imagine, and order with ease
        </p>
        <div className="pointer-events-auto mx-auto w-full max-w-xl">
          <HomeSearch />
        </div>
      </motion.div>
      {openId ? <CaseDialog key={openId} id={openId} onClose={() => setOpenId(null)} /> : null}
    </section>
  )
}
