import { Text, View } from '@/components/Themed';
import { StatusBar } from 'expo-status-bar';
import React from 'react'
import { Share,ScrollView,Platform,Dimensions,StyleSheet, FlatList,Pressable,Alert, TouchableOpacity, ActivityIndicator,Modal } from 'react-native';
import * as Icon from 'react-native-heroicons/outline'
import { getSimilarTags } from '@/api/fetcher';
import { setWallpaper, TYPE_SCREEN } from 'rn-wallpapers';
import * as FileSystem from 'expo-file-system';
import ProgressCircle from "rn-circle-progress"
import FastImage from '@changwoolab/react-native-fast-image';

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
  const [modalVisible, setModalVisible] = React.useState(false);
  const [isSet,setIsSet] = React.useState(false)

  const downloadFile = async () => {
    const uri = Poster;
    const parts = Poster.split('/');
    const fileName = parts[parts.length - 1];
    const fileUri = `${FileSystem.documentDirectory}/${fileName}`;

    async function saveFile(uri, filename, mimetype) {
      if (Platform.OS === "android") {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync(WallCraftFolder);
    
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
    setIsSet(true)
    setModalVisible(true)

    const downloadResumable = FileSystem.createDownloadResumable(
      uri,
      fileUri,
      {},
      (downloadProgress) => {
        const progress = (downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite)*100;
        setDownloadProgress(progress.toFixed(2));
      }
    );

    try {
      const fileuri = await downloadResumable.downloadAsync();
      setFileUri(fileuri);
      saveFile(fileuri.uri, fileName, fileuri["headers"]['content-type']);
      setIsSet(false)
      setModalVisible(false)
      setDownloadProgress(0)
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {setModalVisible(!modalVisible)}}>
        <View style={style.centeredView}>
          <View style={style.modalView}>
            {
              isSet && downloadProgress === 0 ? (<ActivityIndicator size={'large'}/>):
              downloadProgress > 0 ? (
              <ProgressCircle
                percent={downloadProgress}
                radius={30}
                borderWidth={4}
                color="#3399FF"
                shadowColor="#999"
                bgColor="#fff"
              >
                <Text style={{ fontSize: 13,color:"#3399FF" }}>{`${downloadProgress}%`}</Text>
              </ProgressCircle>) :
              (
                <>
                <Text style={{textAlign: 'center', color:'black',fontWeight:500, fontSize:18}}>Screen to apply for wallpaper</Text>
                <View style={{flexDirection:'row',backgroundColor:'transparent',alignItems: 'center',gap:15}}>
                  <TouchableOpacity style={{marginTop:20,marginRight:10}}
                    onPress={async () =>{
                      setIsSet(true)
                      setWallpaper({
                        uri: `${Poster}`,
                      },TYPE_SCREEN.HOME
                    ).then(() =>{
                        setModalVisible(false)
                        setIsSet(false)  
                      }
                    )
                  }
                }
                  >
                    <Icon.HomeIcon style={{justifyContent:'flex-end',marginLeft:5}} color={'rgb(35,45,75)'} size={40}/>
                    <Text style={{color:'black',paddingLeft:7}}>Home</Text>
                  </TouchableOpacity>
    
                  <TouchableOpacity style={{marginTop:20}} 
                    onPress={async () =>{
                      setIsSet(true)
                      setWallpaper({
                        uri: `${Poster}`,
                      },TYPE_SCREEN.LOCK
                    ).then(() =>{
                        setModalVisible(false)
                        setIsSet(false)  
                      }
                    )
                  }
                }
                  >
                    <Icon.LockClosedIcon style={{alignContent:'center',marginLeft:3}} color={'rgb(35,45,75)'} size={40}/>
                    <Text style={{color:'black',paddingLeft:8}}>Lock</Text>
                  </TouchableOpacity>
    
                  <TouchableOpacity style={{marginTop:20,marginLeft:10}}
                    onPress={async () =>{
                      setIsSet(true)  
                      setWallpaper({
                          uri: `${Poster}`,
                        },TYPE_SCREEN.BOTH
                      ).then(() =>{
                          setModalVisible(false)
                          setIsSet(false)  
                        }
                      )
                    }
                  }
                  >
                    <Icon.DevicePhoneMobileIcon color={'rgb(35,45,75)'} size={40}/>
                    <Text style={{color:'black',paddingLeft:7}}>Both</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity 
                  style={{backgroundColor:'red',marginTop:10, marginLeft:10,marginRight:5,paddingTop:10,paddingBottom:10,paddingLeft:90,paddingRight:90,borderRadius:26}}
                  onPress={() =>setModalVisible(false)}  
                >
                  <Text style={{fontWeight:500,color:'#fff'}}>Close</Text>
                </TouchableOpacity>
                </>
              )
            }
            
          </View>
        </View>
      </Modal>
      
      <FastImage
        style={{ width:width,height:height+40,borderRadius:5,alignSelf: 'center'}}
        source={{
            uri: Poster,
            priority: FastImage.priority.high,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />

      <View style={{width:'100%',flexDirection:'row',justifyContent:'center', backgroundColor: 'transparent' }}>
        <TouchableOpacity style={style.buttons} onPress={() => {setModalVisible(true)}}>
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
  centeredView: {
    marginTop:'60%',
    backgroundColor:'transparent'
  },
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
  },modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  icnBtns:{
    margin:20
  }
})
