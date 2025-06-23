import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import ThemedStyles, { height, width } from "@/constants/Styles";
import * as Constants from "expo-constants";
import React from "react";
import { useColorScheme } from "react-native";
const Index = () => {
  const theme = useColorScheme() ?? "light";
  const styles = ThemedStyles(theme);
  const appversion = Constants.default.expoConfig?.version;
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
      <ThemedView></ThemedView>
    </ThemedView>
  );
};

export default Index;
