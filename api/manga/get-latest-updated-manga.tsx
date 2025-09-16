import { request } from '@/utils/request'
import { Manga, DataResponse } from '../paginate'
import { queryOptions } from '@tanstack/react-query'
import { CommonRequest } from '../common'

export const getNewManga = ({ offset = 0, limit = 10 }: CommonRequest) => {
  return queryOptions({
    queryKey: ['get-new-manga', offset],
    queryFn: () =>
      request<DataResponse<Manga>>(`manga/`, 'GET', {
        // 'order[updatedAt]': 'desc',
        limit: limit,
        'availableTranslatedLanguage[]': ['vi'],
        'includes[]': 'cover_art',
        offset: offset,
        'order[latestUploadedChapter]': 'desc',
        'order[year]': 'desc'
      })
    // staleTime: 60 * 60
  })
}