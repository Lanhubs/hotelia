import { useEffect } from 'react'

export function useDocumentTitle(title?: string, description?: string) {
  useEffect(() => {
    if (title) {
      document.title = title.includes('KEO')
        ? title
        : `${title} · KEO Experience Hotel & Events`
    }
    if (description) {
      const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
      if (meta) meta.content = description
    }
  }, [title, description])
}