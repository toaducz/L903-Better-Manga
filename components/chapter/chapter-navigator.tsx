import React, { useState, useMemo } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  ActivityIndicator
} from 'react-native'
import { useInfiniteQuery } from '@tanstack/react-query'
import { request } from '@/utils/request'
import { DataResponse } from '@/api/paginate'
import { Chapter } from '@/api/chapter/get-chapter-by-id'
import { formatDate } from '@/utils/format'
import { useRouter } from 'expo-router'
import Error from '../status/error'
import Loading from '../status/loading'
import Ionicons from 'react-native-vector-icons/Ionicons'

interface ChapterFooterProps {
  mangaId: string
  currentChapterId: string
  langFilter?: string[]
}

const ChapterNavigator: React.FC<ChapterFooterProps> = ({
  mangaId,
  currentChapterId,
  langFilter = ['vi']
}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<string[]>(langFilter)
  const limit = 1000
  const router = useRouter()
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError
  } = useInfiniteQuery({
    queryKey: ['chapters-footer', mangaId, selectedFilter],
    queryFn: ({ pageParam = 0 }) =>
      request<DataResponse<Chapter>>(`/manga/${mangaId}/feed`, 'GET', {
        limit,
        offset: pageParam,
        'translatedLanguage[]': selectedFilter,
        'order[chapter]': 'asc'
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.length * limit
      return totalLoaded < lastPage.total ? totalLoaded : undefined
    }
  })

  const chapters = useMemo(
    () => data?.pages.flatMap(page => page.data) ?? [],
    [data]
  )

  const currentIndex = useMemo(
    () => chapters.findIndex(c => c.id === currentChapterId),
    [chapters, currentChapterId]
  )

  const currentChapter = chapters.find(c => c.id === currentChapterId);

  const currentLabel = currentChapter?.attributes.chapter
  ? `Chapter ${currentChapter.attributes.chapter}`
  : "Danh sách Chapter";

  const filterOptions = [
    { label: 'Mặc định', value: ['vi', 'en', 'ja'] },
    { label: 'Tiếng Việt', value: ['vi'] },
    { label: 'Tiếng Anh', value: ['en'] },
    { label: 'Tiếng Nhật', value: ['ja'] }
  ]

  return (
    <View style={styles.footer}>
      {/* Nút Lùi */}
      <TouchableOpacity
        style={styles.button}
        disabled={currentIndex <= 0}
        onPress={() => {
          const prev = chapters[currentIndex - 1]
          if (prev) {
            router.replace({
              pathname: `/reader/[id]`,
              params: { id: prev.id, mangaId: String(mangaId) }
            })
          }
        }}
      >
        <Ionicons
          name="arrow-back"
          size={20}
          color={currentIndex <= 0 ? '#666' : '#fff'}
        />

      </TouchableOpacity>

      {/* Mở Modal danh sách */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.5}
      >
        <Text style={styles.text}>{currentLabel}</Text>
      </TouchableOpacity>

      {/* Nút Tiến */}
      <TouchableOpacity
        style={styles.button}
        disabled={currentIndex < 0 || currentIndex >= chapters.length - 1}
        onPress={() => {
          const next = chapters[currentIndex + 1]
          if (next) {
            router.replace({
              pathname: `/reader/[id]`,
              params: { id: next.id, mangaId: String(mangaId) }
            })
          }
        }}
      >
        <Ionicons
          name="arrow-forward"
          size={20}
          color={
            currentIndex < 0 || currentIndex >= chapters.length - 1
              ? '#666'
              : '#fff'
          }
        />
      </TouchableOpacity>

      {/* Modal danh sách */}
      <Modal
        visible={modalVisible}
        transparent
        animationType='slide'
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Filter Tabs */}
            <View style={styles.filterRow}>
              {filterOptions.map(opt => (
                <TouchableOpacity
                  key={opt.label}
                  style={[
                    styles.filterButton,
                    selectedFilter.toString() === opt.value.toString() &&
                    styles.filterButtonActive
                  ]}
                  onPress={() => setSelectedFilter(opt.value)}
                >
                  <Text style={styles.filterText}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {isLoading ? (
              <View
                style={{ justifyContent: 'center', alignItems: 'center', marginTop: 250 }}
              >
                <Loading />
              </View>
            ) : isError || !mangaId ? (
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Error />
                <Text
                  style={{
                    color: '#fff',
                    marginTop: 250,
                    fontWeight: '700'
                  }}
                >
                  Chỗ này trống trải quá
                </Text>
              </View>
            ) : (
              <FlatList
                data={chapters}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.chapterItem,
                      item.id === currentChapterId && styles.activeItem
                    ]}
                    onPress={() => {
                      setModalVisible(false)
                      router.replace({
                        pathname: `/reader/[id]`,
                        params: { id: item.id, mangaId: mangaId }
                      })
                    }}
                  >
                    <Text style={styles.chapterText}>
                      Chapter {item.attributes.chapter ?? 'Oneshot'}
                    </Text>
                    <Text style={styles.date}>
                      {formatDate(item.attributes.updatedAt)}
                    </Text>
                  </TouchableOpacity>
                )}
                onEndReached={() => {
                  if (hasNextPage && !isFetchingNextPage) fetchNextPage()
                }}
                onEndReachedThreshold={0.3}
                ListFooterComponent={
                  isFetchingNextPage ? (
                    <ActivityIndicator
                      size='small'
                      color='#60a5fa'
                      style={{ marginVertical: 12 }}
                    />
                  ) : null
                }
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default ChapterNavigator

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#374151',
    paddingVertical: 8
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  text: {
    color: '#fff',
    fontWeight: '600'
  },
  modalOverlay: {
    flex: 1,
    paddingTop: 70,
    backgroundColor: 'rgba(0,0,0,0.8)'
  },
  modalContent: {
    maxHeight: '90%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 12
  },
  chapterItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333'
  },
  activeItem: {
    backgroundColor: '#15803d'
  },
  chapterText: {
    color: '#fff',
    fontWeight: '500'
  },
  date: {
    color: '#9ca3af',
    fontSize: 12
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12
  },
  filterButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 6
  },
  filterButtonActive: {
    backgroundColor: '#15803d',
    borderColor: '#15803d'
  },
  filterText: {
    color: '#fff',
    fontWeight: '600'
  }
})
