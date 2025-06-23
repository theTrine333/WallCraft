import { see_all } from "@/api/fetcher";
import { ImageCard } from "@/components/Cards";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import ThemedStyles, { width } from "@/constants/Styles";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  useColorScheme,
  View,
} from "react-native";
let page = 2;
const SeeAll = () => {
  const params = useLocalSearchParams();
  const tag = params.Tag;
  const image_count: any = params.Count;
  const [Tags, setTags] = useState<string[]>([]);
  const router = useRouter();
  const [state, setState] = useState<
    null | "loading" | "error" | "loading-more" | "end"
  >();
  useEffect(() => {
    setState("loading");
    see_all(tag, 0)
      .then((tags: any) => {
        setTags(tags);
        setState(null);
      })
      .catch((error) => {
        setState("error");
      });
  }, []);

  const theme = useColorScheme() ?? "light";
  const styles = ThemedStyles(theme);
  return (
    <ThemedView style={styles.container}>
      <View style={[styles.rowView, { justifyContent: "space-between" }]}>
        <ThemedText
          style={{ fontWeight: "bold", fontSize: 20, textAlign: "center" }}
        >
          Wall
          <ThemedText
            style={{
              fontWeight: "bold",
              fontSize: 20,
              color: Colors.constants.pink,
            }}
          >
            Craft
          </ThemedText>
        </ThemedText>
        <ThemedText
          style={{
            fontWeight: "bold",
            fontSize: 20,
            maxWidth: width * 0.3,
            color: Colors.constants.pink,
          }}
          numberOfLines={1}
        >
          {tag.toString().toLocaleUpperCase()}
        </ThemedText>
      </View>
      <View style={{ flex: 1, width: width, marginLeft: -10 }}>
        {state === "loading" ? (
          <ActivityIndicator color={Colors.constants.pink} size={25} />
        ) : (
          <View style={{ flex: 1, margin: 5 }}>
            <FlatList
              data={Tags}
              numColumns={3}
              contentContainerStyle={{
                gap: 10,
                paddingVertical: 10,
              }}
              ListFooterComponent={() =>
                state === "loading-more" ? (
                  <ActivityIndicator color={Colors.constants.pink} size={25} />
                ) : null
              }
              bounces={false}
              inverted={Tags.length > 10}
              renderItem={({ item, index }) => (
                <ImageCard
                  image_url={item}
                  Action={() => {
                    router.push({
                      pathname: "/home/viewer",
                      params: { image: item, path: "" },
                    });
                  }}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
              onEndReachedThreshold={0.1}
              onEndReached={() => {
                setState("loading-more");
                if (Tags.length < image_count.replace(" images", "")) {
                  see_all(tag, page).then((tags: any) => {
                    let newTags = tags.filter(
                      (tag: string) => !Tags.includes(tag)
                    );
                    setTags([...Tags, ...newTags]);
                    page = page + 1;
                  });
                  setState(null);
                } else {
                  setState("end");
                }
              }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>
    </ThemedView>
  );
};

export default SeeAll;
