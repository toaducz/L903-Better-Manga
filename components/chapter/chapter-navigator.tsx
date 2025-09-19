import React, { useState, useMemo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, ActivityIndicator } from 'react-native'
import { useInfiniteQuery } from '@tanstack/react-query'
import { request } from '@/utils/request'
import { DataResponse } from '@/api/paginate'
import { Chapter } from '@/api/chapter/get-chapter-by-id'
import { formatDate } from '@/utils/format'
import { useRouter } from 'expo-router'
import Error from '../status/error'
import Loading from '../status/loading'

interface ChapterFooterProps {
  mangaId: String
  currentChapterId: String
  langFilter?: String[]
}

const ChapterNavigator: React.FC<ChapterFooterProps> = ({
  mangaId,
  currentChapterId,
  langFilter = ['vi', 'en', 'ja']
}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<String[]>(langFilter)
  const limit = 10
  const router = useRouter()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useInfiniteQuery({
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

  const chapters = useMemo(() => data?.pages.flatMap(page => page.data) ?? [], [data])

  const filterOptions = [
    { label: 'Mặc định', value: langFilter },
    { label: 'Tiếng Việt', value: ['vi'] },
    { label: 'Tiếng Anh', value: ['en'] },
    { label: 'Tiếng Nhật', value: ['ja'] }
  ]

  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)} activeOpacity={0.5}>
        <Text style={styles.text}>📖 Chapter</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType='slide' onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Filter Tabs */}
            <View style={styles.filterRow}>
              {filterOptions.map(opt => (
                <TouchableOpacity
                  key={opt.label}
                  style={[
                    styles.filterButton,
                    selectedFilter.toString() === opt.value.toString() && styles.filterButtonActive
                  ]}
                  onPress={() => setSelectedFilter(opt.value)}
                >
                  <Text style={styles.filterText}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {isLoading ? (
              <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 250 }}>
                <Loading />
              </View>
            ) : isError || !mangaId ? (
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Error />
                <Text style={{ color: '#fff', marginTop: 250, fontWeight: '700' }}>Chỗ này trống trải quá</Text>
              </View>
            ) : (
              <FlatList
                data={chapters}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.chapterItem, item.id === currentChapterId && styles.activeItem]}
                    onPress={() => {
                      setModalVisible(false)
                      router.replace({
                        pathname: `/reader/[id]`,
                        params: { id: item.id, mangaId: String(mangaId) }
                      })
                    }}
                  >
                    <Text style={styles.chapterText}>Chapter {item.attributes.chapter ?? 'Oneshot'}</Text>
                    <Text style={styles.date}>{formatDate(item.attributes.updatedAt)}</Text>
                  </TouchableOpacity>
                )}
                onEndReached={() => {
                  if (hasNextPage && !isFetchingNextPage) fetchNextPage()
                }}
                onEndReachedThreshold={0.3}
                ListFooterComponent={
                  isFetchingNextPage ? (
                    <ActivityIndicator size='small' color='#60a5fa' style={{ marginVertical: 12 }} />
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
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#374151'
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 8
  },
  text: {
    color: '#fff',
    fontWeight: '600'
  },
  modalOverlay: {
    flex: 1,
    // justifyContent: "flex-start",
    paddingTop: 70,
    backgroundColor: 'rgba(0,0,0,0.8)'
  },
  modalContent: {
    maxHeight: '90%',
    // backgroundColor: "#463e3eff",
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
