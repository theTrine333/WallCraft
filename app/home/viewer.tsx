import { Colors } from "@/constants/Colors";
import ThemedStyles from "@/constants/Styles";
import { useDownloads } from "@/context/Download";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as FileSystem from "expo-file-system";
import { ImageBackground } from "expo-image";
import { useLocalSearchParams } from "expo-router";
// import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Share,
  ToastAndroid,
  TouchableOpacity,
  useColorScheme,
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
  const [menuShown, setMenuShown] = useState(false);
  const rotate = useSharedValue("0deg");
  const progress = useSharedValue(0);
  // const [Tags, setTags] = useState<ImageTagsProps[]>([]);
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
    if (exists) {
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
        // await Sharing.shareAsync(localUri);
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

  const handleSetWallpaper = async () => {
    try {
      if (await hasCorrectPermission()) {
        const { exists, localUri } = await getLocalFileUri(Image);
        if (exists) {
          await setWallpaper({ uri: localUri }, TYPE_SCREEN.HOME);
        } else {
          await setWallpaper({ uri: Image }, TYPE_SCREEN.HOME);
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
      <AnimatedButton style={[styles.miniButtons, shareStyles]}>
        <Entypo
          name="share"
          size={20}
          color={Colors.constants.pink}
          onPress={handleShare}
        />
      </AnimatedButton>

      {/* Settings buttons */}
      <AnimatedButton style={[styles.miniButtons, settingStyles]}>
        <Ionicons
          name="settings"
          size={20}
          color={Colors.constants.pink}
          onPress={handleSetWallpaper}
        />
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
    </ImageBackground>
  );
};

export default Viewer;
