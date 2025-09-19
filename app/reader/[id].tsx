import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { getChapterDetailById } from '@/api/chapter/get-detail-chapter-by-id'
import ChapterReaderScreen from '../screen/chapter-reader-screen'
import Loading from '@/components/status/loading'
import Error from '@/components/status/error'
import { useLocalSearchParams } from 'expo-router'

export default function MangaReaderPageWrapper() {
  return <MangaReaderContent />
}

function MangaReaderContent() {
  const { id, mangaId } = useLocalSearchParams()
  const chapterId = String(id)

  const backgroundColor = '#0f172a'

  const { data: chapters, isFetching, isError } = useQuery(getChapterDetailById({ id: chapterId }))

  if (isFetching) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Loading />
      </View>
    )
  }

  if (isError || !chapters?.chapter) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Error />
      </View>
    )
  }

  return (
    <View style={[styles.container, { flex: 1, backgroundColor }]}>
      <ChapterReaderScreen chapterDetail={chapters} mangaId={String(mangaId)} currentChapter={chapterId} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 32
  }
})
