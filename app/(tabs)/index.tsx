import { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import GridManga from "@/components/manga/manga-grid";
import SlideMangaCardFullWidth from "@/components/slider/manga-slider";

export default function HomeScreen() {
  const [showSecond, setShowSecond] = useState(false);
  const [showThird, setShowThird] = useState(false);
  const [loading, setLoading] = useState(true);

  const oneshot = '0234a31e-a729-4e28-9d6a-3f87c4966b9e';
  const romance = '423e2eae-a7a2-4a8b-ac03-a8351462d71d';
  const comedy = '4d32cc48-9f00-4cca-9b5a-a839f0764984';

  useEffect(() => {
    const t1 = setTimeout(() => setShowSecond(true), 1000);
    const t2 = setTimeout(() => setShowThird(true), 2000);

    const interval = setInterval(() => {
      if (showSecond && showThird) {
        setLoading(false);
        clearInterval(interval);
      }
    }, 200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(interval);
    };
  }, [showSecond, showThird]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#000000ff", paddingHorizontal: 4 }} contentContainerStyle={{ paddingBottom: 20 }}>
      {/* Slider */}
      <SlideMangaCardFullWidth id="home-slider" />

      {/* <ThemedView style={styles.titleContainer}>
        <ThemedText type="title"></ThemedText>
      </ThemedView> */}

      <View style={{
        marginTop: 20,
        padding: 8,
        backgroundColor: '#111',   // nền cho cả nhóm grid
        borderRadius: 12,
      }}>
        <GridManga title="Lãng mạn" tagId={[romance]} />
        {showSecond && <GridManga title="Hài hước" tagId={[comedy]} />}
        {showThird && <GridManga title="Oneshot" tagId={[oneshot]} />}
      </View>

      {loading && (
        <ThemedView style={styles.loading}>
          <ThemedText type="default">Đang tải...</ThemedText>
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginVertical: 12,
  },
  loading: {
    alignItems: "center",
    marginVertical: 20,
  },
});
