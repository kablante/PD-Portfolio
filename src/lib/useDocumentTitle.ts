import { useEffect } from 'react'

/** Sets `document.title` for the current route - this is a client-rendered
 * SPA with a single static `<title>` in index.html, so without this every
 * route (and both project-page languages) would show the same generic tag
 * in a browser tab, bookmark, or search snippet. Restores the previous
 * title on unmount so navigating away (e.g. back to Home) doesn't leave a
 * stale one hanging if the next route's own effect hasn't run yet. */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previous = document.title
    document.title = title
    return () => {
      document.title = previous
    }
  }, [title])
}
