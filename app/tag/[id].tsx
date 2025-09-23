import React, { useState, useMemo, useEffect } from 'react'
import { View, FlatList, ActivityIndicator, Text, StyleSheet, TouchableOpacity, BackHandler } from 'react-native'
import { useInfiniteQuery } from '@tanstack/react-query'
import { request } from '@/utils/request'
import { Manga, DataResponse } from '@/api/paginate'
import MangaItem from '@/components/manga/manga-items'
import FilterSelection from '@/components/filter/filter-selection'
import { SafeAreaView } from 'react-native-safe-area-context'
import Loading from '@/components/status/loading'
import Error from '@/components/status/error'
import { useLocalSearchParams } from 'expo-router'
import { useNavigation } from 'expo-router'

export default function FilterMangaScreen() {
  const { id } = useLocalSearchParams()
  const tagId = String(id)
  const limit = 20
  const [selectedTags, setSelectedTags] = useState<string[]>([tagId])
  const [sortBy, setSortBy] = useState<'followedCount' | 'latestUploadedChapter' | 'year'>('followedCount')
  const [rating, setRating] = useState<Array<'safe' | 'suggestive' | 'erotica' | 'pornographic'>>(['safe'])
  const [showFilter, setShowFilter] = useState(false) // mặc định ẩn

  // handle back button
  const navigation = useNavigation()

  useEffect(() => {
    const backAction = () => {
      if (showFilter) {
        setShowFilter(false)
        return true // chặn back
      } else if (navigation.canGoBack()) {
        navigation.goBack() // pop màn hình
        return true // đã xử lý
      }
      return false // để hệ thống xử lý (thường thoát app nếu màn hình đầu)
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)

    return () => backHandler.remove()
  }, [showFilter, navigation])

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useInfiniteQuery({
    queryKey: ['get-filter-manga', selectedTags, sortBy, rating],
    queryFn: ({ pageParam = 0 }): Promise<DataResponse<Manga>> => {
      const params: Record<string, any> = {
        limit,
        title: '',
        offset: pageParam,
        'availableTranslatedLanguage[]': 'en',
        'includes[]': 'cover_art',
        'includedTags[]': selectedTags,
        'order[followedCount]': sortBy === 'followedCount' ? 'desc' : 'asc',
        'order[latestUploadedChapter]': sortBy === 'latestUploadedChapter' ? 'desc' : 'asc',
        'order[year]': sortBy === 'year' ? 'desc' : 'asc',
        'contentRating[]': rating
      }
      return request<DataResponse<Manga>>('manga/', 'GET', params)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.length * limit
      return totalLoaded < lastPage.total ? totalLoaded : undefined
    }
  })

  const mangas = useMemo(() => data?.pages.flatMap(page => page.data) ?? [], [data])

  // Clone danh sách manga và thêm 1 placeholder cho đỡ bẩn mắt
  const displayedMangas = useMemo(() => {
    if (!mangas || mangas.length === 0) return []

    const list = [...mangas]
    const isOdd = list.length % 2 !== 0

    if (isOdd) {
      list.push({ id: 'placeholder' } as any)
    }

    return list
  }, [mangas])

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size='large' color='#60a5fa' />
          <Text style={styles.loadingText}>Đang tải thêm...</Text>
        </View>
      )
    }
    if (!hasNextPage && mangas.length > 0) {
      return (
        <View style={styles.endFooter}>
          <Text style={styles.endText}>Đã hiển thị tất cả kết quả</Text>
        </View>
      )
    }
  }

  if (isError) {
    console.log(error)
    return <Error />
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Button toggle */}
      <View style={{ paddingVertical: 12, alignItems: 'center' }}>
        <TouchableOpacity style={styles.toggleBtn} onPress={() => setShowFilter(prev => !prev)}>
          <Text style={styles.toggleText}>{showFilter ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}</Text>
        </TouchableOpacity>
      </View>

      {/* Filter toàn màn hình */}
      {showFilter && (
        <View style={styles.fullScreenFilter}>
          <FilterSelection
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            sortBy={sortBy}
            setSortBy={setSortBy}
            rating={rating}
            setRating={setRating}
          />
        </View>
      )}

      {/* Content */}
      {!showFilter &&
        (isLoading ? (
          <Loading />
        ) : (
          <FlatList
            data={displayedMangas}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={displayedMangas.length > 0 ? styles.row : undefined}
            renderItem={({ item }) => {
              if (item.id === 'placeholder') {
                return <View style={[styles.gridItem, { backgroundColor: 'transparent' }]} />
              }
              return (
                <View style={styles.gridItem}>
                  <MangaItem manga={item} />
                </View>
              )
            }}
            onEndReached={() => hasNextPage && fetchNextPage()}
            onEndReachedThreshold={0.3}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
          />
        ))}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  toggleBtn: {
    paddingVertical: 12,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    width: '60%'
  },
  toggleText: { color: '#fff', fontWeight: '600' },
  fullScreenFilter: {
    flex: 1,
    backgroundColor: '#0f172a'
  },
  row: { justifyContent: 'space-between' },
  gridItem: { flex: 1, margin: 4 },
  loadingFooter: { padding: 20, alignItems: 'center' },
  loadingText: { color: '#e5e7eb', marginTop: 8 },
  endFooter: { padding: 20, alignItems: 'center' },
  endText: { color: '#6b7280', fontStyle: 'italic' }
})
