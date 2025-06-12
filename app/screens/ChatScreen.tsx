import React from 'react';
import Chat from '../components/Chat';
import { View } from 'react-native';



export const ChatScreen = () => {

  return (
    <View style={{ flex: 1 }}>
      <Chat />
    </View>
  );
};

export default ChatScreen;