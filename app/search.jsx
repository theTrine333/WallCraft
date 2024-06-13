import { ActivityIndicator, Image,StyleSheet, TouchableOpacity,Text,FlatList, TextInput,View } from 'react-native'
import {React,useState } from 'react'
import * as Fetcher from '@/api/fetcher';
import { useNavigation } from '@react-navigation/native';

const Search = () => {
    const [text,setText] = useState('');
    const [Tags,setTags] = useState([])
    const [isEmpty,setEmpty] = useState(false)
    const [isFetched,setFetched] = useState(false)
    const [loading,setLoading] = useState(false)
    const navigation = useNavigation();

    function ImageCards({Poster,ImageUrl}){
      return(
          <TouchableOpacity onPress={() => {
              navigation.push('Viewer',{
                  Poster:Poster,
                  ImageUrl:ImageUrl
              })
              
          }} style={styles.Card}>
              <Image
                  source={{uri: `${Poster}`}}
                  style={{width:105,height:150,borderRadius:10}}
                  resizeMode='cover'
              />
          </TouchableOpacity>
      )
    }

  return (
    <View style={styles.container}>
      <TextInput style={styles.searchBox} 
        placeholder='Search for a tag'
        onChangeText={text =>{setText(text)}}
        onSubmitEditing={async ()=>{
          if (text != ''){
              setLoading(true)

              Fetcher.get_images_search(text).then(tags => {
                if (tags.length === 0) {
                  setEmpty(true)
                  setLoading(false)
                } else {
                  setTags(tags)
                  setEmpty(false)
                  setFetched(true)  
                  setLoading(false)
                }
                
              }).catch(error => console.error(error))  
          }
        }}
      />
      {
        loading ? (
            <ActivityIndicator style={{paddingTop:10}} size={'large'} color={'green'}/>
        ):isEmpty ? (
          <View style={{alignContent:'center',paddingTop:20}}>
            <Text style={{textAlign:'center', color:'green'}}>Retry again later</Text>
            <Text style={{textAlign:'center', color:'white'}}>No results at the moment</Text>
          </View>
        ):(
          <View style={{flex:1,flexDirection:'column',margin:10}}>
            <FlatList
              data={Tags}
              renderItem={({item}) => <ImageCards Poster={item.Image} ImageUrl={item.Image_url}/>}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
              showsVerticalScrollIndicator={false}
              vertical
            />
          </View>
        )
      }
    </View>
  )
}

export default Search

const styles = StyleSheet.create({
    container:{
        paddingTop:45,
        flex:1,
        backgroundColor:'rgb(50,50,50)'
    },searchBox:{
        backgroundColor:'white',
        width:'90%',
        marginLeft:20,
        height:38,
        borderRadius:8,
        paddingLeft:10
    },Card:{
      marginLeft:10,
      marginBottom:10
    }
})