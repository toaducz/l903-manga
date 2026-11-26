import { request } from '@/codebase/utils/request'
import { Manga, DataResponse } from '../paginate'
import { queryOptions } from '@tanstack/react-query'

type TopMangaByTagIdRequest = {
  id?: string[]
  offset: number
  limit: number
  publicationDemographic?: string
}

export const getTopMangaByTagId = ({
  id = [],
  offset,
  limit,
  publicationDemographic = 'none'
}: TopMangaByTagIdRequest) => {
  return queryOptions({
    queryKey: ['get-top-manga-by-tag-id', id, offset, publicationDemographic, limit],
    queryFn: () => {
      const params: Record<string, string | number | string[]> = {
        // 'order[followedCount]': 'desc',
        limit: limit,
        'availableTranslatedLanguage[]': 'en',
        'includes[]': 'cover_art',
        offset: offset,
        'publicationDemographic[]': [publicationDemographic],
        'order[latestUploadedChapter]': 'desc',
        'order[year]': 'desc'
      }

      // Chỉ thêm includedTags[] nếu id có giá trị
      if (id) {
        params['includedTags[]'] = id
      }

      return request<DataResponse<Manga>>('manga/', 'GET', params)
    },
    staleTime: 60 * 60 * 1000
  })
}
