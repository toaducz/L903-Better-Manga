import React, { useState } from 'react'
import { ScrollView, View, Text, Image, TouchableOpacity } from 'react-native'
import { Manga } from '@/api/paginate'
// import { getAuthorById } from '@/api/Author/getAuthorById';
import { MangaStatus, OriginalLanguage, ContentRating } from '@/utils/enums'
import MangaChaptersList from '@/components/tabs/manga-chapter-tab'
import RelatedManga from '@/components/manga/manga-related'

interface MangaDetailPageProps {
  manga: Manga
}

export default function MangaDetailScreen({ manga }: MangaDetailPageProps) {
  const [activeTab, setActiveTab] = useState<'chapters' | 'related'>('chapters')
  const title = manga.attributes.title.vi ? manga.attributes.title.vi : manga.attributes.title.en
  const attributes = manga.attributes
  const altTitle = attributes.altTitles
    .map(item => item.vi || item.en || item.ja)
    .filter(Boolean)
    .join(', ')
  const coverArt = manga.relationships.find(rel => rel.type === 'cover_art')
  const coverArtFileName = coverArt?.attributes?.fileName
  const coverImageUrl = coverArtFileName ? `https://uploads.mangadex.org/covers/${manga.id}/${coverArtFileName}` : ''
  const relatedMangaIds = manga.relationships.filter(rel => rel.type === 'manga').map(rel => rel.id)
  // const authorId = manga.relationships.find(item => item.type === 'author')?.id;
  //   const { data: author, isLoading, isError } = useQuery(getAuthorById({ id: authorId! }));
  //   if (isLoading) return <Loading />;
  //   if (isError) return <Error />;

  return (
    <View style={{ flex: 1, backgroundColor: '#000000ff' }}>
      <ScrollView style={{ flex: 1, backgroundColor: '#0f172a' }}>
        <View style={{ alignItems: 'center', padding: 16, paddingTop: 50 }}>
          <Image
            source={{ uri: coverImageUrl }}
            defaultSource={require('@/assets/images/xin-loi-ouguri-cap-cua-toi-an-het-anh-roi.jpg')}
            style={{ width: 200, height: 300, borderRadius: 12 }}
            resizeMode='cover'
          />
          <Text
            numberOfLines={2}
            style={[{ color: 'white', fontWeight: 'bold', fontSize: 22, marginTop: 16, insetInline: 2 }]}
          >
            {title}
          </Text>
          <Text numberOfLines={2} style={{ color: 'white', fontSize: 14, paddingTop: 16, fontStyle: 'italic' }}>
            {altTitle}
          </Text>
        </View>

        {/* Info */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <Text style={{ color: 'white', marginBottom: 4 }}>
            Tình trạng: {MangaStatus[attributes.status as keyof typeof MangaStatus] || 'Không rõ'}
          </Text>
          <Text style={{ color: 'white', marginBottom: 4 }}>Năm phát hành: {attributes.year || 'Không rõ'}</Text>
          <Text style={{ color: 'white', marginBottom: 4 }}>
            Ngôn ngữ gốc: {OriginalLanguage[attributes.originalLanguage as keyof typeof OriginalLanguage] || 'Không rõ'}
          </Text>
        </View>

        {/* Tabs */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 16 }}>
          <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor: activeTab === 'chapters' ? '#1e40af' : '#374151',
              borderRadius: 8,
              marginHorizontal: 4
            }}
            onPress={() => setActiveTab('chapters')}
          >
            <Text style={{ color: 'white' }}>Danh sách chương</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor: activeTab === 'related' ? '#1e40af' : '#374151',
              borderRadius: 8,
              marginHorizontal: 4
            }}
            onPress={() => setActiveTab('related')}
          >
            <Text style={{ color: 'white' }}>Manga liên quan</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 32 }}>
          {activeTab === 'chapters' && <MangaChaptersList mangaId={manga.id} langValue='vi' langFilterValue={['vi']} />}
          {activeTab === 'related' && <RelatedManga ids={relatedMangaIds} />}
        </View>
      </ScrollView>
    </View>
  )
}
