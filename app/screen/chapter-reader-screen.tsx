import React, { useState } from 'react'
import { View, Image, FlatList, Dimensions, StyleSheet, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ChapterDetail } from '@/api/chapter/get-detail-chapter-by-id'
import ChapterNavigator from '@/components/chapter/chapter-navigator'

const { width } = Dimensions.get('window')

interface ChapterReaderScreenProps {
  chapterDetail: ChapterDetail
  mangaId: string
  currentChapter: string
}

const ChapterReaderScreen: React.FC<ChapterReaderScreenProps> = ({ chapterDetail, mangaId, currentChapter }) => {
  const { chapter } = chapterDetail
  const baseUrl = 'https://uploads.mangadex.org'
  const imageUrls = chapter.data.map(fileName => `${baseUrl}/data/${chapter.hash}/${fileName}`)

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'top']}>
      <FlatList
        data={imageUrls}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <ChapterImage uri={item} />}
      />
      <View style={styles.footer}>
        <ChapterNavigator mangaId={mangaId} currentChapterId={currentChapter} />
      </View>
    </SafeAreaView>
  )
}

const ChapterImage: React.FC<{ uri: string }> = ({ uri }) => {
  const [loading, setLoading] = useState(true)

  return (
    <View style={styles.wrapper}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size='large' color='#60a5fa' />
        </View>
      )}
      <Image
        source={{ uri }}
        style={styles.image}
        resizeMode='contain'
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
      />
    </View>
  )
}

export default ChapterReaderScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  image: {
    width: width * 0.95,
    height: undefined,
    aspectRatio: 1 / 1.5
  },
  footer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111'
  },
  wrapper: {
    width: '100%',
    // height: '95%',
    aspectRatio: 1 / 1.4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject, // full màn
    justifyContent: 'center',
    alignItems: 'center'
  }
})
