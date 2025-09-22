import { request } from '@/utils/request'
import { Manga, Detail } from '../paginate'
import { queryOptions } from '@tanstack/react-query'

type MangaByIdRequest = {
  id: string
  contentRating?: string
}

export const getMangaById = ({ id, contentRating = 'safe' }: MangaByIdRequest) => {
  return queryOptions({
    queryKey: ['get-manga-by-id', id],
    queryFn: () =>
      request<Detail<Manga>>(`manga/${id}`, 'GET', {
        'includes[]': 'cover_art',
        'contentRating[]': contentRating
      })
  })
}
