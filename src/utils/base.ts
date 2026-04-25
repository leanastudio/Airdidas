// Resolves public asset paths correctly for both local dev and GitHub Pages
export const BASE = import.meta.env.BASE_URL
export function asset(path: string) {
  return `${BASE}${path.replace(/^\//, '')}`
}
