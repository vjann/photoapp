/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import firebase from 'react-native-firebase';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import UserFormComponent from './UserFormComponent.js';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  StatusBar,
  TouchableOpacity,
  AsyncStorage,
  Image,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const { app } = firebase.storage();

class HomeScreen extends Component<{}> {
  state = {progress:0, showEmailPrompt:true, numPhotosTotal:0, numPhotosDone:0}

  uploadImage = (image_array) => {
    this.setState({numPhotosTotal:image_array.length, showEmailPrompt:true});
    console.log("uploadImage method called");
    for (let i = 0; i <image_array.length; i ++) {
      this.setState({})
      image = image_array[i];
      console.log('got to uploadImage', i);
      console.log(image.filename);
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
  imgPicker = () => {
    try {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        multiple: true
      }).then(images => {
        // console.log(images);
        if (images.length != 0) {
          this.uploadImage(images);
        }
      });
    } catch(error) {
      console.log(error);
    }
  }
  handleEmailInput = (email : string) => {
    console.log("email");
    console.log(email);
  }
  closeDialog = () => {
    //TODO: check if email is inputted
    this.setState({showEmailPrompt:false});
  }

  render(){
    return(
      <View style={styles.container}>
        <Text>
        Current Picture {this.state.progress} % uploaded, {this.state.numPhotosTotal - this.state.numPhotosDone} left
        </Text>
        <Button title = "userform" onPress = {() => this.props.navigation.navigate("UserInfoForm")} color='blue'/>
        <TouchableOpacity style={styles.touchableOpacityButton} onPress={this.imgPicker}>
          <Text>Select Image!</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const MainNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  UserInfoForm: {screen: UserFormComponent},
  },
  {
    initialRouteName: 'Home'
  }
);

const App = createAppContainer(MainNavigator);

export default App;

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lighter,
  },
  touchableOpacityButton: {
    backgroundColor:'green',
    padding:10,
    margin:10
  }
});
