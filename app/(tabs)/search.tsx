import React, { useState, useMemo, useCallback } from 'react';
import { View, TextInput, StyleSheet, StatusBar, FlatList, Text, ActivityIndicator, Image } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { request } from '@/utils/request';
import { Manga, DataResponse } from '@/api/paginate';
import MangaItem from '@/components/manga/manga-items';

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const [submittedSearchText, setSubmittedSearchText] = useState('');
  const limit = 20;

  const handleSubmitSearch = () => {
    const trimmedText = searchText.trim();
    setSubmittedSearchText(trimmedText);
  };

  // Infinite query cho search
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['search-infinite', submittedSearchText],
    queryFn: ({ pageParam = 0 }): Promise<DataResponse<Manga>> => {
      if (!submittedSearchText) {
        return Promise.resolve({
          data: [],
          limit: limit,
          offset: 0,
          total: 0
        } as unknown as DataResponse<Manga>);
      }

      return request<DataResponse<Manga>>(`manga/`, 'GET', {
        title: submittedSearchText,
        'order[followedCount]': 'desc',
        limit: limit,
        'availableTranslatedLanguage[]': 'en',
        'includes[]': 'cover_art',
        offset: pageParam
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.length * limit;
      return totalLoaded < lastPage.total ? totalLoaded : undefined;
    },
    enabled: submittedSearchText.length > 0, // Chỉ chạy query khi có search text
  });

  // Flatten data từ tất cả các pages
  const mangas = useMemo(() => {
    return data?.pages.flatMap(page => page.data) ?? [];
  }, [data]);

  // Total count từ page đầu tiên
  const totalCount = data?.pages[0]?.total ?? 0;

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const renderFooter = () => {
    if (isFetchingNextPage) {
      return (
        <View style={styles.loadingFooter}>
          <ActivityIndicator size="large" color="#60a5fa" />
          <Text style={styles.loadingText}>Đang tải thêm...</Text>
        </View>
      );
    }

    if (!hasNextPage && mangas.length > 0) {
      return (
        <View style={styles.endFooter}>
          <Text style={styles.endText}>Đã hiển thị tất cả kết quả</Text>
        </View>
      );
    }

    return null;
  };

  const renderItem = useCallback(({ item }: { item: Manga }) => (
    <View style={styles.gridItem}>
      <MangaItem manga={item} />
    </View>
  ), []);

  const renderEmptyComponent = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#60a5fa" />
          <Text style={styles.emptyText}>Đang tìm kiếm...</Text>
        </View>
      );
    }

    if (!isLoading && mangas.length === 0 && submittedSearchText !== "") {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Không tìm thấy manga nào với từ khóa "{submittedSearchText}"
          </Text>
        </View>
      );
    }

    if (!submittedSearchText) {
      return (
        <View style={styles.emptyContainer}>
          <Image
            source={require("@/assets/dantsu-flame-umamusume.png")}
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <Text style={styles.emptyText}>
            Ở đây trống trải quá, thử tìm gì đó xem!
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSubmitSearch}
          placeholder="Tìm kiếm..."
          placeholderTextColor="#888"
          style={styles.searchInput}
          returnKeyType="search"
        />
      </View>

      <View style={styles.content}>
        {/* Hiển thị số kết quả nếu có */}
        {submittedSearchText && totalCount > 0 && (
          <Text style={styles.resultCount}>
            Tìm thấy {totalCount} kết quả cho "{submittedSearchText}"
          </Text>
        )}

        <FlatList
          data={mangas}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={mangas.length > 0 ? styles.row : undefined}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyComponent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={5}
          removeClippedSubviews={true}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingTop: StatusBar.currentHeight || 24,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1e293b',
  },
  searchInput: {
    height: 40,
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#fff',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  resultCount: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  row: {
    justifyContent: 'space-between',
  },
  gridItem: {
    flex: 1,
    margin: 4,
  },
  loadingFooter: {
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    marginTop: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  loadingText: {
    color: '#e5e7eb',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  endFooter: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  endText: {
    color: '#6b7280',
    fontSize: 14,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 150,
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 16, 
  },
});