import { Text, View } from "../components/Themed";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Share,
  ScrollView,
  Dimensions,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as Icon from "react-native-heroicons/outline";
import * as Fetcher from "../api/fetcher";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
let page = 2;

const SeeAll = ({ navigation, route }) => {
  const tag = route.params.Tag;
  const image_count = route.params.Count.match(/\d+/)[0];
  const [Tags, setTags] = useState([]);
  const [loading, isLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(true);
  const [error, setError] = useState(false);
  const adUnitId = "ca-app-pub-5482160285556109/6632741707";
  React.useEffect(() => {
    Fetcher.see_all(tag, 0)
      .then((tags) => {
        tags.forEach((tag) => {
          Tags.push(tag);
        });
        isLoading(false);
      })
      .catch((error) => {
        setError(true);
        isLoading(false);
      });
  }, []);

  function ImageCerds({ Poster }) {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.push("Viewer", {
            Poster: Poster,
          });
        }}
        style={styles.Card}
      >
        <Image
          src={Poster}
          style={{ flex: 1, borderRadius: 10 }}
          resizeMode="cover"
        />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.Container}>
      <StatusBar style="light" />
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text style={styles.title}>Wall</Text>
        <Text style={styles.title2}>Craft</Text>
      </View>
      <View
        style={styles.separator}
        lightColor="rgba(0,0,0,0.4)"
        darkColor="rgba(75,75,75,0.8)"
      />

      {loading ? (
        <ActivityIndicator color={"green"} size={"large"} />
      ) : (
        <View style={{ flex: 1, flexDirection: "column", margin: 10 }}>
          <FlatList
            data={Tags}
            renderItem={({ item }) => <ImageCerds Poster={item} />}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            vertical
            onEndReached={async () => {
              if (Tags.length < image_count) {
                Fetcher.see_all(tag, page).then((tags) => {
                  setTags((oldTags) => {
                    return [...oldTags, ...tags];
                  });
                  page = page + 1;
                });
              } else {
                setLoadingMore(false);
              }
            }}
            ListFooterComponent={() => {
              loadingMore ? (
                <ActivityIndicator size={"small"} color={"green"} />
              ) : (
                <></>
              );
            }}
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

export default SeeAll;
const { height, width } = Dimensions.get("window");
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    paddingTop: 40,
    alignContent: "center",
  },
  headerCardContainer: {
    width: "95%",
    marginBottom: 20,
    marginLeft: 6,
    height: 220,
    elevation: 14,
    borderRadius: 12,
    backgroundColor: "rgb(225,213,201)",
    shadowColor: "green",
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  Card: {
    marginLeft: 10,
    marginBottom: 10,
    height: height * 0.18,
    width: width * 0.29,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
    width: "100%",
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  title2: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: "80%",
    alignSelf: "center",
  },
});
