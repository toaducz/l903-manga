import { request } from '@/codebase/utils/request'
import { Manga, DataResponse } from '../paginate'
import { queryOptions } from '@tanstack/react-query'
import { CommonRequest } from '../common'

type SearchRequest = {
  title: string
  offset: number
  limit: number
}

export const searchManga = ({ title, offset, limit }: SearchRequest) => {
  return queryOptions({
    queryKey: ['search', offset, limit, title],
    queryFn: () =>
      request<DataResponse<Manga>>(`manga/`, 'GET', {
        title: title,
        'order[followedCount]': 'desc',
        limit: limit,
        'availableTranslatedLanguage[]': 'en',
        'includes[]': 'cover_art',
        offset: offset
      }),
    staleTime: 5 * 60 * 1000
  })
}

export const getNewManga = ({ offset = 0, limit = 10 }: CommonRequest) => {
  return queryOptions({
    queryKey: ['get-new-manga', offset, limit],
    queryFn: () =>
      request<DataResponse<Manga>>(`manga/`, 'GET', {
        // 'order[updatedAt]': 'desc',
        limit: limit,
        'availableTranslatedLanguage[]': ['vi'],
        'includes[]': 'cover_art',
        offset: offset,
        'order[latestUploadedChapter]': 'desc',
        'order[year]': 'desc'
      }),
    staleTime: 60 * 60 * 1000
  })
}
