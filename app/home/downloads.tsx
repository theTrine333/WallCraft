import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ThemedStyles from "@/constants/Styles";
import React from "react";
import { useColorScheme } from "react-native";

const Downloads = () => {
  const theme = useColorScheme() ?? "light";
  const styles = ThemedStyles(theme);
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Downloads</ThemedText>
    </ThemedView>
  );
};

export default Downloads;
