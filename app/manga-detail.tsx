import React, { useEffect, useState } from 'react';
import { View, Animated, ScrollView, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { getMangaById } from '@/api/manga/get-detail-manga-by-id';
import MangaDetailScreen from './screen/manga-detail-screen';
import Loading from '@/components/status/loading';
import Error from '@/components/status/error';
import { useLocalSearchParams } from 'expo-router';
import { Easing } from 'react-native';

export default function MangaDetailPageWrapper() {
  return <MangaDetailContent />;
}

function MangaDetailContent() {
  const route = useRoute();
  const { id } = useLocalSearchParams();
  const mangaID = String(id);

  const [isVisible, setIsVisible] = useState(false);
  const opacity = new Animated.Value(0);
  const translateY = new Animated.Value(8);

  const { data: manga, isFetching, isSuccess, isError } = useQuery(
    getMangaById({ id: mangaID })
  );

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsVisible(true);

        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 700, // dài hơn để nhẹ nhàng hơn
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.spring(translateY, {
            toValue: 0,
            damping: 12,
            stiffness: 90,
            useNativeDriver: true,
          }),
        ]).start();
      }, 10);

      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  if (isFetching) return <Loading />;

  if (isError) return <Error />;

  if (!manga?.data) return <Error />;

  // backgroundColor có thể đổi trực tiếp tại đây
  const backgroundColor = '#0f172a'; // màu xanh đậm kiểu Tailwind bg-slate-900

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }],
          backgroundColor: backgroundColor,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <MangaDetailScreen manga={manga.data} />
      </ScrollView>
    </Animated.View>
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
 