import { existsSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"
import { ACCESSORY_SET_REFERENCE_LABEL } from "@/lib/types"
import { CASES } from "./cases"
import { ACCESSORY_IMAGES, accessoryImageFor } from "./accessory-images"

const PUBLIC_DIR = path.resolve(import.meta.dirname, "../../../public")

const caseItems = CASES.flatMap((item) => item.items.map((piece) => ({ caseId: item.id, piece })))

describe("accessory image mapping", () => {
  it("covers every listed accessory exactly once", () => {
    expect(caseItems).toHaveLength(94)
    expect(ACCESSORY_IMAGES).toHaveLength(94)
    const keys = ACCESSORY_IMAGES.map((entry) => `${entry.caseId}::${entry.name}`)
    expect(new Set(keys).size).toBe(94)
    expect(keys.sort()).toEqual(caseItems.map((entry) => `${entry.caseId}::${entry.piece.name}`).sort())
  })

  it("gives every accessory a real same-case image and a kind", () => {
    for (const { caseId, piece } of caseItems) {
      expect(piece.image, `${caseId} ${piece.name}`).toMatch(new RegExp(`^/demo/cases/${caseId}/`))
      expect(piece.image).toBeTruthy()
      expect(piece.imageKind === "isolated" || piece.imageKind === "set-reference" || piece.imageKind === "context").toBe(true)
      const file = path.join(PUBLIC_DIR, piece.image!.slice(1))
      expect(existsSync(file), file).toBe(true)
      expect(piece.productId, `${caseId} ${piece.name} should not invent a SKU`).toBeUndefined()
    }
  })

  it("does not point accessories at another case's files", () => {
    for (const entry of ACCESSORY_IMAGES) {
      expect(entry.image.startsWith(`/demo/cases/${entry.caseId}/`)).toBe(true)
    }
  })

  it("keeps known isolated packshots on the clear single stills", () => {
    expect(accessoryImageFor("case-02", "STAMP")).toMatchObject({ image: "/demo/cases/case-02/02.jpg", kind: "isolated" })
    expect(accessoryImageFor("case-02", "MAKEUP BAG")).toMatchObject({ image: "/demo/cases/case-02/05.jpg", kind: "isolated" })
    expect(accessoryImageFor("case-08", "HAND CREAM STORAGE POUCH")).toMatchObject({
      image: "/demo/cases/case-08/01.jpg",
      kind: "isolated",
    })
    expect(accessoryImageFor("case-09", "HANDHELD MIRROR")).toMatchObject({
      image: "/demo/cases/case-09/01.jpg",
      kind: "isolated",
    })
    expect(accessoryImageFor("case-17", "PHONE CASE")).toMatchObject({ image: "/demo/cases/case-17/04.jpg", kind: "isolated" })
    expect(accessoryImageFor("case-21", "TOTE BAG")).toMatchObject({ image: "/demo/cases/case-21/03.jpg", kind: "isolated" })
    expect(accessoryImageFor("case-21", "PLUSH TOY")).toMatchObject({ image: "/demo/cases/case-21/01.jpg", kind: "isolated" })
    expect(accessoryImageFor("case-21", "POUCH")).toMatchObject({ image: "/demo/cases/case-21/09.jpg", kind: "isolated" })
    expect(accessoryImageFor("case-07", "HAIR CLAW CLIP")).toMatchObject({
      image: "/demo/cases/case-07/02.jpg",
      kind: "isolated",
    })
  })

  it("labels uncertain or group stills as set reference or context, not as a single SKU", () => {
    expect(ACCESSORY_SET_REFERENCE_LABEL).toBe("Set reference / 套装参考图")
    expect(accessoryImageFor("case-01", "MINI MAKEUP BAG").kind).toBe("set-reference")
    expect(accessoryImageFor("case-13", "MUG").kind).toBe("set-reference")
    expect(accessoryImageFor("case-13", "INSULATED TUMBLER").kind).toBe("set-reference")
    expect(accessoryImageFor("case-21", "CHARM")).toMatchObject({
      image: "/demo/cases/case-21/05.jpg",
      kind: "set-reference",
    })
    expect(accessoryImageFor("case-06", "SILK SCARF").kind).toBe("context")
    expect(accessoryImageFor("case-23", "HAIR CLIP").kind).toBe("context")
    const wired = caseItems.filter((entry) => entry.piece.imageKind !== "isolated")
    expect(wired.length).toBeGreaterThan(0)
    expect(wired.every((entry) => entry.piece.imageKind === "set-reference" || entry.piece.imageKind === "context")).toBe(true)
  })

  it("reports isolated versus context counts without treating the catalog as all packshots", () => {
    const isolated = ACCESSORY_IMAGES.filter((entry) => entry.kind === "isolated")
    const setReference = ACCESSORY_IMAGES.filter((entry) => entry.kind === "set-reference")
    const context = ACCESSORY_IMAGES.filter((entry) => entry.kind === "context")
    expect(isolated.length + setReference.length + context.length).toBe(94)
    expect(isolated).toHaveLength(32)
    expect(setReference).toHaveLength(60)
    expect(context).toHaveLength(2)
  })
})
