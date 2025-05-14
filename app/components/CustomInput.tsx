import React from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles';

type CustomInputProps = {
    label:string;
    isPassword?:boolean; 
    value:string;
    onChangeText: (text: string) => void; // Agregado

};
export const CustomInput = (props: CustomInputProps) => {
    const [text, onChangeText] = React.useState('');
    console.log(text);
  return (
    <View style ={styles.inputContainer}>
      <Text style= {styles.textStyle}>{props.label}</Text>
      <TextInput
        onChangeText={props.onChangeText}
        value={props.value}
        style={styles.inputStyle}
        secureTextEntry={props.isPassword}
        
      />
    </View>
  );

 
} 
