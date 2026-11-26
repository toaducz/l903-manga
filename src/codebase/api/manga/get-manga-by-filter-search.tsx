import { request } from '@/codebase/utils/request'
import { Manga, DataResponse } from '../paginate'
import { queryOptions } from '@tanstack/react-query'

type GetMangaByFilterSearchRequest = {
  id?: string[]
  title?: string
  offset: number
  limit: number
  publicationDemographic?: string
  followedCount?: string
  latestUploadedChapter?: string
  year?: string
  contentRating?: string[]
}

export const GetMangaByFilterSearch = ({
  id = [],
  offset,
  limit,
  publicationDemographic = 'none',
  title = '',
  followedCount = 'desc',
  latestUploadedChapter = 'desc',
  year = 'desc',
  contentRating = ['safe', 'suggestive', 'erotica']
}: GetMangaByFilterSearchRequest) => {
  return queryOptions({
    queryKey: [
      'get-top-manga-by-tag-id',
      id,
      offset,
      publicationDemographic,
      title,
      followedCount,
      latestUploadedChapter,
      year,
      contentRating,
      'includedTags[]'
    ],
    queryFn: () => {
      const params: Record<string, string | number | string[]> = {
        // 'order[followedCount]': 'desc',
        limit: limit,
        'availableTranslatedLanguage[]': 'en',
        'includes[]': 'cover_art',
        offset: offset,
        'publicationDemographic[]': [publicationDemographic],
        'order[latestUploadedChapter]': latestUploadedChapter,
        'order[year]': year
      }

      // Chỉ thêm includedTags[] nếu id có giá trị
      if (id) {
        params['includedTags[]'] = id
      }

      if (title) {
        params['title'] = title
      }

      if (followedCount) {
        params['order[followedCount]'] = followedCount
      }

      if (contentRating) {
        params['contentRating[]'] = contentRating
      }

      return request<DataResponse<Manga>>('manga/', 'GET', params)
    },
    staleTime: 60 * 60 * 1000
  })
}
