import React, { useMemo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import { useQuery } from '@tanstack/react-query'
import { getTag, Tag } from '@/api/tag/get-tag'
import { ContentRating } from '@/utils/enums'

type Props = {
  selectedTags: string[]
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>
  sortBy: 'followedCount' | 'latestUploadedChapter' | 'year'
  setSortBy: React.Dispatch<React.SetStateAction<'followedCount' | 'latestUploadedChapter' | 'year'>>
  rating: Array<'all' | 'safe' | 'suggestive' | 'erotica' | 'pornographic'>
  setRating: React.Dispatch<React.SetStateAction<Array<'safe' | 'suggestive' | 'erotica' | 'pornographic'>>>
}

export default function FilterSelection({
  selectedTags,
  setSelectedTags,
  sortBy,
  setSortBy,
  rating,
  setRating
}: Props) {
  const { data: tagData, isLoading } = useQuery(getTag())

  const { genres, themes, formats } = useMemo(() => {
    const all = tagData?.data ?? []
    return {
      genres: all.filter(tag => tag.attributes.group === 'genre'),
      themes: all.filter(tag => tag.attributes.group === 'theme'),
      formats: all.filter(tag => tag.attributes.group === 'format')
    }
  }, [tagData])

  const allOptions: Array<'safe' | 'suggestive' | 'erotica' | 'pornographic'> = [
    'safe',
    'suggestive',
    'erotica',
    'pornographic'
  ]

  const toggleRating = (value: 'all' | keyof typeof ContentRating) => {
    if (value === 'all') {
      setRating(allOptions) // chọn hết
      return
    }

    setRating(prev => {
      if (prev.includes(value)) {
        return prev.filter(r => r !== value)
      } else {
        return [...prev, value]
      }
    })
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => (prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]))
  }

  const renderTagGroup = (title: string, list: Tag[]) => (
    <View style={styles.tagGroup}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.tagContainer}>
        {list.map(tag => {
          const isSelected = selectedTags.includes(tag.id)
          return (
            <TouchableOpacity
              key={tag.id}
              style={[styles.tagItem, isSelected && styles.tagSelected]}
              onPress={() => toggleTag(tag.id)}
            >
              <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>{tag.attributes.name.en}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#60a5fa' />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      {renderTagGroup('Thể loại', genres)}
      {renderTagGroup('Theme', themes)}
      {renderTagGroup('Hình thức phát hành', formats)}

      {/* SortBy */}
      <View style={styles.extraFilter}>
        <Text style={styles.groupTitle}>Sắp xếp theo</Text>
        <View style={styles.tagContainer}>
          {['followedCount', 'latestUploadedChapter', 'year'].map(option => (
            <TouchableOpacity
              key={option}
              style={[styles.tagItem, sortBy === option && styles.tagSelected]}
              onPress={() => setSortBy(option as any)}
            >
              <Text style={[styles.tagText, sortBy === option && styles.tagTextSelected]}>
                {option === 'followedCount'
                  ? 'Theo dõi nhiều'
                  : option === 'latestUploadedChapter'
                    ? 'Chương mới'
                    : 'Năm phát hành'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {/* Rating */}
      <View style={styles.extraFilter}>
        <Text style={styles.groupTitle}>Rating</Text>
        <View style={styles.tagContainer}>
          {['all', ...allOptions].map(option => {
            const isSelected =
              option === 'all'
                ? rating.length === allOptions.length
                : rating.includes(option as keyof typeof ContentRating)

            return (
              <TouchableOpacity
                key={option}
                style={[styles.tagItem, isSelected && styles.tagSelected]}
                onPress={() => toggleRating(option as any)}
              >
                <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
                  {option === 'all' ? 'Tất cả' : ContentRating[option as keyof typeof ContentRating]}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 20, color: '#272e35ff' },
  groupTitle: { fontSize: 16, fontWeight: 'bold', color: '#f9fafb', marginBottom: 8 },
  tagGroup: { marginBottom: 16 },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagItem: { backgroundColor: '#1e293b', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginBottom: 8 },
  tagText: { color: '#9ca3af', fontSize: 14 },
  tagSelected: { backgroundColor: '#60a5fa' },
  tagTextSelected: { color: '#fff', fontWeight: '600' },
  extraFilter: { marginBottom: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' }
})
