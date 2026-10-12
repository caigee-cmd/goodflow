"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { CASES, PRODUCTS } from "@/data"
import { CaseDialog } from "./case-dialog"
import { ProductDialog } from "@/components/products/product-dialog"

export function HomeSearch() {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [caseId, setCaseId] = useState<string | null>(null)
  const [productId, setProductId] = useState<string | null>(null)
  const q = query.trim().toLowerCase()

  const results = useMemo(() => {
    if (q.length < 1) return { cases: [], products: [] }
    return {
      cases: CASES.filter((item) => item.title.toLowerCase().includes(q) || item.client.toLowerCase().includes(q)).slice(0, 4),
      products: PRODUCTS.filter((item) => item.name.toLowerCase().includes(q)).slice(0, 4),
    }
  }, [q])

  const hasResults = results.cases.length + results.products.length > 0

  return (
    <>
      <div className="relative mx-auto mt-8 w-full max-w-xl text-left">
        <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-el-taupe" strokeWidth={1.5} />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search cases and products"
          aria-label="Search cases and products"
          className="h-12 w-full rounded-full border border-el-line bg-el-paper pr-4 pl-11 text-[14px] outline-none placeholder:text-el-taupe"
        />
        {open && q ? (
          <div className="absolute top-14 z-20 w-full overflow-hidden rounded-lg border border-el-line bg-el-paper text-left shadow-el-md">
            {hasResults ? (
              <ul className="max-h-80 overflow-auto py-2">
                {results.cases.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="block w-full px-4 py-2 text-left hover:bg-el-cream"
                      onClick={() => {
                        setOpen(false)
                        setCaseId(item.id)
                      }}
                    >
                      <span className="block text-[14px] leading-5">{item.title}</span>
                      <span className="block text-[11px] tracking-[0.12em] text-el-taupe-ink uppercase">Case</span>
                    </button>
                  </li>
                ))}
                {results.products.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className="block w-full px-4 py-2 text-left hover:bg-el-cream"
                      onClick={() => {
                        setOpen(false)
                        setProductId(item.id)
                      }}
                    >
                      <span className="block text-[14px] leading-5">{item.name}</span>
                      <span className="block text-[11px] tracking-[0.12em] text-el-taupe-ink uppercase">Product</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-4 text-[13px] text-el-taupe-ink">No matches for “{query.trim()}”.</p>
            )}
          </div>
        ) : null}
      </div>
      {caseId ? <CaseDialog id={caseId} onClose={() => setCaseId(null)} /> : null}
      {productId ? <ProductDialog id={productId} onClose={() => setProductId(null)} /> : null}
    </>
  )
}
