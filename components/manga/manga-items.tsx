import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Manga } from "@/api/paginate"; 

interface MangaCardProps {
  manga: Manga;
}

const MangaItem: React.FC<MangaCardProps> = ({ manga }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const altTitle =
    manga.attributes.altTitles.find((t) => t.en)?.en ||
    manga.attributes.altTitles.find((t) => t.ja)?.ja;

  const title =
    manga.attributes.altTitles.find((t) => t.vi)?.vi ??
    manga.attributes.title.en ??
    altTitle;

  const coverArt = manga.relationships.find((rel) => rel.type === "cover_art");
  const coverArtFileName = coverArt?.attributes?.fileName;
  const coverImageUrl = coverArtFileName
    ? `https://uploads.mangadex.org/covers/${manga.id}/${coverArtFileName}`
    : "";

  const handlePress = () => {
    if (manga.id.trim()) {
    //   router.push(`/manga-detail/${manga.id.trim()}`);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.8}>
      <View
        style={[
          styles.imageWrapper, styles.imageLarge,
        ]}
      >
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color="#ccc" />
          </View>
        )}
        <Image
          source={{ uri: coverImageUrl }}
          defaultSource={require("@/assets/images/xin-loi-ouguri-cap-cua-toi-an-het-anh-roi.jpg")} // Thêm placeholder
          style={styles.image}
          resizeMode="cover"
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
      </View>

      <View style={styles.textWrapper}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {/* {altTitle && (
          <Text style={styles.altTitle} numberOfLines={2}>
            {altTitle}
          </Text>
        )} */}
      </View>
    </TouchableOpacity>
  );
};

export default MangaItem;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1e293b", // slate-800
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    height: 310,
  },
  imageWrapper: {
    position: "relative",
  },
  imageLarge: {
    width: 200,
    height: 250,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#334155", // slate-700
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  textWrapper: {
    padding: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  altTitle: {
    fontSize: 14,
    color: "#d1d5db", // gray-300
    marginTop: 4,
  },
});