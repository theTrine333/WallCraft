import { StyleSheet, TouchableOpacity,FlatList,ActivityIndicator,Text, View, Dimensions } from 'react-native'
import {React, useState,useEffect } from 'react'
import * as Fetcher from '../../api/fetcher'
import { useNavigation } from '@react-navigation/native';
import FastImage from '@changwoolab/react-native-fast-image';
let page = 2;

const Anime = () => {
  const [isLoading,setLoading] = useState(true)
  const [Tags,setTags] = useState([])
  const [hasFetched, setHasFetched] = useState(false);
  
  const navigation = useNavigation();

  function ImageCards({Poster,ImageUrl}){
    return(
        <TouchableOpacity onPress={() => {
            navigation.push('Viewer',{
                Poster:Poster,
                ImageUrl:ImageUrl
            })
            
        }} style={styles.Card}>
            <FastImage
                source={{
                  uri: Poster,
                  priority: FastImage.priority.high,
                }}
                resizeMode={FastImage.resizeMode.cover}
                loadingIndicatorSource={(
                  <ActivityIndicator/>
                )}
                style={{flex:1,borderRadius:10}}
            />
        </TouchableOpacity>
    )
  }

  
  useEffect(() =>{
    Fetcher.get_images("anime",0).then(tags => {
      setTags(tags)
      setLoading(false)
      setHasFetched(true);
    }).catch(error => console.error(error))  
  },[])

  return (
    <>
      {
        isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={'green'} size={'large'}/>
          </View>
        ) : (
          <View style={{flex:1,flexDirection:'column',margin:10}}>
            <FlatList
              data={Tags}
              renderItem={({item}) => <ImageCards Poster={item.Image} ImageUrl={item.Image_url}/>}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
              showsVerticalScrollIndicator={false}
              vertical
              onEndReachedThreshold={0.6}
              onEndReached={async () =>{
                Fetcher.get_images("anime",page).then(tags =>{
                  setTags((oldTags) => {
                    return [...oldTags,...tags]
                  })
                  page = page+1
                })
              }}
              ListFooterComponent={() => <ActivityIndicator  size={'small'} color={'green'}/>}
            />
          </View>
        )
      }
    </>
  )
}

export default Anime
const {height,width} = Dimensions.get("window");

const styles = StyleSheet.create({
  container:{
    flex:1,
    marginLeft:10,
    marginTop:10,
    marginRight:10
  },loadingContainer:{
    justifyContent:'center',
    alignContent:'center',
    flex:1
  },Card:{
    marginLeft:10,
    marginBottom:10,
    height:height*0.18,
    width:width*0.29
  }
})
