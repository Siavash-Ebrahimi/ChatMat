import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';// import the screens
import Start from './components/Start';
import Chat from './components/Chat';
// import Cha from './components/Cha';
import CustomActions from './components/CustomActions';
// import react native gesture handler
import 'react-native-gesture-handler';

// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Create the navigator, with this methods (createStackNavigator();) 
/*Think of a stack navigator like a pile of paper: you start with one sheet, then place a second 
sheet on top of it, then a third sheet, and so on. To get back to the bottom of the pile, you’d 
remove the first sheet of paper from the top of your stack, then the second, then the third. 
This concept is often used in application navigation: */
const Stack = createStackNavigator();

export default class App extends React.Component {

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Start"
        >
          <Stack.Screen
            name="Start"
            component={Start}
          />
          <Stack.Screen
            name="Chat"
            component={Chat}
          />
        </Stack.Navigator>

      </NavigationContainer>
    );
  }
}