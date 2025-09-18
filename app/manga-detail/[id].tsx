import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getMangaById } from '@/api/manga/get-detail-manga-by-id';
import MangaDetailScreen from '../screen/manga-detail-screen';
import Loading from '@/components/status/loading';
import Error from '@/components/status/error';
import { useLocalSearchParams } from 'expo-router';

export default function MangaDetailPageWrapper() {
  return <MangaDetailContent />;
}

function MangaDetailContent() {
  const { id } = useLocalSearchParams();
  const mangaID = String(id);

  const backgroundColor = '#0f172a';

  const { data: manga, isFetching, isError } = useQuery(getMangaById({ id: mangaID }));

  if (isFetching) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Loading />
      </View>
    );
  }

  if (isError || !manga?.data) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Error />
      </View>
    );
  }

  return (
    <View style={[styles.container, { flex: 1, backgroundColor }]}>
      <MangaDetailScreen manga={manga.data} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
});
