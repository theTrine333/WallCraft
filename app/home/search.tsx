import { getSearch } from "@/api/fetcher";
import { ResultCard } from "@/components/Cards";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import ThemedStyles from "@/constants/Styles";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
const Search = () => {
  const theme = useColorScheme() ?? "light";
  const styles = ThemedStyles(theme);
  const [text, setText] = useState("");
  const router = useRouter();
  const [Tags, setTags] = useState([]);
  const [isEmpty, setEmpty] = useState(false);
  const [isFetched, setFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  let timeoutId: any = null;

  function handleTextChange(inputText: string) {
    setText(inputText);
    setLoading(true);
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      getSearch(text, setTags).then((data) => {
        setLoading(false);
      });
    }, 800);
  }

  return (
    <ThemedView style={styles.container}>
      <TextInput
        style={styles.searchBox}
        placeholder="Search for wallpapers"
        autoFocus
        autoCapitalize={"none"}
        onChangeText={(text) => {
          setText(text);
          handleTextChange(text);
        }}
        onSubmitEditing={() => {
          handleTextChange(text);
        }}
      />
      {loading ? (
        <ActivityIndicator
          style={{ paddingTop: 10 }}
          size={"large"}
          color={Colors.constants.pink}
        />
      ) : isEmpty ? (
        <View style={{ alignContent: "center", paddingTop: 20 }}>
          <Text style={{ textAlign: "center", color: "green" }}>
            Retry again later
          </Text>
          <Text style={{ textAlign: "center", color: "white" }}>
            No results at the moment
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1, flexDirection: "column", margin: 10 }}>
          <FlatList
            data={Tags}
            renderItem={({ item }: { item: any }) => (
              <ResultCard
                data={{
                  img: item.img,
                  img_count: item.img_count,
                  title: item.title,
                  url: item.url,
                }}
                router={router}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </ThemedView>
  );
};

export default Search;
