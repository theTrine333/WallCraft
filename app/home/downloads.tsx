import { getAllDownloads } from "@/api/db";
import { syncDownloadsToCache } from "@/Cache";
import { ImageCard } from "@/components/Cards";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import ThemedStyles, { height, width } from "@/constants/Styles";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  useColorScheme,
  View,
} from "react-native";

const Downloads = () => {
  const theme = useColorScheme() ?? "light";
  const styles = ThemedStyles(theme);
  const db = useSQLiteContext();
  const [downloads, setDownloads] = useState([]);

  const getDownloadAsync = async () => {
    let res: any = await getAllDownloads(db);
    setDownloads(res);
    await syncDownloadsToCache(db);
  };
  useEffect(() => {
    getDownloadAsync();
  }, []);
  const [state, setState] = useState<"loading-more">();
  const router = useRouter();
  return (
    <ThemedView style={{ flex: 1 }}>
      <ThemedView
        style={{
          width: width,
          height: height * 0.18,
          backgroundColor: Colors[theme].blur,
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <ThemedText style={{ fontWeight: "bold", fontSize: 30 }}>
          Wall
          <ThemedText
            style={{
              fontWeight: "bold",
              fontSize: 30,
              color: Colors.constants.pink,
            }}
          >
            Craft
          </ThemedText>
        </ThemedText>
        <ThemedText style={{ fontFamily: "SpaceMono" }}>DOWNLOADS</ThemedText>
      </ThemedView>
      {/* Flatlist */}
      <View style={{ height: height * 0.85 }}>
        <FlatList
          data={downloads}
          numColumns={3}
          contentContainerStyle={{ gap: 10, padding: 10 }}
          ListFooterComponent={() =>
            state === "loading-more" ? (
              <ActivityIndicator color={Colors.constants.pink} size={25} />
            ) : null
          }
          bounces={false}
          // inverted={Downloads.length > 10}
          renderItem={({
            item,
          }: {
            item: {
              id: number;
              uri: string;
              localUri: string;
              timestamp: string;
            };
          }) => (
            <ImageCard
              router={router}
              image_url={item.localUri}
              image_path={item.uri}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          // onEndReachedThreshold={0.1}
          // onEndReached={getImages}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ThemedView>
  );
};

export default Downloads;
