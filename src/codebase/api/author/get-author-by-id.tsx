import { request } from '@/codebase/utils/request'
import { Author, Detail } from '../paginate'
import { queryOptions } from '@tanstack/react-query'

type AuthorByIdRequest = {
  id: string
}

export const getAuthorById = ({ id }: AuthorByIdRequest) => {
  return queryOptions({
    queryKey: ['get-author-by-id', id],
    queryFn: () =>
      request<Detail<Author>>(`author/${id}`, 'GET', {
        'includes[]': 'cover_art'
      }),
    enabled: !!id
  })
}
