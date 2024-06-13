import { Text, View } from '@/components/Themed';
import { StatusBar } from 'expo-status-bar';
import React from 'react'
import { Image, Share,ScrollView,Platform,Dimensions,StyleSheet, FlatList,Pressable,Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Icon from 'react-native-heroicons/outline'
import { getSimilarTags } from '@/api/fetcher';
import { setWallpaper, TYPE_SCREEN } from 'rn-wallpapers';
import * as FileSystem from 'expo-file-system';
const WallCraftFolder = 'WallCraft';

const Viewer = ({navigation, route}) => {
  const poster = route.params.Poster
  const similars_url = route.params.ImageUrl
  const { width, height } = Dimensions.get("window");
  const Poster = poster.slice(0, -12)
  const [loading,setLoading] = React.useState(true)
  const [error,setError] = React.useState(false)
  const [downloadProgress, setDownloadProgress] = React.useState(0);
  const [fileUri, setFileUri] = React.useState('');
  const [Tags,setTags] = React.useState([])

  const downloadFile = async () => {
    const uri = Poster;
    const parts = Poster.split('/');
    const fileName = parts[parts.length - 1];
    const fileUri = `${FileSystem.documentDirectory}/${fileName}`;

    async function saveFile(uri, filename, mimetype) {
      if (Platform.OS === "android") {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    
        if (permissions.granted) {
          const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    
          await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype)
            .then(async (uri) => {
              await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
            })
            .catch(e => console.log(e));
        } else {
          shareAsync(uri);
        }
      } else {
        shareAsync(uri);
      }
    }

    const downloadResumable = FileSystem.createDownloadResumable(
      uri,
      fileUri,
      {},
      (downloadProgress) => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        setDownloadProgress(progress);
      }
    );

    try {
      const fileuri = await downloadResumable.downloadAsync();
      setFileUri(fileuri);
      console.log(fileuri["headers"]['content-type']);
      saveFile(fileuri.uri, fileName, fileuri["headers"]['content-type']);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    getSimilarTags(similars_url).then(results =>{
      results.forEach(result =>{
          Tags.push({
            "Title": result.Title,
            "Url":result.Url,
            "MainImage": result.Image1,
            "Image2":result.Image2,
            "Image3":result.Image3
          })
        })
      setLoading(false)
    }).catch(error => {
      setError(true)
      setLoading(false)
      }
    )
  },[])

  function HeaderImage({Title,Poster}){
    const title = Title.toLowerCase()
    return (
      <TouchableOpacity onPress={() => {
        navigation.push("seeAll",{
          Tag:title
        })
      }} style={style.Card}>
          <Image
              source={{uri: Poster+"?h=450&r=0.5"}}
              style={{width:220,height:150,borderRadius:10}}
              resizeMode='cover'
          />
          <Text style={style.text}>#{Title}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <ScrollView style={{flex:1,alignContent:'center'}}>
      <StatusBar style="light" />
        <Image
          source={{uri: Poster}}
          style={{width:width,height:height+40,borderRadius:5,alignSelf: 'center'}}
          resizeMode="cover"
        />
      <View style={{width:'100%',flexDirection:'row',justifyContent:'center', backgroundColor: 'transparent' }}>
        <TouchableOpacity style={style.buttons} onPress={() => {
          Alert.alert('WallCraft', 'Do you want to set this as your home or lockscreen wallpaper', [
            {
              text: 'Both',
              onPress: async () => {
                setWallpaper(
                  {
                    uri:`${Poster}`,
                  },
                  TYPE_SCREEN.BOTH
                );
                console.log('Wallpaper set successfully')
              },
              style: 'cancel',
            },
            {
              text: 'Home', onPress: async () => {
                setWallpaper(
                  {
                    uri: `${Poster}`,
                  },
                  TYPE_SCREEN.HOME // Sets the wallpaper on Lock Screen only
                );
              }
            },{
              text:"Lock",onPress: async ()=>{
                setWallpaper(
                  {
                    uri: `${Poster}`,
                  },
                  TYPE_SCREEN.LOCK // Sets the wallpaper on Lock Screen only
                );
              }
            }
          ]);
        }}>
        <Icon.Cog8ToothIcon color="green" size={38}/>
        </TouchableOpacity>
        <TouchableOpacity style={style.buttons} onPress={() => {
          downloadFile()
        }}>
          <Icon.ArrowDownCircleIcon color="green" size={38}/>
        </TouchableOpacity>
        <TouchableOpacity style={style.buttons} onPress={async () => {
            const shareResults = await Share.share({
              message:`Checkout this awesome wallpaper ${Poster}`,
              title: "WallCraft",
            });
          }}>
          <Icon.ShareIcon color="green" size={38}/>
        </TouchableOpacity>
      </View>
        {
          loading ? (
            <ActivityIndicator color={'green'} size={'large'}/>
          )
          :error ? (
            <></>
          )
          : (
            <View style={style.headerCardContainer}>
              <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <Text lightColor="rgba(0,0,0,1)" darkColor="white" style={{marginLeft:20,fontWeight:'bold',marginTop:10}}>Similar Tags</Text>
              </View>
                <View style={{flexDirection:'row'}}>
                    <FlatList
                      data={Tags}
                      renderItem={({item}) => <HeaderImage Title={item.Title} Poster={item.MainImage}/>}
                      horizontal
                    />
                </View>
            </View>
          )
        }
    </ScrollView>
  )
}

export default Viewer

const style = StyleSheet.create({
  buttons:{
    padding:10,
    backgroundColor:'transparent',
    borderRadius:10,
    margin:10,
    width:50,
    height:50,
    justifyContent:'center',
    alignItems:'center'
  },headerCardContainer:{
    width: '97%',
    marginBottom:20,
    marginLeft:6,
    height: 200,
    elevation: 14,
    borderRadius: 12,
    backgroundColor:'white',
    shadowColor: 'green',
    shadowOffset: {
        width: 0,
        height: 4,
    },
  },Card:{
    marginLeft:10,
    marginBottom:10
  },title: {
    fontSize: 20,
    fontWeight: 600,
  },
})