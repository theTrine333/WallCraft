import { clearAllImages, confirmAndClearAppCache } from "@/api/db";
import SettingBtn from "@/components/CustomButtons";
import DropdownComponent from "@/components/DropDownComponent";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import ThemedStyles, { height, width } from "@/constants/Styles";
import { dropDownItem } from "@/constants/types";
import { useAppConfig } from "@/context/Configs";
import Feather from "@expo/vector-icons/Feather";
import * as Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React from "react";
import { Switch, ToastAndroid, useColorScheme } from "react-native";
const themes: dropDownItem[] = [
  {
    label: "System",
    value: null,
  },
  { label: "Dark", value: "dark" },
  { label: "Light", value: "light" },
];
const Index = () => {
  const theme = useColorScheme() ?? "light";
  const styles = ThemedStyles(theme);
  const appversion = Constants.default.expoConfig?.version;
  const router = useRouter();
  const { config, updateConfig, themes } = useAppConfig();
  const db = useSQLiteContext();
  const handleClear = async () => {
    const success = await confirmAndClearAppCache();
    if (success) {
      await clearAllImages(db);
      ToastAndroid.show("Cache cleared", ToastAndroid.LONG);
    } else {
    }
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      {/* Header Component */}
      <ThemedView
        style={{
          width: width,
          height: height * 0.35,
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
        <ThemedText style={{ fontFamily: "SpaceMono" }}>
          V{appversion}
        </ThemedText>
      </ThemedView>
      {/* Settings Body */}
      <ThemedView>
        {/* Downloads */}
        <SettingBtn
          Heading="Downloads"
          SubHeading="All your downloaded wallpapers"
          Action={() => {
            router.push("/home/downloads");
          }}
        />
        {/* Theme */}
        <SettingBtn
          Heading="Theme"
          SubHeading="The theme that the app should use"
          LeftIcon={
            <DropdownComponent
              values={themes}
              defaultValue={config.theme}
              setValue={(val: dropDownItem["value"]) =>
                updateConfig({ theme: val })
              }
              placeHolderText="Select theme"
              LeftIcon={
                <ThemedText style={{ marginHorizontal: 10 }}>
                  {config.theme == null
                    ? "System"
                    : config.theme === "dark"
                    ? "Dark"
                    : "Light"}
                </ThemedText>
              }
            />
          }
        />
        {/* Updates buttons */}
        <SettingBtn
          Heading="Updates"
          SubHeading="Check to see if updates are available"
          Action={() => {
            router.push("/settings/updates");
          }}
        />
        <SettingBtn
          Heading="Wallpaper Changer"
          SubHeading="Allow automatic change of wallpapers"
          LeftIcon={<Switch />}
        />
        <SettingBtn
          Heading="Clear cache"
          HeadingStyle={{ color: Colors.constants.pink }}
          SubHeading="Delete all downloads in cache, this will reset the app"
          Action={handleClear}
          LeftIcon={
            <Feather name="trash-2" size={25} color={Colors.constants.pink} />
          }
        />
      </ThemedView>
    </ThemedView>
  );
};

export default Index;
