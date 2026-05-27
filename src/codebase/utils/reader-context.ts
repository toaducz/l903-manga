export interface ReaderContext {
  mangaId: string
  offset: string | number
  langFilterValue: string | string[]
  langValue: string
  order: string
}

export const saveReaderContext = (context: ReaderContext) => {
  if (typeof window === 'undefined') return
  sessionStorage.setItem('reader_context', JSON.stringify(context))
}

export const getReaderContext = (): ReaderContext | null => {
  if (typeof window === 'undefined') return null
  const ctx = sessionStorage.getItem('reader_context')
  return ctx ? JSON.parse(ctx) : null
}
