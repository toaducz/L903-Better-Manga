import React, { useState, useMemo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ToastAndroid, Platform, ActivityIndicator } from 'react-native'
import { useQueries } from '@tanstack/react-query'
import { getMangaById } from '@/api/manga/get-detail-manga-by-id'
import { Manga } from '@/api/paginate'
import MangaItem from './manga-items'
import { Picker } from '@react-native-picker/picker' // chọn filter
import Error from '../status/error'
import MangaGrid from './manga-grid'

type RelatedMangaProps = {
  ids: string[]
}

export default function RelatedManga({ ids }: RelatedMangaProps) {
  const pageSize = 10
  const [page, setPage] = useState(0)
  const [selectedRating, setSelectedRating] = useState<'all' | 'hide-pornographic'>('hide-pornographic')
  const pickerEnable = true
  const totalPages = Math.ceil(ids.length / pageSize)

  const currentIds = useMemo(() => {
    return ids.slice(page * pageSize, (page + 1) * pageSize)
  }, [ids, page])

  const mangaQueries = useQueries({
    queries: currentIds.map(id => getMangaById({ id }))
  })

  const isLoading = mangaQueries.some(query => query.isLoading)
  const isError = mangaQueries.some(query => query.isError)
  // debug
  const errors = mangaQueries.map(query => query.error).filter(Boolean)

  const mangaList = mangaQueries.filter(query => query.data).map(query => query.data!.data as Manga)

  const displayedManga = (() => {
    const list = mangaList.filter(manga => {
      if (!manga || !manga.attributes) return false
      if (selectedRating === 'all') return true
      return manga.attributes.contentRating !== 'pornographic'
    })

    // Nếu lẻ thì push thêm placeholder cho đỡ bẩn mắt
    if (list.length % 2 !== 0) {
      list.push({ id: 'placeholder' } as any)
      // console.log(list)
    }

    return list
  })()

  if (currentIds.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Không có manga liên quan</Text>
      </View>
    )
  }

  if (isLoading) {
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size='large' color='#fff' />
      </View>
    )
  }

  if (isError) {
    // console.log(errors)
    return (
      <View style={styles.center}>
        <Error />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (Platform.OS === 'android' && !pickerEnable) {
            ToastAndroid.show('Picker bị khóa! Hẹ hẹ', ToastAndroid.SHORT)
          }
        }}
      >
        <Picker
          selectedValue={selectedRating}
          onValueChange={value => setSelectedRating(value)}
          style={styles.picker}
          enabled={pickerEnable}
        >
          <Picker.Item label='Hiện tất cả' value='all' />
          <Picker.Item label='Mặc định' value='hide-pornographic' />
        </Picker>
      </TouchableOpacity>
      {displayedManga.length > 0 ? (
        <MangaGrid mangas={displayedManga} />
      ) : (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Không có manga phù hợp</Text>
        </View>
      )}

      <View style={styles.pagination}>
        <TouchableOpacity
          onPress={() => setPage(prev => Math.max(prev - 1, 0))}
          disabled={page === 0}
          style={[styles.button, page === 0 && styles.disabled]}
        >
          <Text style={styles.buttonText}>Lùi</Text>
        </TouchableOpacity>

        <Text style={styles.pageText}>
          Trang {page + 1} / {totalPages}
        </Text>

        <TouchableOpacity
          onPress={() => setPage(prev => Math.min(prev + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
          style={[styles.button, page >= totalPages - 1 && styles.disabled]}
        >
          <Text style={styles.buttonText}>Tiến</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { color: 'gray', fontSize: 16 },
  picker: { backgroundColor: '#333', color: 'white', marginBottom: 10, borderRadius: 16 },
  grid: { gap: 10 },
  itemWrapper: {
    flex: 1,
    margin: 5,
    minHeight: 140,
    maxHeight: 450
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 20
  },
  button: {
    backgroundColor: '#0011adff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginHorizontal: 12
  },
  disabled: { opacity: 0.5 },
  buttonText: { color: 'white' },
  pageText: { color: 'white' }
})
