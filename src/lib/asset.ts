/** Resolve a path in `public/` against the deploy base.
 *
 * Vite rewrites asset URLs it can see at build time (imports, CSS `url()`,
 * index.html), but a path written as a runtime string in TSX is opaque to it.
 * On GitHub Pages the site is served from /PD-Portfolio/, so a bare
 * "/assets/x.svg" would resolve to the domain root and 404. Everything under
 * public/ therefore goes through here. */
export function asset(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\/+/, '')
}
