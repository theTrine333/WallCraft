import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Text,
  View,
  Dimensions,
} from "react-native";
import { React, useState, useEffect } from "react";
import * as Fetcher from "../../api/fetcher";
import { ImageCerds } from "../../components/HeaderImage";
let page = 2;

const Dark = ({ navigation }) => {
  const [isLoading, setLoading] = useState(true);
  const [Tags, setTags] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    Fetcher.get_images("dc comics", 0)
      .then((tags) => {
        setTags(tags);
        setLoading(false);
        setHasFetched(true);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={"green"} size={"large"} />
        </View>
      ) : (
        <View style={{ flex: 1, flexDirection: "column", margin: 10 }}>
          <FlatList
            data={Tags}
            renderItem={({ item }) => (
              <ImageCerds Poster={item.Image} navigation={navigation} />
            )}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            vertical
            onEndReachedThreshold={0.4}
            onEndReached={async () => {
              Fetcher.get_images("dc comics", page).then((tags) => {
                setTags((oldTags) => {
                  return [...oldTags, ...tags];
                });
                page = page + 1;
              });
            }}
            ListFooterComponent={() => (
              <ActivityIndicator size={"small"} color={"green"} />
            )}
          />
        </View>
      )}
    </>
  );
};

export default Dark;
const { height, width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 10,
    marginTop: 10,
    marginRight: 10,
  },
  loadingContainer: {
    justifyContent: "center",
    alignContent: "center",
    flex: 1,
  },
  Card: {
    marginLeft: 10,
    marginBottom: 10,
    height: height * 0.18,
    width: width * 0.29,
  },
});
