import React, { useState } from 'react';
import { View, Text, Image, Dimensions, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import { useRouter } from "expo-router";
import { useQuery } from '@tanstack/react-query';
import { getNewManga } from '@/api/manga/get-latest-updated-manga';
import { contentRatingColors } from '@/utils/static';
import { MangaStatus, OriginalLanguage, ContentRating } from '@/utils/enums';

const { width } = Dimensions.get('window');

interface Props {
  id: string;
}

const SlideMangaCardFullWidth: React.FC<Props> = ({ id }) => {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  const { data: newManga, isLoading, isError } = useQuery(getNewManga({ limit: 10 }));

  if (isLoading) return <ActivityIndicator size="large" color="#999" style={{ marginTop: 50 }} />;
  if (isError) return <Text style={{ marginTop: 50, textAlign: 'center' }}>Lỗi rồi</Text>;

  return (
    <View style={{ width, height: 450, paddingVertical: 3 }}>
      <Swiper
        autoplay
        autoplayTimeout={3.5}
        showsPagination = {false}
        loop
      >
        {newManga?.data.map(manga => {
          const attr = manga.attributes;
          const title = attr.altTitles.find(t => t.vi)?.vi ?? attr.title.en ?? attr.altTitles.find(t => t.en)?.en;
        //   const altTitle = attr.altTitles.find(t => t.en)?.en || attr.altTitles.find(t => t.ja)?.ja;
          const year = attr.year || 'Không rõ';
          const status = MangaStatus[attr.status as keyof typeof MangaStatus] || 'Không rõ';
          const originalLang = OriginalLanguage[attr.originalLanguage as keyof typeof OriginalLanguage] || 'Không rõ';
          const rating = attr.contentRating as keyof typeof ContentRating;
          const coverArt = manga.relationships.find(rel => rel.type === 'cover_art');
          const coverImageUrl = coverArt?.attributes?.fileName
            ? `https://uploads.mangadex.org/covers/${manga.id}/${coverArt.attributes.fileName}`
            : '';

          const handleClick = () => {
            if (manga.id.trim()) {
              router.push({ pathname: '/manga-detail', params: { id: manga.id.trim() } })
            }
          };

          return (
            <TouchableOpacity
              key={manga.id}
              onPress={handleClick}
              activeOpacity={0.8}
              style={{ flex: 1 }}
            >
              {coverImageUrl ? (
                <Image
                  source={{ uri: coverImageUrl, cache: 'force-cache' }}
                  style={StyleSheet.absoluteFillObject}
                  resizeMode="cover"
                />
              ) : (
                <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#222' }]} />
              )}
              <View style={styles.overlay}>
                <View style={[styles.contentContainer, {paddingTop: 15}]}>
                  <View style={styles.coverContainer}>
                    <Image
                      source={{ uri: coverImageUrl }}
                      style={styles.coverImage}
                      onLoadEnd={() => setIsLoaded(true)}
                    />
                    {!isLoaded && (
                      <ActivityIndicator
                        size="small"
                        color="#fff"
                        style={styles.loadingIndicator}
                      />
                    )}
                  </View>

                  <View style={styles.infoContainer}>
                    <Text style={styles.title} numberOfLines={2}>{title}</Text>
                    {/* {altTitle && <Text style={styles.altTitle}>{altTitle}</Text>} */}
                    <Text style={styles.infoText}>Tình trạng: {status}</Text>
                    <Text style={styles.infoText}>Năm phát hành: {year}</Text>
                    <Text style={styles.infoText}>Ngôn ngữ gốc: {originalLang}</Text>
                    <Text style={styles.infoText}>
                      Độ tuổi:{' '}
                      <Text style={[styles.rating, { backgroundColor: contentRatingColors[rating] }]}>
                        {ContentRating[rating]}
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
  },
  coverContainer: {
    width: 160,
    height: 240,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -10,
    marginTop: -10,
  },
  infoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  altTitle: {
    color: '#ccc',
    fontStyle: 'italic',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  infoText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  rating: {
    paddingHorizontal: 6,
    borderRadius: 4,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SlideMangaCardFullWidth;
