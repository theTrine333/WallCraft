import { extractTags } from "@/api/fetcher";
import { Colors } from "@/constants/Colors";
import ThemedStyles, { height, width } from "@/constants/Styles";
import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
const Genre = ({
  name,
  counter,
  selected,
  setSelected,
}: {
  name: string;
  counter: number;
  selected: string;
  setSelected: any;
}) => {
  const theme = useColorScheme() ?? "light";
  const styles = ThemedStyles(theme);
  return (
    <TouchableOpacity
      style={[
        styles.genreCard,
        selected === name && { backgroundColor: Colors.constants.pink },
      ]}
      onPress={() => {
        setSelected(name);
      }}
    >
      <Text style={selected === name && { color: "white" }}>{name}</Text>
      <Text
        style={[
          {
            backgroundColor: Colors.light.blur,
            paddingHorizontal: 5,
            fontSize: 10,
            textAlign: "center",
            verticalAlign: "middle",
            borderRadius: 10,
          },
          selected === name && { color: "white" },
        ]}
      >
        {counter}
      </Text>
    </TouchableOpacity>
  );
};

const ImageCard = ({
  image_url,
  image_path,
  router,
  Action,
}: {
  image_url: string;
  image_path?: string;
  router?: any;
  Action?: any;
}) => {
  const theme = useColorScheme() ?? "light";
  const styles = ThemedStyles(theme);

  return (
    <TouchableOpacity
      style={styles.imageCard}
      onPress={
        Action
          ? Action
          : () => {
              router.push({
                pathname: "/home/viewer",
                params: {
                  image: image_url,
                  path: image_path,
                },
              });
            }
      }
    >
      <Image
        source={image_url}
        style={{ height: "100%", width: "100%", borderRadius: 10 }}
      />
    </TouchableOpacity>
  );
};

function ResultCard({
  data,
  router,
}: {
  data: { url: string; img_count: string; img: string; title: string };
  router: any;
}) {
  return (
    <TouchableOpacity
      onPress={() => {
        let tag = extractTags(`${data.url}`);
        router.push({
          pathname: "/home/seeAll",
          params: {
            Tag: tag,
            Count: data.img_count,
          },
        });
      }}
      // style={styles.Card}
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
            source={data.img}
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
export { Genre, ImageCard, ResultCard };
