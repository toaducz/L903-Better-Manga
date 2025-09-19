import React from 'react'
import { View, FlatList, StyleSheet } from 'react-native'
import MangaItem from '@/components/manga/manga-items'
import { Manga } from '@/api/paginate'

interface MangaGridProps {
  mangas: Manga[]
}

const MangaGrid: React.FC<MangaGridProps> = ({ mangas }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={mangas}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <MangaItem manga={item} />
          </View>
        )}
        scrollEnabled={false} // scroll cha handle
      />
    </View>
  )
}

export default MangaGrid

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
