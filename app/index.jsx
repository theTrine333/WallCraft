import { get_images } from "@/api/fetcher";
import { Genre, ImageCard } from "@/components/Cards";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import ThemedStyles, { height } from "@/constants/Styles";
import { startWallpaperService } from "@/Service";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function HomeScreen() {
  const theme = useColorScheme() ?? "light";
  const styles = ThemedStyles(theme);
  const router = useRouter();

  const genres = [
    { name: "Cartoon", count: "10.9K" },
    { name: "Yellow", count: "3K" },
    { name: "Girl", count: "7.8K" },
    { name: "Motivational", count: 760 },
    { name: "Tesla Motors", count: 199 },
    { name: "Technology", count: "8.57K" },
    { name: "Men", count: "1K" },
  ];

  const [selectedGenre, setSelectedGenre] = useState("Cartoon");
  const [Images, setImages] = useState([]);
  const [state, setState] = useState("loading");
  const [isLoadingNew, setIsLoadingNew] = useState(false);
  const keywordRef = useRef("Dark");
  const pageRef = useRef(1);
  const db = useSQLiteContext();
  useEffect(() => {
    startWallpaperService(db);
  }, []);
  async function getImages() {
    try {
      if (keywordRef.current === selectedGenre) {
        setState("loading-more");
        pageRef.current += 1;
        const res = await get_images(selectedGenre, pageRef.current);
        // Filter duplicates based on Image_url
        setImages((prev) => {
          const existingUrls = new Set(prev.map((img) => img.Image_url));
          const newImages = res.filter(
            (img) => !existingUrls.has(img.Image_url)
          );
          setState(null);
          return [...prev, ...newImages]; // prepend for inverted FlatList
        });
        setState(null);
      } else {
        setImages([]);
        setState("loading");
        keywordRef.current = selectedGenre;
        pageRef.current = 1;
        const res = await get_images(selectedGenre, 1);
        setImages(res);
        setState(null);
      }
    } catch (error) {
      console.error("Failed to load images:", error);
      setState("error");
    }

    setState(null);
  }

  async function getNewGenres() {
    try {
      setIsLoadingNew(true);
      setIsLoadingNew(false);
    } catch (error) {}
  }

  useEffect(() => {
    getImages();
  }, [selectedGenre]);

  return (
    <ThemedView style={styles.container}>
      {/* Heading Component */}
      <View style={[styles.rowView, { justifyContent: "space-between" }]}>
        <ThemedText style={{ fontWeight: "bold", fontSize: 20 }}>
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

        {/* Buttons */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            style={styles.roundIconBtn}
            onPress={() => {
              router.push("/home/search");
            }}
          >
            <AntDesign name="search1" size={25} color={Colors[theme].text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.roundIconBtn}
            onPress={() => {
              router.push("/settings");
            }}
          >
            <Ionicons name="menu" size={25} color={Colors[theme].text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Genres */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 10,
          height: height * 0.08,
          alignItems: "center",
        }}
      >
        {genres.map(({ name, count }, index) => (
          <Genre
            key={index}
            name={name}
            counter={count}
            selected={selectedGenre}
            setSelected={setSelectedGenre}
          />
        ))}
      </ScrollView>

      {/* Image Grid */}
      <View style={{ height: height * 0.85 }}>
        {state === "loading" && Images.length === 0 ? (
          <ActivityIndicator color={Colors.constants.pink} size={28} />
        ) : state === "error" ? (
          <></>
        ) : (
          <FlatList
            data={Images}
            numColumns={3}
            contentContainerStyle={{ gap: 10, paddingVertical: 10 }}
            ListFooterComponent={() =>
              state === "loading-more" ? (
                <ActivityIndicator color={Colors.constants.pink} size={25} />
              ) : null
            }
            bounces={false}
            inverted={Images.length > 10}
            renderItem={({ item }) => (
              <ImageCard
                router={router}
                image_url={item.Image}
                image_path={item.Image_url}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            onEndReachedThreshold={0.1}
            onEndReached={getImages}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ThemedView>
  );
}
