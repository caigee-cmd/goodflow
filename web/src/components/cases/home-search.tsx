"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { CASES, PRODUCTS } from "@/data"
import { CaseDialog } from "./case-dialog"
import { ProductDialog } from "@/components/products/product-dialog"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

export function HomeSearch() {
  const [query, setQuery] = useState("")
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

  return (
    <>
      <Command
        shouldFilter={false}
        className="relative mx-auto mt-8 h-auto w-full max-w-xl overflow-visible rounded-none bg-transparent p-0 text-left"
      >
        <InputGroup className="h-12 rounded-full border-el-line bg-el-paper shadow-none has-[[data-slot=input-group-control]:focus-visible]:border-el-gold has-[[data-slot=input-group-control]:focus-visible]:ring-el-gold/30">
          <InputGroupAddon className="pl-4 text-el-taupe">
            <Search strokeWidth={1.5} />
          </InputGroupAddon>
          <InputGroupInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search cases and products"
            aria-label="Search cases and products"
            className="h-12 px-2 text-[14px] placeholder:text-el-taupe md:text-[14px]"
          />
        </InputGroup>
        {q ? (
          <CommandList className="absolute top-14 z-20 max-h-80 w-full overflow-auto rounded-lg border border-el-line bg-el-paper py-2 text-left shadow-el-md">
            <CommandEmpty className="px-4 py-4 text-left text-[13px] text-el-taupe-ink">
              No matches for “{query.trim()}”.
            </CommandEmpty>
            {results.cases.length > 0 ? (
              <CommandGroup>
                {results.cases.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={() => {
                      setQuery("")
                      setCaseId(item.id)
                    }}
                    className="rounded-none px-4 py-2 data-selected:bg-el-cream"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] leading-5">{item.title}</span>
                      <span className="block text-[11px] tracking-[0.12em] text-el-taupe-ink uppercase">Case</span>
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
            {results.products.length > 0 ? (
              <CommandGroup>
                {results.products.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={() => {
                      setQuery("")
                      setProductId(item.id)
                    }}
                    className="rounded-none px-4 py-2 data-selected:bg-el-cream"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] leading-5">{item.name}</span>
                      <span className="block text-[11px] tracking-[0.12em] text-el-taupe-ink uppercase">Product</span>
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
          </CommandList>
        ) : null}
      </Command>
      {caseId ? <CaseDialog id={caseId} onClose={() => setCaseId(null)} /> : null}
      {productId ? <ProductDialog id={productId} onClose={() => setProductId(null)} /> : null}
    </>
  )
}
