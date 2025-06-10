import React, { useState, useCallback, useEffect } from "react";
import {
  Text,
  View,
  FlatList,
  SafeAreaView,
  Alert,
  ImageBackground,
} from "react-native";
import { CustomInput } from "../components/CustomInput";
import { CustomButton } from "../components/CustomButton";
import { styles } from "../styles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/screenType";
import { registerUser } from "../service/UserService";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Register">;

export const Register = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");


  const [validations, setValidations] = useState({
    minLength: false,
    hasUpper: false,
    hasLower: false,
    hasSpecial: false,
  });


  useEffect(() => {
    setValidations({
      minLength: password.length >= 6,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
    });
  }, [password]);

  const validatePassword = (pwd: string) => {
    return (
      pwd.length >= 6 &&
      /[A-Z]/.test(pwd) &&
      /[a-z]/.test(pwd) &&
      /[^A-Za-z0-9]/.test(pwd)
    );
  };

  const onRegister = useCallback(async () => {
    if (!email || !password || !name || !confirmPassword) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }
    if (!validatePassword(password)) {
      Alert.alert(
        "Contraseña inválida",
        "La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un carácter especial."
      );
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }
    try {
      await registerUser(email, password, name);
      Alert.alert("Registro exitoso", "Puedes iniciar sesión ahora.");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error", "No se pudo registrar el usuario.");
    }
  }, [email, password, confirmPassword, name, navigation]);

  const formFields = [
    {key: "name",
        component: <CustomInput label="Nombre" value={name} onChangeText={setName}/>
    },
    {key: "email",
      component: <CustomInput label="Email" value={email} onChangeText={setEmail}/>
    },
    {key: "password",
      component: <CustomInput label="Contraseña" isPassword={true} value={password} onChangeText={setPassword}/>
    },
    {key: "confirmPassword",
      component: <CustomInput label="Confirmar Contraseña" isPassword={true} value={confirmPassword} onChangeText={setConfirmPassword}/>
    },
    {key: "button",
      component: <CustomButton label="Registrarse" onPress={onRegister} style={styles.button}/>
    },
  ];

  return (
    <ImageBackground
      source={require("../../assets/images/imagenFondo.png")} 
      style={styles.backgroundImage}
    >
      <SafeAreaView style={styles.loginContainer}>
        <View style={styles.login}>
          <Text style={styles.title}>Registro</Text>

          <FlatList
            data={formFields}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => (
              <View style={styles.inputContainer}>{item.component}</View>
            )}
            scrollEnabled={false}
          />

          <View style={{ marginTop: 10 }}>
            <Text
              style={{
                color: validations.minLength ? "green" : "red",
                fontSize: 14,
                marginBottom: 3,
              }}
            >
              • Al menos 6 caracteres
            </Text>
            <Text
              style={{
                color: validations.hasUpper ? "green" : "red",
                fontSize: 14,
                marginBottom: 3,
              }}
            >
              • Contiene mayúscula
            </Text>
            <Text
              style={{
                color: validations.hasLower ? "green" : "red",
                fontSize: 14,
                marginBottom: 3,
              }}
            >
              • Contiene minúscula
            </Text>
            <Text
              style={{
                color: validations.hasSpecial ? "green" : "red",
                fontSize: 14,
                marginBottom: 3,
              }}
            >
              • Contiene carácter especial
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Register;
