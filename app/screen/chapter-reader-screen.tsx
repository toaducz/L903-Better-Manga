import React, { useState } from "react";
import { View, Image, FlatList, Dimensions, StyleSheet, Text } from "react-native";
import Loading from "@/components/status/loading";
import { ChapterDetail } from "@/api/chapter/get-detail-chapter-by-id";

const { width } = Dimensions.get("window");

interface ChapterReaderScreenProps {
    chapterDetail: ChapterDetail;
}

const ChapterReaderScreen: React.FC<ChapterReaderScreenProps> = ({ chapterDetail }) => {
    const { chapter } = chapterDetail;
    const baseUrl = 'https://uploads.mangadex.org';
    const imageUrls = chapter.data.map((fileName) => `${baseUrl}/data/${chapter.hash}/${fileName}`);

    return (
        <View style={styles.container}>
            <FlatList
                data={imageUrls}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <ChapterImage uri={item} />}
                ListFooterComponent={
                    <View style={styles.footer}>
                        <Text style={{ color: "#fff" }}>Chuyển Chapter</Text>
    
                    </View>
                }
            />
        </View>
    );
};

const ChapterImage: React.FC<{ uri: string }> = ({ uri }) => {
    const [loading, setLoading] = useState(true);

    return (
        <View style={styles.wrapper}>
            {loading && <Loading />}
            <Image
                source={{ uri }}
                style={styles.image}
                resizeMode="contain"
                onLoad={() => setLoading(false)}
                onError={() => setLoading(false)}
            />
        </View>
    );
};

export default ChapterReaderScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    image: {
        width: width * 0.95,
        height: undefined,
        aspectRatio: 1 / 1.5,
    },
    footer: {
        height: 200,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#111",
    },
    wrapper: {
        width: "100%",
        // height: '95%',
        aspectRatio: 1 / 1.4,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
    },
});
