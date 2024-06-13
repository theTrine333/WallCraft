import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MainScreen from './mainScreen';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { DarkTheme, DefaultTheme, NavigationContainer, ThemeProvider } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack'
import Viewer from './Viewer';
import Specific from './Specific';
import SeeAll from './seeAll';
import Search from './search';
import Tabs from './TopTabs/_layout';
import { StatusBar } from 'expo-status-bar';



// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon({name,color}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}
const Stack = createStackNavigator()

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* <MainScreen/> */}
      <Stack.Navigator>
        <Stack.Screen name="mainScreen" component={MainScreen} options={{headerShown:false}}/>
        <Stack.Screen name="search" component={Search} options={{headerShown:false}}/>
        <Stack.Screen name="seeAll" component={SeeAll} options={{headerShown:false}}/>
        <Stack.Screen name="Viewer" component={Viewer} options={{headerShown:false}}/>
        
        {/* <Stack.Screen name="Specific" component={Specific} options={{headerShown:false}}/> */}
      </Stack.Navigator>
    </ThemeProvider>
  );
}
