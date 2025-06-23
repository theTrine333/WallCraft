import { checkDownload } from "@/api/db";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import ThemedStyles, { height, width } from "@/constants/Styles";
import { useDownloads } from "@/context/Download";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as FileSystem from "expo-file-system";
import { ImageBackground } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Share,
  ToastAndroid,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { hasCorrectPermission, setWallpaper, TYPE_SCREEN } from "rn-wallpapers";
const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity);

export const getLocalFileUri = async (remoteUrl: string) => {
  const fileName = remoteUrl.split("/").pop();
  const localUri = `${FileSystem.documentDirectory}${fileName}`;

  const fileInfo = await FileSystem.getInfoAsync(localUri);
  return {
    exists: fileInfo.exists,
    localUri,
    fileName,
  };
};

const Viewer = () => {
  const params = useLocalSearchParams();
  const [Image, setImage] = useState<string>("");
  const [state, setState] = useState<null | "loading" | "error">(null);
  const theme = useColorScheme() ?? "light";
  const styles = ThemedStyles(theme);
  const downlaoder = useDownloads();
  const [modalShown, setModalShown] = useState<boolean>(false);
  const [menuShown, setMenuShown] = useState<boolean>(false);

  const db = useSQLiteContext();
  const rotate = useSharedValue("0deg");
  const progress = useSharedValue(0);
  const GetStyle = (x: number, y: number) =>
    useAnimatedStyle(() => ({
      transform: [
        {
          translateX: progress.value * x,
        },
        {
          translateY: progress.value * y,
        },
        { scale: progress.value },
      ],
      opacity: progress.value,
    }));
  const downloadStyle = GetStyle(-3, -80);
  const shareStyles = GetStyle(-80, -45);
  const settingStyles = GetStyle(80, -45);

  const handleMenuClicked = () => {
    rotate.value = withSpring(menuShown ? "0deg" : "45deg");
    progress.value = withSpring(menuShown ? 0 : 1, {
      damping: 20,
      stiffness: 200,
    });
    setMenuShown(!menuShown);
  };

  const handleDownload = async () => {
    const { exists, localUri } = await getLocalFileUri(Image);
    const existance = await checkDownload({
      db: db,
      uri: Image.toString(),
      localUri: Image,
    });
    if (exists || existance) {
      ToastAndroid.show("The file is already downloaded", ToastAndroid.SHORT);
      return;
    }
    downlaoder.enqueueDownload(Image);
  };

  const handleShare = async () => {
    if (!Image) return;

    const { exists, localUri } = await getLocalFileUri(Image);

    try {
      if (exists) {
        // Share local file
        await Sharing.shareAsync(localUri);
        console.log(localUri);
      } else {
        // Share the image URL
        await Share.share({
          message: Image,
          url: Image,
          title: "Check this out",
        });
      }
    } catch (error: any) {
      Alert.alert("Error sharing", error.message);
    }
  };

  const handleSetWallpaper = async ({
    showModal = false,
    TYPE,
  }: {
    showModal: true | false;
    TYPE?: TYPE_SCREEN;
  }) => {
    if (!modalShown && showModal) {
      setModalShown(true);
      return;
    }
    try {
      if (await hasCorrectPermission()) {
        const { exists, localUri } = await getLocalFileUri(Image);
        if (exists) {
          await setWallpaper({ uri: localUri }, TYPE);
        } else {
          await setWallpaper({ uri: Image }, TYPE);
        }
      } else {
        Alert.alert("Permissions are required");
      }
    } catch (error: any) {
      Alert.alert("Something went wrong : ", error);
    }
  };
  useEffect(() => {
    let res = params.image.toString().replace("?h=450&r=0.5", "");
    setImage(res);

    // let path = params.path.toString();
    // getSimilarTags(path).then((e: any) => {
    //   setTags(e);
    // });
  }, [params.image]);

  return (
    <ImageBackground
      style={styles.viewerPage}
      source={Image}
      placeholder={{ uri: params.image.toString() }}
      placeholderContentFit="cover"
      onLoadStart={() => {
        setState("loading");
      }}
      onLoadEnd={() => {
        setState(null);
      }}
      onError={() => {
        setState("error");
      }}
    >
      {/* Animated buttons */}
      {/* Share buttons */}
      <AnimatedButton
        style={[styles.miniButtons, shareStyles]}
        onPress={handleShare}
      >
        <Entypo name="share" size={20} color={Colors.constants.pink} />
      </AnimatedButton>

      {/* Settings buttons */}
      <AnimatedButton
        style={[styles.miniButtons, settingStyles]}
        onPress={() => {
          handleSetWallpaper({ showModal: true });
        }}
      >
        <Ionicons name="settings" size={20} color={Colors.constants.pink} />
      </AnimatedButton>

      {/* Download button */}
      <AnimatedButton
        style={[styles.miniButtons, downloadStyle]}
        onPress={handleDownload}
        disabled={downlaoder.activeDownload === Image}
      >
        {downlaoder.activeDownload === Image ? (
          <ActivityIndicator color={Colors.constants.pink} />
        ) : (
          <AntDesign name="download" size={20} color={Colors.constants.pink} />
        )}
      </AnimatedButton>
      <AnimatedButton
        style={[
          {
            backgroundColor: Colors.constants.pink,
            height: 60,
            width: 60,
            borderRadius: 100,
            position: "absolute",
            bottom: 20,
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center",
            transform: [{ rotate }],
          },
        ]}
        disabled={state === "loading"}
        onPress={handleMenuClicked}
      >
        {state === "loading" ? (
          <ActivityIndicator size={30} color={"white"} />
        ) : (
          <Ionicons name="add" size={30} color={"white"} />
        )}
      </AnimatedButton>

      {/* Wallpapers bottom modal */}
      <Modal
        onRequestClose={() => {
          setModalShown(false);
        }}
        transparent
        visible={modalShown}
      >
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <Animated.View
            // entering={SlideInDown.damping(80).stiffness(200)}
            // exiting={SlideOutDown.damping(80).stiffness(200)}
            style={{
              height: height * 0.25,
              width: width,
              position: "absolute",
              bottom: 0,
              padding: 20,
              borderTopLeftRadius: 26,
              borderTopRightRadius: 26,
              backgroundColor: Colors[theme].background,
              alignItems: "center",
            }}
          >
            <ThemedText style={{ fontSize: 14 }}>
              Select a screen to set wallpaper for :
            </ThemedText>
            <View
              style={{
                margin: 10,
                justifyContent: "space-between",
                flex: 1,
                alignItems: "flex-start",
              }}
            >
              <TouchableOpacity
                style={{ flexDirection: "row", gap: 10 }}
                onPress={() => {
                  handleSetWallpaper({
                    showModal: true,
                    TYPE: TYPE_SCREEN.HOME,
                  });
                }}
              >
                <AntDesign name="home" size={25} color={Colors[theme].text} />
                <ThemedText>Home Screen</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ flexDirection: "row", gap: 10 }}
                onPress={() => {
                  handleSetWallpaper({
                    showModal: true,
                    TYPE: TYPE_SCREEN.LOCK,
                  });
                }}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={25}
                  color={Colors[theme].text}
                />
                <ThemedText>Lock Screen</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ flexDirection: "row", gap: 10 }}
                onPress={() => {
                  handleSetWallpaper({
                    showModal: true,
                    TYPE: TYPE_SCREEN.BOTH,
                  });
                }}
              >
                <Feather
                  name="smartphone"
                  size={25}
                  color={Colors[theme].text}
                />
                <ThemedText>Both Screen</ThemedText>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default Viewer;
