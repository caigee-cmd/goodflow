import type { Metadata } from "next"
import { Bodoni_Moda, Geist_Mono, Outfit } from "next/font/google"
import { brand } from "@/config/brand"
import { Shell } from "@/components/brand/shell"
import { StoreHydrator } from "@/components/brand/store-hydrator"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Suspense } from "react"
import "./globals.css"

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: `${brand.wordmark} · ${brand.productName}`,
  description: "A gifting space for Estée Lauder. Demo environment.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bodoni.variable} ${outfit.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-el-canvas text-el-black">
        <TooltipProvider>
          <Suspense fallback={null}>
            <StoreHydrator />
          </Suspense>
          <Shell>{children}</Shell>
          <Toaster position="bottom-center" />
        </TooltipProvider>
      </body>
    </html>
  )
}
