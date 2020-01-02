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
import UserAlbumComponent from './UserAlbumComponent';
import Dialog from 'react-native-dialog';

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
  state = {
    showEmailPrompt:true,
    showCreateAlbumNamePrompt:false,
    newAlbumName:''
  }
  handleEmailInput = (email : string) => {
    console.log("email");
    console.log(email);
  }
  closeDialog = () => {
    //TODO: check if email is inputted
    this.setState({showCreateAlbumNamePrompt:false});
  }
  createAlbum = (newAlbumName) => {
    this.setState({showCreateAlbumNamePrompt:false});
    this.storeData('Album1', newAlbumName);
    this.props.navigation.navigate("UserAlbum",  {albumName:newAlbumName});
  }
  storeData = (key: string, value: string) => {
    try {
      AsyncStorage.setItem(key, value); //Should I use await keyword for async????
    } catch (error) {
      alert('error saving data');      // Error saving data
    }
  }
  retrieveData = async (key: string) => {
    try {
      const value = AsyncStorage.getItem(key);
      if (value !== null) {
        // We have data!!
        console.log(key, "retrieved data: ", value);
      }
    } catch (error) {
      alert('erro retrieving data')      // Error retrieving data
    }
  }

  render(){
    return(
      <View style={styles.container}>
        <Text style={styles.appTitle}>
        JinYun
        </Text>
        <TouchableOpacity style={styles.touchableOpacityButton} onPress={() => this.setState({showCreateAlbumNamePrompt:true})}>
          <Text>Create Album</Text>
        </TouchableOpacity>
        <Dialog.Container visible={this.state.showCreateAlbumNamePrompt}>
          <Dialog.Title>Create Album</Dialog.Title>
          <Dialog.Description>
            Please enter album name.
          </Dialog.Description>
          <Dialog.Input onChangeText={(albumName: string) => this.setState({newAlbumName:albumName})}></Dialog.Input>
          <Dialog.Button label="Cancel" onPress={this.closeDialog}/>
          <Dialog.Button label="Submit" onPress={() => this.createAlbum(this.state.newAlbumName)}/>
        </Dialog.Container>
      </View>
    );
  }
}

const MainNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  UserInfoForm: {screen: UserFormComponent},
  UserAlbum: {screen: UserAlbumComponent}
  },
  {initialRouteName: 'Home'}
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
  },
  appTitle: {
    fontSize: 40,
  }
});
//Current Problems
