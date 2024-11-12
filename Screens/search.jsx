import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
  Dimensions,
  TextInput,
  View,
} from "react-native";
import { React, useState } from "react";
import * as Fetcher from "../api/fetcher";
import { useNavigation } from "@react-navigation/native";
import FastImage from "@phantom/react-native-fast-image";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";

const Search = () => {
  const [text, setText] = useState("");
  const [Tags, setTags] = useState([]);
  const [isEmpty, setEmpty] = useState(false);
  const [isFetched, setFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const adUnitId = "ca-app-pub-5482160285556109/6632741707";
  let timeoutId = null;
  function ResultCard({ data }) {
    return (
      <TouchableOpacity
        onPress={() => {
          let tag = Fetcher.extractTags(`${data.url}`);
          navigation.push("seeAll", {
            Tag: tag,
            Count: data.img_count,
          });
        }}
        style={styles.Card}
      >
        <View style={{ flexDirection: "row", width: width * 0.8 }}>
          <View
            style={{
              marginLeft: 10,
              marginRight: 10,
              marginBottom: 10,
              height: height * 0.1,
              width: width * 0.2,
            }}
          >
            <Image
              src={data.img}
              style={{ flex: 1, borderRadius: 8 }}
              resizeMode="cover"
            />
          </View>
          <View>
            <Text
              numberOfLines={2}
              style={{ color: "white", fontWeight: "bold", marginTop: 10 }}
            >
              {data.title.replace(/<\/?b>/g, "")}
            </Text>
            <Text style={{ color: "white" }}>{data.img_count}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  function handleTextChange(inputText) {
    setText(inputText);
    setLoading(true);
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      Fetcher.getSearch(text, setTags).then((data) => {
        setLoading(false);
      });
    }, 800);
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBox}
        placeholder="Search for a tag"
        onChangeText={(text) => {
          setText(text);
          handleTextChange(text);
        }}
        onSubmitEditing={handleTextChange}
      />
      {loading ? (
        <ActivityIndicator
          style={{ paddingTop: 10 }}
          size={"large"}
          color={"green"}
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
            renderItem={({ item }) => <ResultCard data={item} />}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
      <View style={{ position: "absolute", bottom: 0 }}>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        />
      </View>
    </View>
  );
};

export default Search;
const { height, width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    paddingTop: 45,
    flex: 1,
    backgroundColor: "rgb(50,50,50)",
  },
  searchBox: {
    backgroundColor: "white",
    width: "90%",
    marginLeft: 20,
    height: 38,
    borderRadius: 8,
    paddingLeft: 10,
  },
});
