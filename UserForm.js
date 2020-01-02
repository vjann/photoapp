/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, {Component} from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import { Formik } from 'formik';
import * as Yup from 'yup';
import App from './App.js'

import {
  View,
  StyleSheet,
  Text,
  Button,
  Image,
  Form,
  Input,
  TextInput,
  Select,
  Option,
} from 'react-native';




class UserForm extends Component<{}> {
  formSubmit = (values) => {
    console.log(values);
  }
  render() {
    return (
      <Formik
        initialValues={{ email: '', firstName: '', lastName: '' }}
        onSubmit={this.formSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View>
            <Text>Email:</Text>
            <TextInput
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              style={styles.t_input}
              placeholder='john.doe@example.com'
            />
            <Text>First Name:</Text>
            <TextInput
              onChangeText={handleChange('firstName')}
              onBlur={handleBlur('firstName')}
              value={values.firstName}
              style={styles.t_input}
              placeholder='John'
            />
            <Text>Last Name:</Text>
            <TextInput
              onChangeText={handleChange('lastName')}
              onBlur={handleBlur('lastName')}
              value={values.lastName}
              style={styles.t_input}
              placeholder='Doe'
            />
            <Button onPress={handleSubmit} title="Submit" />
          </View>
        )}
      </Formik>    );
  }
}

const UserFormNavigator = createStackNavigator({
  Home: {screen: HomeScreen},
  UserInfoForm: {screen: UserForm},
  },
  {
    initialRouteName: 'Home'
  }
);

const UserFormComponent = createAppContainer(UserFormNavigator)

export default UserFormComponent;

const styles = StyleSheet.create({
  t_input: {height: 40, borderColor: 'gray', borderWidth: 1, margin:10, padding:2},
});
