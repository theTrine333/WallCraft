import SettingBtn from "@/components/CustomButtons";
import DropdownComponent from "@/components/DropDownComponent";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import ThemedStyles, { height, width } from "@/constants/Styles";
import { dropDownItem } from "@/constants/types";
import { useAppConfig } from "@/context/Configs";
import * as Constants from "expo-constants";
import { useRouter } from "expo-router";
import React from "react";
import { useColorScheme } from "react-native";
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
          SubHeading="The theme application should use"
          LeftIcon={
            <DropdownComponent
              values={themes}
              defaultValue={config.theme}
              setValue={(val: dropDownItem["value"]) =>
                updateConfig({ theme: val })
              }
              placeHolderText="Select theme"
              LeftIcon={<ThemedText style={{ marginRight: 8 }}>🎨</ThemedText>}
            />
          }
        />
      </ThemedView>
    </ThemedView>
  );
};

export default Index;
