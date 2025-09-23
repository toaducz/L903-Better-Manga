import React, { useState, useEffect } from 'react'
import {
  View,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  BackHandler,
  ToastAndroid
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Modal from 'react-native-modal'
import ImageViewer from 'react-native-image-zoom-viewer'
import ChapterNavigator from '@/components/chapter/chapter-navigator'
import { ChapterDetail } from '@/api/chapter/get-detail-chapter-by-id'

const { width, height } = Dimensions.get('window')

interface ChapterReaderScreenProps {
  chapterDetail: ChapterDetail
  mangaId: string
  currentChapter: string
}

const ChapterReaderScreen: React.FC<ChapterReaderScreenProps> = ({ chapterDetail, mangaId, currentChapter }) => {
  const { chapter } = chapterDetail
  const baseUrl = 'https://uploads.mangadex.org'
  const imageUrls = chapter.data.map(fileName => ({ url: `${baseUrl}/data/${chapter.hash}/${fileName}` }))

  const [isModalVisible, setModalVisible] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const openModal = (index: number) => {
    setSelectedIndex(index)
    setModalVisible(true)
  }

  useEffect(() => {
    const backAction = () => {
      if (isModalVisible) {
        setModalVisible(false)
        return true // chặn back system
      }
      return false // để back system xử lý
    }

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction)

    return () => backHandler.remove()
  }, [isModalVisible])

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'top']}>
      <FlatList
        data={imageUrls}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity activeOpacity={0.9} onPress={() => openModal(index)}>
            <ChapterImage uri={item.url} />
          </TouchableOpacity>
        )}
      />
      <View style={styles.footer}>
        <ChapterNavigator mangaId={mangaId} currentChapterId={currentChapter} />
      </View>

      <Modal
        onModalShow={() => ToastAndroid.show('Vuốt xuống để thoát', ToastAndroid.SHORT)}
        isVisible={isModalVisible}
        style={{ margin: 0 }}
        onBackButtonPress={() => setModalVisible(false)}
        onBackdropPress={() => setModalVisible(false)}
      >
        <ImageViewer
          imageUrls={imageUrls}
          index={selectedIndex}
          enableSwipeDown
          enableImageZoom
          saveToLocalByLongPress={false}
          failImageSource={{ url: '@/assets/images/xin-loi-ouguri-cap-cua-toi-an-het-anh-roi.jpg' }}
          onSwipeDown={() => setModalVisible(false)}
          backgroundColor='#000'
        />
      </Modal>
    </SafeAreaView>
  )
}

export default ChapterReaderScreen

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  image: { width: width * 0.95, height: undefined, aspectRatio: 1 / 1.5 },
  footer: { height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111' },
  wrapper: {
    width: '100%',
    aspectRatio: 1 / 1.4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' }
})
