import { getMangaById } from '@/codebase/api/manga/get-manga-by-id'
import MangaDetailPage from '@/components/views/manga-detail-page'
import MangaDetailMobile from '@/app/manga-detail/components/manga-detail-mobile'
import ErrorComponent from '@/components/status/error'
import { QueryFunctionContext, QueryKey } from '@tanstack/react-query'

export const revalidate = 3600 // Cache manga details for 1 hour on CDN

interface Props {
  params: Promise<{ id: string }>
}

interface QueryOptionsWithFn<T, K extends QueryKey = QueryKey> {
  queryFn?: (context: QueryFunctionContext<K>) => T | Promise<T>
}

async function fetchQuery<T, K extends QueryKey = QueryKey>(
  options: QueryOptionsWithFn<T, K>
): Promise<T> {
  if (!options.queryFn) {
    throw new Error('queryFn is undefined')
  }
  const context = {
    queryKey: [] as unknown as K,
    signal: new AbortController().signal,
    meta: undefined
  }
  return Promise.resolve(options.queryFn(context as unknown as QueryFunctionContext<K>))
}

export default async function MangaDetailPageWrapper({ params }: Props) {
  const { id } = await params

  try {
    const manga = await fetchQuery(getMangaById({ id }))

    if (!manga?.data) {
      return <ErrorComponent message='Không tìm thấy truyện' />
    }

    return (
      <div className="bg-black">
        <div className="hidden md:block">
          <MangaDetailPage manga={manga.data} />
        </div>
        <div className="block md:hidden">
          <MangaDetailMobile manga={manga.data} />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Failed to fetch manga details on server', error)
    return <ErrorComponent message='Lỗi khi tải thông tin truyện từ server. Vui lòng kiểm tra lại đường truyền mạng hoặc liên kết.' />
  }
}
