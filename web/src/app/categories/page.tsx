import { CategoryBrowser } from "@/components/products/category-browser"

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") query.set(key, value)
  }

  return (
    <main className="mx-auto max-w-[1360px] px-10 py-14">
      <CategoryBrowser query={query.toString()} />
    </main>
  )
}
