import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StyleSheet, Text, View } from "react-native";
import Black from "./black";
import Art from "./art";
import Cars from "./cars";
import Dark from "./dark";
import Trending from "./Trending";

const Tab = createMaterialTopTabNavigator();

export default function Tabs() {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        style={styles.container}
        screenOptions={{
          tabBarStyle: { backgroundColor: "rgb(45,45,45)", width: "100%" },
          tabBarScrollEnabled: true,
          tabBarShowIcon: true,
        }}
      >
        <Tab.Screen name="Top" component={Trending} />
        <Tab.Screen name="Art" component={Art} />
        <Tab.Screen name="Black" component={Black} />
        <Tab.Screen name="Cars" component={Cars} />
        {/* <Tab.Screen name="DC Comics" component={Dark} /> */}
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
