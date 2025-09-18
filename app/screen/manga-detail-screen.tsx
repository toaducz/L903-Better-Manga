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
import { getChaptersByMangaId } from '@/api/chapter/get-chapter-by-id';
import MangaChaptersList from '@/components/tabs/manga-chapter-tab';

interface MangaDetailPageProps {
  manga: Manga;
}

export default function MangaDetailScreen({ manga }: MangaDetailPageProps) {
  const [activeTab, setActiveTab] = useState<'chapters' | 'related'>('chapters');
  const title = manga.attributes.title.vi ? manga.attributes.title.vi : manga.attributes.title.en
  const attributes = manga.attributes;
  const altTitle = attributes.altTitles
    .map(item => item.vi || item.en || item.ja)
    .filter(Boolean)
    .join(', ');
  const coverArt = manga.relationships.find(rel => rel.type === 'cover_art');
  const coverArtFileName = coverArt?.attributes?.fileName;
  const coverImageUrl = coverArtFileName ? `https://uploads.mangadex.org/covers/${manga.id}/${coverArtFileName}` : '';

  // const authorId = manga.relationships.find(item => item.type === 'author')?.id;
  //   const { data: author, isLoading, isError } = useQuery(getAuthorById({ id: authorId! }));
  //   if (isLoading) return <Loading />;
  //   if (isError) return <Error />;

  return (
    <View style={{ flex: 1, backgroundColor: "#000000ff" }}>
      <ScrollView style={{ flex: 1, backgroundColor: '#0f172a' }}>
        <View style={{ alignItems: 'center', padding: 16, paddingTop:70 }}>
          <Image
            source={{ uri: coverImageUrl }}
            defaultSource={require("@/assets/images/xin-loi-ouguri-cap-cua-toi-an-het-anh-roi.jpg")}
            style={{ width: 200, height: 300, borderRadius: 12 }}
            resizeMode="cover"
          />
          <Text numberOfLines={2} style={[{ color: 'white', fontWeight: 'bold', fontSize: 22, marginTop: 16, insetInline: 2,  }]}>
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
        <View style={{ paddingHorizontal: 16, paddingBottom: 32 }}>
          {activeTab === 'chapters' && <MangaChaptersList mangaId={manga.id} langValue="vi" langFilterValue={['vi']} />}
          {/* {activeTab === 'related' && <RelatedManga ids={manga.relationships.filter(r => r.type === 'manga').map(r => r.id)} />} */}
        </View>
      </ScrollView>
    </View>
  );
}
