"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2, Sparkles, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { toast } from "sonner"
import { product } from "@/data"
import { campaignShort } from "@/lib/catalog"
import { money } from "@/lib/dates"
import { fromPrice } from "@/lib/pricing"
import { BASKET, GREETING, HOME_SUGGESTIONS, LNY_NOTES, LNY_PROJECT, Q, routeAdvisor } from "@/lib/chat/script"
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtStep,
} from "@/components/ai-elements/chain-of-thought"
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation"
import { InlineCitation, InlineCitationCard, InlineCitationCardBody } from "@/components/ai-elements/inline-citation"
import { Message, MessageContent } from "@/components/ai-elements/message"
import { PromptInput, PromptInputSubmit, PromptInputTextarea } from "@/components/ai-elements/prompt-input"
import { Source, Sources, SourcesContent, SourcesTrigger } from "@/components/ai-elements/sources"
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion"
import { PlaceholderImage } from "@/components/media/placeholder-image"
import { ProductDialog } from "@/components/products/product-dialog"
import { HoverCardTrigger } from "@/components/ui/hover-card"
import { useChat, type ChatLine, type ChatStep } from "@/stores/chat"
import { useRfq } from "@/stores/rfq"

export function AdvisorPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter()
  const add = useRfq((state) => state.add)
  const lines = useChat((state) => state.lines)
  const setLines = useChat((state) => state.setLines)
  const [productId, setProductId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const stop = useRef(false)

  function patchAdvisor(patch: Partial<ChatLine>) {
    setLines((current) => {
      const next = [...current]
      const last = next.at(-1)
      if (last?.role !== "advisor") return current
      next[next.length - 1] = { ...last, ...patch }
      return next
    })
  }

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || busy) return
    stop.current = false
    setBusy(true)
    setLines((current) => [...current, { role: "user", text: trimmed }])
    const turn = routeAdvisor(trimmed)
    const steps: ChatStep[] = turn.steps.map((label) => ({ label, status: "active" }))
    setLines((current) => [...current, { role: "advisor", text: "", steps: steps.length ? steps : undefined }])
    for (let index = 0; index < steps.length; index += 1) {
      if (stop.current) break
      await new Promise((resolve) => window.setTimeout(resolve, 350))
      steps[index] = { ...steps[index], status: "complete" }
      patchAdvisor({ steps: [...steps] })
    }
    const words = turn.reply.split(/(\s+)/)
    let spoken = ""
    for (let index = 0; index < words.length; index += 1) {
      if (stop.current) {
        spoken = turn.reply
        break
      }
      spoken = words.slice(0, index + 1).join("")
      patchAdvisor({ text: spoken })
      await new Promise((resolve) => window.setTimeout(resolve, 22))
    }
    patchAdvisor({
      text: spoken,
      steps: steps.map((step) => ({ ...step, status: "complete" })),
      cards: turn.cards,
      citations: turn.citations,
      addAll: turn.addAll,
      exportRfq: turn.exportRfq,
      followUps: turn.followUps,
    })
    setBusy(false)
  }

  function addBasket() {
    const result = add([...BASKET], { project: LNY_PROJECT, notes: LNY_NOTES })
    toast(`${result.added} items added to RFQ List`)
    const total = useRfq
      .getState()
      .lines.filter((line) => line.selected)
      .reduce((sum, line) => sum + line.qty * product(line.productId).priceTiers.find((tier) => line.qty >= tier.moq)!.unitPrice, 0)
    setLines((current) => [
      ...current,
      {
        role: "advisor",
        text: `Added ${result.added} items to your RFQ List at MOQ quantities${result.skipped ? ` (${result.skipped} already there)` : ""} — estimated ${money(total, 0)} in total.`,
        followUps: [Q.draftEmail],
      },
    ])
  }

  return (
    <AnimatePresence>
    {open ? (
    <motion.aside
      data-advisor="true"
      initial={{ x: "100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "100%", opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-[80px] right-4 bottom-4 z-30 flex w-[420px] flex-col rounded-[10px] border border-el-line bg-el-canvas shadow-[0_-8px_20px_rgb(26_20_16/0.05),0_10px_24px_rgb(26_20_16/0.07)]"
    >
      <header className="flex h-16 items-center justify-between px-5">
        <p className="flex items-center gap-2 font-serif text-[18px] leading-6">
          <Sparkles className="size-4 text-el-gold" strokeWidth={1.5} />
          GoodFlow
        </p>
        <button type="button" aria-label="Close advisor" onClick={onClose}>
          <X className="size-4" strokeWidth={1.5} />
        </button>
      </header>
      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="space-y-5 px-5 pb-4">
        {lines.length === 0 ? (
          <div>
            <Sparkles className="size-8 text-el-gold" strokeWidth={1.5} />
            <p className="mt-4 text-[14px] leading-[22px]">{GREETING}</p>
            <p className="mt-6 text-[11px] leading-4 text-el-taupe-ink">
              Answers use Estée Lauder Archive and GoodFlow public data.
            </p>
          </div>
        ) : (
          lines.map((line, index) =>
            line.role === "user" ? (
              <Message key={`${line.role}-${index}`} from="user">
                <MessageContent className="rounded-[10px] bg-el-black px-3 py-2 text-[14px] leading-[22px] text-el-ivory">
                  {line.text}
                </MessageContent>
              </Message>
            ) : (
              <Message key={`${line.role}-${index}`} from="assistant">
                <p className="text-[11px] font-semibold tracking-[0.16em] text-el-taupe-ink uppercase">GoodFlow</p>
                {line.steps?.length ? <AdvisorSteps steps={line.steps} /> : null}
                {line.text ? (
                  <MessageContent className="text-[14px] leading-[22px]">
                    <CitedText text={line.text} citations={line.citations} onOpen={setProductId} />
                  </MessageContent>
                ) : null}
                {line.citations?.length ? (
                  <Sources>
                    <SourcesTrigger count={line.citations.length} className="text-[12px] text-el-taupe-ink">
                      <span>Sources · {line.citations.length}</span>
                    </SourcesTrigger>
                    <SourcesContent>
                      {line.citations.map((id) => (
                        <Source key={id} title={product(id).name} onClick={() => setProductId(id)} />
                      ))}
                    </SourcesContent>
                  </Sources>
                ) : null}
                {line.cards ? (
                  <div className="space-y-2">
                    {line.cards.map((id) => {
                      const item = product(id)
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setProductId(id)}
                          className="flex h-[72px] w-full items-center gap-3 rounded-md bg-el-paper px-2 text-left"
                        >
                          <span className="size-14 overflow-hidden rounded-md bg-el-cream">
                            <PlaceholderImage label={item.name} src={item.images[0]} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13px] font-medium">{item.name}</span>
                            <span className="block text-[12px] tabular-nums text-el-taupe-ink">
                              {money(fromPrice(item))} · MOQ {item.priceTiers[0].moq.toLocaleString("en-US")}
                            </span>
                          </span>
                        </button>
                      )
                    })}
                  </div>
                ) : null}
                {line.addAll ? (
                  <button
                    type="button"
                    onClick={addBasket}
                    className="h-9 w-fit rounded-md bg-el-black px-4 text-[12px] font-semibold tracking-[0.1em] text-el-ivory uppercase"
                  >
                    Add all 4 to RFQ
                  </button>
                ) : null}
                {line.exportRfq ? (
                  <button
                    type="button"
                    onClick={() => router.push("/rfq?export=1")}
                    className="h-9 w-fit rounded-md bg-el-black px-4 text-[12px] font-semibold tracking-[0.1em] text-el-ivory uppercase"
                  >
                    Review & export
                  </button>
                ) : null}
              </Message>
            ),
          )
        )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="px-4 pt-2 pb-4">
        <Suggestions className="mb-3 w-full flex-col items-stretch gap-2 whitespace-normal">
          {(lines.at(-1)?.role === "advisor" ? lines.at(-1)?.followUps : HOME_SUGGESTIONS)?.map((item) => (
            <Suggestion
              key={item}
              suggestion={item}
              onClick={(value) => void send(value)}
              className="h-auto w-full justify-start rounded-lg border-el-line bg-el-paper px-3 py-2 text-left text-[13px] leading-5 font-normal whitespace-normal hover:border-el-gold"
            />
          ))}
        </Suggestions>
        <PromptInput
          className="[&_[data-slot=input-group]]:h-auto [&_[data-slot=input-group]]:flex-col [&_[data-slot=input-group]]:items-stretch [&_[data-slot=input-group]]:rounded-[14px] [&_[data-slot=input-group]]:border-el-line [&_[data-slot=input-group]]:bg-el-paper [&_[data-slot=input-group]]:p-2 [&_[data-slot=input-group]]:shadow-none [&_[data-slot=input-group]]:focus-within:border-el-gold [&_[data-slot=input-group]]:focus-within:ring-2 [&_[data-slot=input-group]]:focus-within:ring-el-gold/40"
          onSubmit={({ text }) => {
            void send(text)
          }}
        >
          <PromptInputTextarea
            placeholder="Ask about past products, budgets or trends…"
            className="max-h-24 min-h-10 w-full resize-none border-0 bg-transparent px-2 py-1.5 text-[14px] leading-[22px] shadow-none focus-visible:ring-0"
          />
          <div className="flex justify-end">
            <PromptInputSubmit
              status={busy ? "streaming" : "ready"}
              onStop={() => {
                stop.current = true
              }}
              className="size-8 shrink-0 rounded-full bg-el-black text-el-ivory hover:bg-el-black hover:text-el-gold"
            />
          </div>
        </PromptInput>
      </div>
      {productId ? <ProductDialog id={productId} onClose={() => setProductId(null)} /> : null}
    </motion.aside>
    ) : null}
    </AnimatePresence>
  )
}

function AdvisorSteps({ steps }: { steps: ChatStep[] }) {
  const done = steps.every((step) => step.status === "complete")
  return (
    <ChainOfThought defaultOpen={!done} className="space-y-2">
      <ChainOfThoughtHeader className="text-[12px] text-el-taupe-ink">
        {done ? `${steps.length} steps` : "Looking it up"}
      </ChainOfThoughtHeader>
      <ChainOfThoughtContent>
        {steps.map((step) => (
          <ChainOfThoughtStep
            key={step.label}
            label={step.label}
            status={step.status}
            icon={step.status === "complete" ? Check : Loader2}
            className={step.status === "complete" ? "text-[12px] text-el-taupe-ink" : "text-[12px] text-el-taupe-ink [&_svg]:animate-spin"}
          />
        ))}
      </ChainOfThoughtContent>
    </ChainOfThought>
  )
}

function CitedText({
  text,
  citations = [],
  onOpen,
}: {
  text: string
  citations?: string[]
  onOpen: (id: string) => void
}) {
  const parts = text.split(/(\[\d+\])/g)
  return (
    <>
      {parts.map((part, index) => {
        const mark = part.match(/^\[(\d+)\]$/)
        const id = mark ? citations[Number(mark[1]) - 1] : undefined
        if (!id) return <span key={index}>{part}</span>
        const item = product(id)
        return (
          <InlineCitation key={index}>
            <InlineCitationCard>
              <HoverCardTrigger
                render={
                  <button
                    type="button"
                    onClick={() => onOpen(id)}
                    className="mx-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded bg-el-cream px-1 align-super text-[10px] text-el-gold-deep"
                  />
                }
              >
                {mark?.[1]}
              </HoverCardTrigger>
              <InlineCitationCardBody className="w-64 rounded-lg border-el-line bg-el-paper p-3">
                <span className="flex items-center gap-3">
                  <span className="size-12 shrink-0 overflow-hidden rounded-md bg-el-cream">
                    <PlaceholderImage label={item.name} src={item.images[0]} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-medium">{item.name}</span>
                    <span className="mt-0.5 block text-[12px] text-el-taupe-ink">
                      {item.source === "archive" ? campaignShort(item) : `By ${item.maker}`}
                    </span>
                  </span>
                </span>
              </InlineCitationCardBody>
            </InlineCitationCard>
          </InlineCitation>
        )
      })}
    </>
  )
}
