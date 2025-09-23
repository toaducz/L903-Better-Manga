import React from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import MangaItem from '@/components/manga/manga-items'
import { getTopMangaByTagId } from '@/api/manga/get-manga-by-tag-id'
import { useQuery } from '@tanstack/react-query'
import Loading from '../status/loading'
import Error from '../status/error'
import { useRouter } from 'expo-router'

interface MangaGridProps {
  title?: string
  tagId: string[]
  limit: number
}

const MangaGridByTagId: React.FC<MangaGridProps> = ({ title, tagId, limit = 10 }) => {
  const router = useRouter()
  const {
    data: mangas,
    isLoading,
    isError,
    error
  } = useQuery(getTopMangaByTagId({ id: tagId, offset: 0, limit: limit }))

  if (isLoading) {
    return <Loading />
  }

  if (isError || !mangas) {
    console.log('API error:', error)
    return <Error />
  }

  let data = mangas?.data ? [...mangas.data] : []

  // Nếu số item lẻ → thêm placeholder nhìn cho đỡ bẩn mắt
  if (data.length % 2 !== 0) {
    data.push({ id: 'placeholder' } as any)
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      {title ? (
        <View style={styles.headerRow}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: `/tag/[id]`,
                params: { id: tagId[0] }
              })
            }}
          >
            <Text style={styles.seeMore}>Xem thêm</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Grid 2 cột */}

      <FlatList
        data={mangas?.data}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
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
        scrollEnabled={false} // scroll cha handle
      />
    </View>
  )
}

export default MangaGridByTagId

const styles = StyleSheet.create({
  container: {
    marginBottom: 24
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 1
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    paddingHorizontal: 10
  },
  seeMore: {
    fontSize: 14,
    color: '#60a5fa',
    paddingHorizontal: 10
  },
  row: {
    justifyContent: 'space-between'
  },
  gridItem: {
    flex: 1,
    margin: 4
  }
})
