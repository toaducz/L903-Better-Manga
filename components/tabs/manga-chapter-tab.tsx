import React, { useEffect, useState, useMemo } from 'react'
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Animated, ActivityIndicator } from 'react-native'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Picker } from '@react-native-picker/picker'
import { useRouter } from 'expo-router'
// import { getChaptersByMangaId } from "@/api/chapter/get-chapter-by-id";
import Loading from '../status/loading'
import Error from '../status/error'
import { getLanguageName } from '@/utils/enums'
import { formatDate } from '@/utils/format'
import { DataResponse } from '@/api/paginate'
import { request } from '@/utils/request'
import { Chapter } from '@/api/chapter/get-chapter-by-id'

interface MangaChaptersListProps {
  mangaId: string
  offsetParams?: number
  chapterId?: string
  langFilterValue?: string[]
  langValue?: string
  order?: string
}

const MangaChaptersList: React.FC<MangaChaptersListProps> = ({
  mangaId,
  offsetParams,
  chapterId,
  langFilterValue,
  langValue,
  order
}) => {
  const router = useRouter()
  const limit = 5

  const [sortOrder, setSortOrder] = useState(order ?? 'asc')
  const [lang, setLang] = useState<string>(langValue ?? 'all')
  const [langFilter, setLangFilter] = useState(langFilterValue ?? ['vi', 'en', 'ja'])
  const fadeAnim = useState(new Animated.Value(0))[0]

  // Sử dụng useInfiniteQuery thay vì useQuery
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } = useInfiniteQuery({
    queryKey: ['chapters-by-manga-id-infinite', mangaId, sortOrder, langFilter],
    queryFn: ({ pageParam = offsetParams ?? 0 }) =>
      request<DataResponse<Chapter>>(`/manga/${mangaId}/feed`, 'GET', {
        limit: limit,
        offset: pageParam,
        'translatedLanguage[]': langFilter,
        'order[chapter]': sortOrder,
        'includes[]': 'scanlation_group'
      }),
    initialPageParam: offsetParams ?? 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.length * limit
      return totalLoaded < lastPage.total ? totalLoaded : undefined
    }
  })

  const chapters = useMemo(() => {
    return data?.pages.flatMap(page => page.data) ?? []
  }, [data])

  // Total count từ page đầu tiên
  const totalCount = data?.pages[0]?.total ?? 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start()
  }, [])

  const handleLangChange = (selected: string) => {
    setLang(selected)
    if (selected === 'all') {
      setLangFilter(['vi', 'en'])
    } else {
      setLangFilter([selected])
    }
    // Refetch data khi thay đổi filter
    refetch()
  }

  const handleSortChange = (value: string) => {
    setSortOrder(value)
    // Refetch data khi thay đổi sort order
    refetch()
  }

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size='large' color='#60a5fa' />
          <Text style={styles.loadingText}>Đang tải thêm chapters...</Text>
        </View>
      )
    }

    return null
  }

  if (isLoading) return <Loading />
  if (isError) return <Error />

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Bộ lọc */}
      <View style={styles.filterRow}>
        <Picker
          selectedValue={sortOrder}
          onValueChange={handleSortChange}
          style={[styles.picker, { height: 'auto' }]}
          dropdownIconColor='#fff'
        >
          <Picker.Item label='Cũ nhất' value='asc' />
          <Picker.Item label='Mới nhất' value='desc' />
        </Picker>

        <Picker
          selectedValue={lang}
          onValueChange={handleLangChange}
          style={[styles.picker, { height: 'auto' }]}
          dropdownIconColor='#fff'
        >
          <Picker.Item label='Tất cả ngôn ngữ' value='all' />
          <Picker.Item label='Tiếng Việt' value='vi' />
          <Picker.Item label='Tiếng Anh' value='en' />
          <Picker.Item label='Tiếng Nhật' value='ja' />
        </Picker>
      </View>

      {/* Danh sách chapter */}
      {totalCount === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Không có bản dịch cho ngôn ngữ này!</Text>
        </View>
      ) : (
        <FlatList
          data={chapters}
          keyExtractor={item => item.id}
          onEndReached={handleLoadMore}
          scrollEnabled={false}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.chapterItem, item.id === chapterId ? styles.activeItem : styles.inactiveItem]}
              onPress={() => {
                router.push({
                  pathname: `/reader/[id]`,
                  params: { id: item.id, mangaId: mangaId }
                })
              }}
            >
              <View style={styles.row}>
                <Text style={styles.chapterText}>
                  <Text style={{ fontWeight: 'bold' }}>Chapter {item.attributes.chapter ?? 'Oneshot'}</Text>{' '}
                  {item.attributes.title && `- ${item.attributes.title}`}
                </Text>
                <Text style={styles.date}>{formatDate(item.attributes.updatedAt)}</Text>
              </View>
              <Text style={styles.info}>Volume: {item.attributes.volume}</Text>
              <Text style={styles.info}>Ngôn ngữ: {getLanguageName(item.attributes.translatedLanguage)}</Text>
              <Text style={styles.info}>
                Nhóm dịch: {item.relationships.find(r => r.type === 'scanlation_group')?.attributes?.name ?? 'Không rõ'}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </Animated.View>
  )
}

export default MangaChaptersList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingBottom: 20,
    backgroundColor: '#0f172a'
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    paddingTop: 10
  },
  picker: {
    flex: 1,
    height: 40,
    color: '#fff',
    backgroundColor: '#1e293b',
    marginHorizontal: 4
  },
  chapterItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8
  },
  activeItem: {
    backgroundColor: '#15803d'
  },
  inactiveItem: {
    backgroundColor: '#1e293b'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  chapterText: {
    color: '#fff',
    flex: 1,
    marginRight: 8
  },
  date: {
    color: '#9ca3af',
    fontStyle: 'italic',
    fontSize: 12
  },
  info: {
    fontSize: 12,
    color: '#d1d5db'
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 20
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 16
  },
  loadingFooter: {
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    marginTop: 10,
    borderRadius: 8,
    marginHorizontal: 4,
    paddingBottom: 100
  },
  loadingText: {
    color: '#e5e7eb',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500'
  },
  endFooter: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },
  endText: {
    color: '#6b7280',
    fontSize: 14,
    fontStyle: 'italic'
  }
})
