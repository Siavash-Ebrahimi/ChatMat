import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';

import { GiftedChat, Bubble } from 'react-native-gifted-chat'

// Call and Import Google Firebases and Firestore
const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {

  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        name: '',
        avatar: '',
      },
      loggedInText: 'Please wait, you are getting logged in',
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

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
        },
      });
    });
    this.setState({ messages });
  };


  componentDidMount() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    this.referenceChatMessages = firebase.firestore().collection('messages');

    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
        },
        loggedInText: '',
      });
      /* The below lines of code will get any update (onSnapshot) from Collection in our 
       database. Below just ask the app to take a snapshot of "messages" -> Collection
       through our connected database (MatChat database in Firestore). */
      this.unsubscribe = this.referenceChatMessages
        .orderBy('createdAt', 'desc')
        .onSnapshot(this.onCollectionUpdate);
    });

  }


  componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    /* We use below code to ask the app to do not get any update from database
       as we do not use chat.js component now */
    this.unsubscribe();
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
      () => {
        this.addMessage();
      }
    );
  }

  // Add message to Firestore Database (ChatMat)
  addMessage = () => {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  };

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
  }

  render() {
    let name = this.props.route.params.name;
    let color = this.props?.route?.params?.color;
    return (
      <View style={{ flex: 1, backgroundColor: color }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: this.state.uid,
            avatar: 'https://placeimg.com/140/140/any',
          }}
        />
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
      </View>
    )
  }
}
