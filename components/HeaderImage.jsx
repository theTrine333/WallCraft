import { TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import { Text, View } from "../components/Themed";

export const ImageCerds = ({ Poster, navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Viewer", {
          Poster: Poster,
        });
      }}
      style={styles.Card}
    >
      <Image
        source={{ uri: Poster }}
        style={{ width: 105, height: 150, borderRadius: 10 }}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  Card: {
    marginLeft: 10,
    marginBottom: 10,
  },
  text: {
    fontWeight: "bold",
    paddingLeft: 10,
  },
});
