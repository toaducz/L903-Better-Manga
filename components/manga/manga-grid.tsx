import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import MangaItem from "@/components/manga/manga-items";
import { Manga } from "@/api/paginate";
import { getTopMangaByTagId } from "@/api/manga/get-manga-by-tag-id";
import { useQuery } from "@tanstack/react-query";
import Loading from "../status/loading";
import Error from "../status/error";

interface MangaGridProps {
    title: string
    tagId: string[];
}

const MangaGrid: React.FC<MangaGridProps> = ({ title, tagId }) => {

    const { data: mangas, isLoading, isError, error } = useQuery(getTopMangaByTagId({ id: tagId, offset: 0, limit: 4 }))

    if (isLoading) {
        return (
            < Loading />
        )
    }

    if (isError || !mangas) {
        console.log("API error:", error);
        return (
            < Error />
        )
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity >
                    {/* onPress={() => router.push(`/tag/${tagId}`)} */}
                    <Text style={styles.seeMore}>Xem thêm</Text>
                </TouchableOpacity>
            </View>

            {/* Grid 2 cột */}

            <FlatList
                data={mangas?.data}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.row}
                renderItem={({ item }) => (
                    <View style={styles.gridItem}>
                        <MangaItem manga={item}/>
                    </View>
                )}
                scrollEnabled={false} // scroll cha handle
            />
        </View>
    );
};

export default MangaGrid;

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
        paddingHorizontal: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#fff",
        paddingHorizontal: 10
    },
    seeMore: {
        fontSize: 14,
        color: "#60a5fa",
        paddingHorizontal: 10
    },
    row: {
        justifyContent: "space-between",
    },
    gridItem: {
        flex: 1,
        margin: 4,
    },
});
