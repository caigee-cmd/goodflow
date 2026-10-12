export const brand = {
  id: "estee-lauder",
  dataDir: "estee-lauder",
  wordmark: "Estée Lauder",
  logoSrc: null as string | null,
  productName: "Product Intelligence",
  poweredBy: "GoodFlow",
  user: {
    name: "Anna Chen",
    initials: "AC",
    title: "Gifting & Procurement, Estée Lauder APAC",
    email: "buyer@esteelauder.com",
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
