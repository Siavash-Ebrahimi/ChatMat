import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';

const backgroundColors = {
  black: { backgroundColor: '#090c08' },
  purple: { backgroundColor: '#474056' },
  grey: { backgroundColor: '#8a95a5' },
  green: { backgroundColor: '#b9c6ae' }
};

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '', color: '' };
  }

  // alertMyText(input = []) {
  //   if (this.state.name === '') {
  //     Alert.alert('Please Insert Chat Room Name!');
  //   } else {
  //     this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.name });
  //   }
  // }

  render() {
    const { black, purple, grey, green } = backgroundColors;
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/B-I.png')}
          style={[styles.container, styles.image]}
        >
          <Text style={styles.title}>ChatMat !!</Text>

          <View style={styles.inputBox}>
            <TextInput
              style={styles.nameBox}
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              placeholder='Enter your Name' />
            <View>
              <Text style={styles.colorText}>Choose your Background:</Text>
              <View style={styles.colorWrapper}>
                <TouchableOpacity style={[styles.color, black]}
                  onPress={() =>
                    this.setState({ color: black.backgroundColor })
                  }
                />
                <TouchableOpacity style={[styles.color, purple]}
                  onPress={() =>
                    this.setState({ color: purple.backgroundColor })
                  }
                />
                <TouchableOpacity style={[styles.color, grey]}
                  onPress={() =>
                    this.setState({ color: grey.backgroundColor })
                  }
                />
                <TouchableOpacity style={[styles.color, green]}
                  onPress={() =>
                    this.setState({ color: green.backgroundColor })
                  }
                />
              </View>
            </View>
            <TouchableOpacity
              style={[styles.nameBox, styles.chatBox]}
              onPress={() =>
                this.props.navigation.navigate('Chat',
                  {
                    name: this.state.name,
                    color: this.state.color
                  })
              }
            >
              <Text
                style={[styles.colorText, styles.chatBoxText]}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#fff',
    marginTop: 60
  },
  inputBox: {
    backgroundColor: '#fff',
    height: '44%',
    width: '88%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingVertical: 20
  },
  nameBox: {
    height: 50,
    width: '88%',
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 2,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 50
  },
  colorText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 100
  },
  colorWrapper: {
    flexDirection: 'row'
  },
  color: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 10
  },
  chatBox: {
    backgroundColor: '#757083',
    justifyContent: 'center'
  },
  chatBoxText: {
    color: '#fff',
    fontWeight: '600'
  }
})