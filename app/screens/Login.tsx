import { Text, View, Image, FlatList, SafeAreaView, Alert } from "react-native";
import { CustomInput } from "../components/CustomInput";
import  { CustomButton } from "../components/CustomButton";
import { styles } from "../styles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, screenProps } from "../navigation/screenType";
import { useState, useCallback } from "react";
import { User } from "../models/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logInUser } from "../service/UserService";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

export const Login = () => {
    const navigation = useNavigation<NavigationProp>();
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState(""); 
  
    const onLogin = useCallback(async () =>{
      console.log("Intentant Login");
      Alert.alert("Intentant Login");
      if (!email || !password) {
        window.alert("Error. Por favor, completa todos los campos.");
        Alert.alert("Error", "Por favor, completa todos los campos.");
        return;
      }
  
      try {
          const response = await logInUser(email, password);
          console.log("Login response:", response);
          const user: User = response.user;
          AsyncStorage.setItem("user", JSON.stringify(user));
          AsyncStorage.setItem("token", response.token);
          AsyncStorage.setItem("refreshToken", response.refreshToken);
          navigation.navigate("Home", { user });
      } 
      catch (error) {
        console.error("Error de red:", error);
        Alert.alert("Error", "No se pudo conectar con el servidor.");
      }
    }, [email,password,navigation]);

  const formFields = [
    { key: "email", component: <CustomInput label="Email" value={email} onChangeText={setEmail} /> },
    { key: "password", component: <CustomInput label="Password" isPassword={true} value={password} onChangeText={setPassword} /> },
    { key: "button", component: <CustomButton label="Login" onPress={onLogin} /> },
  ];

    return (
      <SafeAreaView style={styles.loginContainer}>
        
        <View style={styles.login}>
        <Text style={styles.title}>Login</Text>
          <FlatList
           data={formFields}
           keyExtractor={(item) => item.key}
            renderItem={({ item }) => item.component}
            contentContainerStyle={{padding:20}}
         />
        </View>
      </SafeAreaView>
    );
}