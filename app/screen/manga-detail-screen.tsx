import React, { useState } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Manga } from '@/api/paginate';
// import MangaChaptersList from '@/component/manga/manga-chapter-list';
// import RelatedManga from '@/component/manga/related-manga';
import Loading from '@/components/status/loading';
import Error from '@/components/status/error';
// import { getAuthorById } from '@/api/Author/getAuthorById';
import { MangaStatus, OriginalLanguage, ContentRating } from '@/utils/enums';
// import { getChaptersByMangaId } from '@/api/Manga/getChapter';

interface MangaDetailPageProps {
  manga: Manga;
}

export default function MangaDetailScreen({ manga }: MangaDetailPageProps) {
  const [activeTab, setActiveTab] = useState<'chapters' | 'related'>('chapters');
  const attributes = manga.attributes;

  const coverArt = manga.relationships.find(rel => rel.type === 'cover_art');
  const coverArtFileName = coverArt?.attributes?.fileName;
  const coverImageUrl = coverArtFileName ? `https://uploads.mangadex.org/covers/${manga.id}/${coverArtFileName}` : '';

  const authorId = manga.relationships.find(item => item.type === 'author')?.id;
//   const { data: author, isLoading, isError } = useQuery(getAuthorById({ id: authorId! }));
//   const { data: chapter } = useQuery(getChaptersByMangaId({ id: manga.id, lang: ['vi'] }));

//   if (isLoading) return <Loading />;
//   if (isError) return <Error />;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      {/* Cover Image */}
      <View style={{ alignItems: 'center', padding: 16 }}>
        <Image
          source={{ uri: coverImageUrl }}
          style={{ width: 200, height: 300, borderRadius: 12 }}
          resizeMode="cover"
        />
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18, marginTop: 8 }}>
          {attributes.title.en}
        </Text>
        {/* <Text style={{ color: 'gray', fontSize: 14 }}>
          {author?.data.attributes.name || 'Chưa rõ tác giả'}
        </Text> */}
      </View>

      {/* Info */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
        <Text style={{ color: 'white', marginBottom: 4 }}>
          Tình trạng: {MangaStatus[attributes.status as keyof typeof MangaStatus] || 'Không rõ'}
        </Text>
        <Text style={{ color: 'white', marginBottom: 4 }}>
          Năm phát hành: {attributes.year || 'Không rõ'}
        </Text>
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
            marginHorizontal: 4,
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
            marginHorizontal: 4,
          }}
          onPress={() => setActiveTab('related')}
        >
          <Text style={{ color: 'white' }}>Manga liên quan</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {/* <View style={{ paddingHorizontal: 16, paddingBottom: 32 }}>
        {activeTab === 'chapters' && <MangaChaptersList mangaId={manga.id} langValue="vi" langFilterValue={['vi']} />}
        {activeTab === 'related' && <RelatedManga ids={manga.relationships.filter(r => r.type === 'manga').map(r => r.id)} />}
      </View> */}
    </ScrollView>
  );
}
