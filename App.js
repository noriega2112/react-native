import React, { useState } from 'react'
import { Text, View, StyleSheet, Image, Alert, TouchableOpacity, Platform } from 'react-native'
import * as imagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import uploadToAnonymousFilesAsync from 'anonymous-files';

const App = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const onPressImage = async () => {
    // let res = await imagePicker.launchCameraAsync();
    // console.log(res);
    // setImage(res.uri);
    let permissionResult = await imagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission to access camera is required');
      return;
    }

    let pickerResult = await imagePicker.launchImageLibraryAsync();
    if (pickerResult.cancelled)
      return;


    if (Platform.OS === 'web') {
      const remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      console.log(remoteUri);
      setSelectedImage({ localUri: pickerResult.uri, remoteUri });
    } else {
      console.log(pickerResult);
      setSelectedImage({ localUri: pickerResult.uri });
    }

  };
  const openShareDialog = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`The image is available at ${selectedImage.remoteUri}`);
      return;
    }

    await Sharing.shareAsync(selectedImage.localUri);

  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#292929'
    },
    title: {
      fontSize: 30,
      color: '#fff'
    },
    image: {
      width: 200,
      height: 200,
      borderRadius: 100,
      marginTop: 10,
      resizeMode: 'contain'
    },
    button: {
      backgroundColor: 'red',
      padding: 7,
      marginTop: 10,
      width: 100,
      height: 50,
      borderRadius: 5
    },
    buttonText: {
      color: '#fff',
      textAlign: 'center',
      fontSize: 15
    }
  })

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pick an Image</Text>
      <TouchableOpacity onPress={onPressImage} >
        <Image source={{ uri: selectedImage !== null ? selectedImage.localUri : 'https://picsum.photos/200/200' }} style={styles.image} />
      </TouchableOpacity>
      {
        selectedImage ?
          <TouchableOpacity
            onPress={openShareDialog}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Share this Image</Text>
          </TouchableOpacity>
          : (<View />)
      }
    </View >
  )
};





export default App;