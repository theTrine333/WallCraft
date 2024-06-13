import { FlatList, ActivityIndicator, ScrollView, StyleSheet,Dimensions,TouchableOpacity,Image } from 'react-native';
import * as React from 'react'
import * as Fetcher from '../api/fetcher'
import { Text, View } from '@/components/Themed';
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import Tabs from './TopTabs/_layout';
import { StatusBar } from 'expo-status-bar';

export default function MainScreen() {
  const navigation = useNavigation();

  function HeaderImage({Title,Poster}){
    Title = Title.toLowerCase()
    return (
      <TouchableOpacity onPress={() => {
        navigation.navigate("seeAll",{
          Tag:Title
        })
      }} style={styles.Card}>
          <Image
              source={{uri: Poster+"?h=450&r=0.5"}}
              style={{width:220,height:150,borderRadius:10}}
              resizeMode='cover'
          />
          <Text style={styles.text}>#{Title}</Text>
      </TouchableOpacity>
    )
  }
  function ImageCerds({Poster,ImageUrl}){
    
    return(
        <TouchableOpacity onPress={() => {
            navigation.navigate('Viewer',{
                Poster:Poster,
                ImageUrl:ImageUrl
            })
        }} style={styles.Card}>
            <Image
                source={{uri: Poster}}
                style={{width:105,height:150,borderRadius:10}}
                resizeMode='cover'
            />
        </TouchableOpacity>
    )
  }

  const [loading,setLoading] = React.useState("true")
  const [error,setError] = React.useState("false")
  const [Tags,setTags] = React.useState([])
  const [Anime,setAnime] = React.useState([])
  const [Bmw,setBmw] = React.useState([])
  const [Bike,setBike] = React.useState([])
  const [Dark,setDark] = React.useState([])
  const [Night,setNight] = React.useState([])
  const [Moon,setMoon] = React.useState([])
  const [Technology,setTechnology] = React.useState([])
  const [Games,setGames] = React.useState([])
  const [superCars,setsuperCars] = React.useState([])
  const [Motivation,setMotivation] = React.useState([])
  const [currentTag,setCurrentTag] = React.useState("Paris")
  const colorScheme = useColorScheme();
  const { width, height } = Dimensions.get("window");

  return (
    <View style={{backgroundColor:Colors[colorScheme ?? 'light'].backGround,flex:1,paddingTop:40,justifyContent: 'flex-start'}}>
        <View style={{flexDirection:'row', justifyContent:'space-between',marginLeft:20,marginRight:30}}>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.title}>Wall</Text><Text style={styles.title2}>Craft</Text>
          </View>
          <TouchableOpacity onPress={() => {
            navigation.navigate("search")
          }}>
            <Feather name="search" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.separator} lightColor="rgba(0,0,0,0.4)" darkColor="rgba(255,255,255,0.8)" />
        <Tabs/>
      </View>
  );
}

const styles = StyleSheet.create({
  headerCardContainer:{
    width: '95%',
    marginBottom:20,
    marginLeft:6,
    height: 220,
    elevation: 14,
    borderRadius: 12,
    backgroundColor:'rgb(45,45,45)',
    shadowColor: 'grey',
    shadowOffset: {
        width: 0,
        height: 4,
    },
  },Card:{
    marginLeft:10,
    marginBottom:10
    
},container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap:10,
    width:"100%",
    paddingBottom:40
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
  },title2: {
    fontSize: 20,
    fontWeight: 'bold',
    color:'green'
  },text:{
    fontSize: 13,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '90%',
    marginLeft:20
  },
});
