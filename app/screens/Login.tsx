import React, { useState, useCallback } from "react";
import {Text, View, FlatList, SafeAreaView, Alert, TouchableOpacity, ImageBackground} from "react-native";
import { CustomInput } from "../components/CustomInput";
import { CustomButton } from "../components/CustomButton";
import { styles } from "../styles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/screenType";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logInUser } from "../service/UserService";
import * as LocalAuthentication from "expo-local-authentication";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

export const Login = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = useCallback(async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    try {
      const response = await logInUser(email, password);
      const user = response.user;
      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem("token", response.token);
      await AsyncStorage.setItem("refreshToken", response.refreshToken);
      navigation.navigate("Home", { user });
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    }
  }, [email, password, navigation]);

  const LoginBiometric = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const supportsBiometrics =
      supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT) ||
      supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);

    if (!hasHardware || !isEnrolled || !supportsBiometrics) {
      Alert.alert(
        "Autenticacion Biometrica no disponible",
        "Tu dispositivo no soporta la autenticación biometrica o no está configurado."
      );
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Autenticación Biométrica",
      fallbackLabel: "Usar código",
    });

    if (result.success) {
      const userString = await AsyncStorage.getItem("user");
      if (!userString) {
        Alert.alert(
          "Error",
          "No hay datos guardados para login biométrico. Prueba a logearte primero"
        );
        return;
      }
      const user = JSON.parse(userString);
      navigation.navigate("Home", { user });
    } else {
      Alert.alert("Error en la Autenticación biométrica");
    }
  };

  const formFields = [
    {key: "email",
      component: (
        <CustomInput
          label="Email"
          value={email}
          onChangeText={setEmail}
        />
      ),
    },
    {key: "password",
      component: <CustomInput label="Password" isPassword={true} value={password} onChangeText={setPassword}/>,
    },
    {key: "button",
      component: <CustomButton label="Login" onPress={onLogin} style={styles.button}/>,
    },
    {key: "biometric",
      component: <CustomButton label="Autenticación Biométrica" onPress={LoginBiometric} style={[styles.button, { backgroundColor: "#28a745" }]}/>    
    },
  ];

  return (
    <ImageBackground
      source={require("../../assets/images/imagenFondo.png")} 
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.loginContainer}>
        <View style={styles.login}>
          <Text style={styles.title}>Login</Text>

          <FlatList
            data={formFields}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => <View style={styles.inputContainer}>{item.component}</View>}
            showsVerticalScrollIndicator={false}
          />

          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={[styles.textStyle, { color: "#0066FF", marginTop: 30 }]}>
              ¿No tienes cuenta? Regístrate
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};
