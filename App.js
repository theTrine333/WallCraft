import React from "react";
import MainScreen from "./Screens/mainScreen";
import Colors from "./constants/Colors";
import { useColorScheme } from "./components/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  ThemeProvider,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Viewer from "./Screens/Viewer";
import Specific from "./Screens/Specific";
import SeeAll from "./Screens/seeAll";
import Search from "./Screens/search";
import Tabs from "./Screens/TopTabs/_layout";
import { StatusBar } from "expo-status-bar";

const Stack = createStackNavigator();

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <NavigationContainer>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        {/* <MainScreen/> */}
        <Stack.Navigator>
          <Stack.Screen
            name="mainScreen"
            component={MainScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="search"
            component={Search}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="seeAll"
            component={SeeAll}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Viewer"
            component={Viewer}
            options={{ headerShown: false }}
          />

          {/* <Stack.Screen name="Specific" component={Specific} options={{headerShown:false}}/> */}
        </Stack.Navigator>
      </ThemeProvider>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
