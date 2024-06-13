import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import * as FileSystem from 'expo-file-system';

const DownloadFile= () => {
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [fileUri, setFileUri] = useState('');

  const downloadFile = async ({url}) => {
    const uri = url;
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    const fileUri = `${FileSystem.documentDirectory}/${fileName}`;

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
      const { uri } = await downloadResumable.downloadAsync();
      setFileUri(uri);
      console.log('Finished downloading to ', uri);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View>
      <Button title="Download File" onPress={downloadFile} />
      <Text>Download Progress: {Math.round(downloadProgress * 100)}%</Text>
      {fileUri ? <Text>File saved to: {fileUri}</Text> : null}
    </View>
  );
};

export default DownloadFile;
