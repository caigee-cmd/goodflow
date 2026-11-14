export const brand = {
  id: "estee-lauder",
  dataDir: "estee-lauder",
  wordmark: "xBeauty",
  logoSrc: "/brand/xbeauty-wordmark.png",
  productName: "Product Intelligence",
  poweredBy: "GoodFlow",
  user: {
    name: "Anna Chen",
    initials: "AC",
    title: "Gifting & Procurement, xBeauty APAC",
    email: "buyer@xbeauty.com",
    password: "demo",
  },
  rfq: {
    to: "sales@goodflow.example",
    defaultNeededBy: "2027-01-15",
    defaultRegion: "APAC" as const,
    currency: "USD" as const,
  },
  demoToday: "2026-10-20",
  advisor: { name: "GoodFlow", engine: "script" as "script" | "model" },
} as const
