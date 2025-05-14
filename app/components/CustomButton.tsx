import React from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { styles } from '../styles'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'

interface CustomButtonProps extends TouchableOpacityProps {
    label : string;
}

export const CustomButton: React.FC<CustomButtonProps> = ({label,onPress,...rest}) => {
    return (
       <View style={styles.container}>
        <TouchableOpacity style={styles.button}
         onPress={(event) => {
            if (onPress) onPress(event);
         }}
         {...rest}
         >
          <Text style={styles.buttonText}>{label}</Text>
        </TouchableOpacity>
        </View>
    );
}