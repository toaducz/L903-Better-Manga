import { queryOptions } from '@tanstack/react-query'

type Chapter = {
  hash: string
  data: string[]
  dataSaver: string[]
}

export type ChapterDetail = {
  result: string
  baseUrl: string
  chapter: Chapter
}

interface GetChaptersDetailByMangaIdParams {
  id: string
}

export const getChapterDetailById = ({ id }: GetChaptersDetailByMangaIdParams) => {
  return queryOptions({
    queryKey: ['chapter-detail-by-manga-id', id],
    queryFn: async (): Promise<ChapterDetail> => {
      const res = await fetch(`https://api.mangadex.org/at-home/server/${id}`)
      if (!res.ok) {
        throw new Error('Lỗi rồi!')
      }
      return res.json()
    }
  })
}
