import React, { useState } from 'react';
import { View, TextInput, StyleSheet, StatusBar } from 'react-native';

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Tìm kiếm..."
          placeholderTextColor="#888"
          style={styles.searchInput}
        />
      </View>

      <View style={styles.content}>
        {/* blar balr */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // màu nền màn hình
    paddingTop: StatusBar.currentHeight || 24, // tránh che thanh trạng thái
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1e293b', // màu nền thanh search
  },
  searchInput: {
    height: 40,
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
