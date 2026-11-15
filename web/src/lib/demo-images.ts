// Real files under public/. Unknown paths fall back to a typographic placeholder.
export function demoImage(src?: string) {
  if (!src) return undefined
  if (src.startsWith("/demo/") || src.startsWith("/brand/") || src.startsWith("/home-floating/")) return src
  return undefined
}
