import React from 'react';
import { View, Text, Button } from 'react-native';


export default class Chat extends React.Component {
  componentDidMount() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
  }
  render() {
    let name = this.props.route.params.name;
    let color = this.props.route.params.color;
    return (
      <View style={{ backgroundColor: color, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Chat with {name}</Text>
        <Button
          title="Back to Start"
          onPress={() => this.props.navigation.navigate('Start')}
        />
      </View>
    )
  }
}
