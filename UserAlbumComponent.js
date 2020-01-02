/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, {Component} from 'react';
import App from './App.js';
import firebase from 'react-native-firebase';
import ImagePicker from 'react-native-image-crop-picker';

import {
  View,
  FlatList,
  StyleSheet,
  Text,
  AsyncStorage,
  Button,
  Image,
  Form,
  Input,
  TextInput,
  Select,
  Option,
  TouchableOpacity,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

export default class UserAlbumComponent extends Component<{}> {
  state = {
    progress:0,
    numPhotosTotal:0,
    numPhotosDone:0,
    showCreateAlbumNamePrompt:false,
    imagesArray:[],
    arrayOfImageRows:[],
  }
  formSubmit = (values) => {
    console.log(values);
    this.props.navigation.navigate('Home', {val:values});
  }
  imgPicker = () => {
    try {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        multiple: true,
        maxFiles: 3000,
        mediaType: 'photo',
        compressImageQuality: 1,
      }).then(images => {
        // console.log(images);
        if (images.length != 0) {
          // this.uploadImage(images);
          this.setState({imagesArray:this.state.imagesArray.concat(images)});
          let viewArray = images.map((item, key) => this.createImageRow(item, key));
          this.setState({arrayOfImageRows: this.state.arrayOfImageRows.concat(viewArray)});
        }
      });
    } catch(error) {
      console.log(error);
    }
  }
  createImageRow = (item, key) => {
    return(
      <View style={styles.image_row}>
        <Text>{item.filename}</Text>
        <Image source={{uri:item.path}} style={styles.imageStyle}/>
      </View>
    );
  }
  uploadImage = (image_array) => {
    this.setState({numPhotosTotal:image_array.length});
    console.log("uploadImage method called");
    for (let i = 0; i <image_array.length; i ++) {
      this.setState({})
      image = image_array[i];
      console.log('got to uploadImage', i);
      console.log(image.filename);//TODO filename is iOS ONLY: change for android
      if (image.filename == undefined) {
        continue;
      }
      const filename = image.filename; // Generate unique name
      firebase
        .storage()
        .ref(`tutorials/images/${filename}`)
        .putFile(image.path)
        .on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          snapshot => {
            let state = {};
            state = {
              ...state,
              progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100 // Calculate progress percentage
            };
            if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
              AsyncStorage.setItem('images', JSON.stringify(image));
              console.log("Uploaded: ", filename);
              this.setState({numPhotosDone: this.numPhotosDone + 1});
            }
            this.setState(state);
          },
          error => {
            unsubscribe();
            alert('Sorry, Try again.');
          }
        );
      }
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>
        Current Picture {this.state.progress}, % uploaded, {this.state.numPhotosTotal - this.state.numPhotosDone} photos left
        </Text>
        <TouchableOpacity style={styles.touchableOpacityButton} onPress={this.imgPicker}>
          <Text>Select Images!</Text>
        </TouchableOpacity>
        <FlatList
          data={this.state.arrayOfImageRows}
          renderItem={({ item }) => (
            item
          )}
        />
        <Text>hello world {this.props.navigation.getParam('albumName', 'none?')}</Text>
        <Button title = "Submit & Pay" onPress = {() => this.props.navigation.navigate("UserInfoForm")} color='blue'/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lighter,
  },
  image_row: {
    flexDirection:'row'
  },
  touchableOpacityButton: {
    backgroundColor:'green',
    padding:10,
    margin:10
  },
  imageStyle: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
  },
});
