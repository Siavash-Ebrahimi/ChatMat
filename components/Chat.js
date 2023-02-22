import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
// Import & Call React-Native asyncStorage to save messages dada on user device iOS/Android.
import AsyncStorage from "@react-native-async-storage/async-storage";
/* Import & Call React-Native NetInfo to determine if a user is onLine or offLine 
   for choose the fetch data methods: From AsyncStorage (Local Storage) or from Static Database (Google Firestore) */
import NetInfo from '@react-native-community/netinfo';
// Call and Import Google Firebases and Firestore
const firebase = require('firebase');
require('firebase/firestore');

// For adding + sighn to creat action functnality.
import CustomActions from './CustomActions';

import * as Location from 'expo-location';
import MapView from 'react-native-maps';

// Declare an empty Offline alert system message.
let offlineAlert = {
  _id: 1,
  text: "",
  system: true,

};

// Chat component
export default class Chat extends React.Component {

  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {},
      image: null,
      location: null,
      isConnected: false,
    }

    // =================================================
    // Connected ChatApp database to chat.js componnent
    // =================================================

    /* 1) Connected ChatApp database to chat.js componnent, We got this 
          configuration through the (Google Firebase) account in the same 
          project we need to read and update the database. Firestore Section */
    const firebaseConfig = {
      apiKey: "AIzaSyBaGVZjS_dLnNBUhK8ugd8gyZRqlfIwdK8",
      authDomain: "chatmat-da72c.firebaseapp.com",
      projectId: "chatmat-da72c",
      storageBucket: "chatmat-da72c.appspot.com",
      messagingSenderId: "679235109092",
      appId: "1:679235109092:web:e9d4a9308bce226db9ecf1",
      measurementId: "G-VQY9399QNM"
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    /* 2) A reference to ChatApp Firestore COLLECTION, use a reference like below to a 
       collection to query its documents— for instance, if you wanted to fetch all users 
       (from a “users” collection) with the first name "Steve" */
    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  // Retrieve chat messages from asyncStorage (Client-Side Storage) // temporarly storage of messages
  getMessages = async () => {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  //  Save chat messages on asyncStorage (Client-Side Storage) 
  saveMessages = async () => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  };

  //  Delete chat messages on asyncStorage (Client-Side Storage)
  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  };

  componentDidMount() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    this.referenceChatMessages = firebase.firestore().collection('messages');

    // Using React-Native "NetInfo" to check if user Online / Offline
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        // authorize firebase
        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async (user) => {
            if (!user) {
              await firebase.auth().signInAnonymously();
            }
            //update user state with currently active user data
            this.setState({
              uid: user?.uid,
              messages: [],
              isConnected: true,
            });
            /* The below lines of code will get any update (onSnapshot) from Collection in our 
               database. Below just ask the app to take a snapshot of "messages" -> Collection
               through our connected database (MatChat database in Firestore). */
            this.unsubscribe = this.referenceChatMessages
              .orderBy('createdAt', 'desc')
              .onSnapshot(this.onCollectionUpdate);
          });
      } else {
        // update offline alert system message
        offlineAlert = {
          _id: 1,
          text: "You Are Offline!! Messages can't be updated or sent.",
          system: true,
        };

        // get messages from local storage if not online
        this.getMessages();
        this.setState({ isConnected: false });
      }
    });
  }

  componentWillUnmount() {
    if (this.state.isConnected) {
      /* We use below code to ask the app to do not get any update from database as we do not use chat.js component now */
      this.unsubscribe();
      // stop listening to authentication
      this.authUnsubscribe();
    }
  }

  // Update and push data on Firestorage database.
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text || "",
        createdAt: data.createdAt.toDate(),
        user: data.user,
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({ messages });
  };

  // Add message to Firestore Database (ChatMat)
  addMessage = () => {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  };

  //define title in navigation bar
  static navigationOptions = ({ navigation }) => {
    return {
      title: `${navigation.state.params.userName}'s Chat`,
    };
  };

  // This function will active once we touch the send item to send our message.
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
      () => {
        this.addMessage();
        this.saveMessages();
      }
    );
  };

  /* Gifted Chat provides you with a prop called renderInputToolbar that 
     lets you change how the bar is rendered. To only render the default 
     InputToolbar when the user is online: */
  renderInputToolbar(props) {
    if (props.isConnected === false) {
      return <InputToolbar {...props} />;
    } else {
      return <InputToolbar {...props} />;
    }
  }

  // This Function control font, shape , color etc on both left & right of any message to display on mobile app.
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#153329",
          },
          left: {
            backgroundColor: "#505956",
          },
        }}
      />
    );
  };

  /**
   * displays the communication features
   * @function renderCustomActions
   */

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  //custom map view
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
    let name = this.props.route.params.name;
    let color = this.props?.route?.params?.color;
    return (
      <View style={{ flex: 1, backgroundColor: color }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          // if offline, append offlineAlert message before message array
          messages={
            this.state.isConnected
              ? this.state.messages
              : [offlineAlert, ...this.state.messages]
          }
          // messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          renderActions={this.renderCustomActions.bind(this)}
          renderCustomView={this.renderCustomView.bind(this)}
          user={{
            _id: this.state.uid,
          }}
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    )
  }
}
