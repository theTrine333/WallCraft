import { Dimensions, StyleSheet } from "react-native";
import { Colors } from "./Colors";
export const { width, height } = Dimensions.get("window");
const ThemedStyles = (theme: "light" | "dark" = "light") =>
  StyleSheet.create({
    container: { flex: 1, paddingTop: 40, paddingHorizontal: 10 },
    rowView: { width: "100%", flexDirection: "row", alignItems: "center" },
    roundIconBtn: {
      padding: 5,
      backgroundColor: Colors[theme].blur,
      borderRadius: 100,
    },
    // Drop Down styles
    dropdown: {
      margin: 16,
      height: 50,
      borderBottomColor: "gray",
      borderBottomWidth: 0.5,
    },
    icon: {
      marginRight: 5,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 16,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
    // End of drop down styles
    settingsBtn: {
      padding: 10,
      width: "95%",
      marginHorizontal: 20,
      alignSelf: "center",
      borderBottomWidth: 1,
      borderColor:
        theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
      height: height * 0.08,
      flexDirection: "row",
      alignItems: "center",
    },
    textInput: {
      padding: 5,
    },
    genreCard: {
      backgroundColor: theme === "light" ? "lightgrey" : "white",
      padding: 10,
      flexDirection: "row",
      gap: 10,
      paddingHorizontal: 15,
      borderRadius: 30,
    },
    miniButtons: {
      backgroundColor: "white",
      height: 50,
      width: 50,
      borderRadius: 100,
      position: "absolute",
      bottom: 30,
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
    },
    imageCard: {
      width: 110,
      height: 160,
      marginHorizontal: 2,
      borderRadius: 10,
      backgroundColor: "grey",
    },
    viewerPage: { flex: 1 },
    searchBox: {
      backgroundColor: Colors[theme].blur,
      width: "100%",
      // marginLeft: 5,
      height: 38,
      alignSelf: "center",
      borderRadius: 8,
      paddingLeft: 10,
    },
  });

export default ThemedStyles;
