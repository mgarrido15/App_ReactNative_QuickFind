import { Text, View, FlatList, SafeAreaView, Alert, Platform } from "react-native";
import { CustomInput } from "../components/CustomInput";
import { CustomButton } from "../components/CustomButton";
import { styles } from "../styles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/screenType";
import { useState, useCallback, useEffect } from "react";
import { User } from "../../models/User";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logInUser } from "../../service/UserService";
import * as LocalAuthentication from "expo-local-authentication";

import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const API_URL = "http://localhost:4000/api";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">;

export const Login = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const redirectUri = AuthSession.makeRedirectUri({
    // @ts-ignore
    useProxy: true,
  });
  console.log("Redirect URI:", redirectUri); // ✅ 添加

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '47728922688-j402su96su82beicvv2tnegbjejehgo9.apps.googleusercontent.com',
    redirectUri,
     responseType: "token", // ✅ 添加这行
  scopes: ["profile", "email"], // ✅ 添加这行
  });

  // ✅ Web端监听 Google 登录弹窗的回传数据
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // ⚠️ 如果部署上线，请改成实际 origin；测试时可以注释掉下面这行
      // if (event.origin !== "http://localhost:4000") return;

      const { token, refreshToken, user } = event.data;

      if (token && user) {
        console.log("✅ Web Google 登录成功:", user);
        await AsyncStorage.setItem("user", JSON.stringify(user));
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("refreshToken", refreshToken);
        navigation.navigate("Home", { user });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
  console.log("Google OAuth Response:", response); // ✅ 添加调试日志

  if (response?.type === 'success') {
    const { authentication } = response;
    console.log("Authentication object:", authentication); // ✅ 添加调试日志

    if (!authentication?.accessToken) {
      console.warn("No accessToken received from Google Auth."); // ✅ 关键错误提示
      Alert.alert("Error", "No se recibió el token de Google.");  // ✅ 提示用户
      return;
    }

    // ✅ 如果 accessToken 存在才继续
    fetch(`${API_URL}/users/auth/google/token?token=${authentication.accessToken}`)
      .then(res => res.json())
      .then(async data => {
        console.log("Google Login Response:", data);
        const user = data.user;
        if (user && data.token) {
          await AsyncStorage.setItem("user", JSON.stringify(user));
          await AsyncStorage.setItem("token", data.token);
          await AsyncStorage.setItem("refreshToken", data.refreshToken);
          navigation.navigate("Home", { user });
        } else {
          Alert.alert("Error", "Respuesta del servidor inválida");
        }
      })
      .catch((error) => {
        console.error("Google login fetch error:", error);
        Alert.alert("Error", "Error al autenticar con el servidor.");
      });
  }
}, [response]);


 const handleGoogleLogin = () => {
  if (Platform.OS === 'web') {
    const frontendOrigin = window.location.origin;
    window.open(`${API_URL}/users/auth/google?origin=${encodeURIComponent(frontendOrigin)}`, "_blank", "width=500,height=600");
  } else {
    promptAsync();
  }
};

  const onLogin = useCallback(async () => {
    console.log("Intentando Login");
    Alert.alert("Login", "Intentando login");

    if (!email || !password) {
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
  }, [email, password, navigation]);

  const LoginBiometric = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const supportsBiometrics = supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT) || supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
    console.log('Tipos soportados:', supportedTypes);

    if (!hasHardware || !isEnrolled || !supportsBiometrics) {
      Alert.alert("Autenticación biométrica no disponible", "Tu dispositivo no soporta la autenticación biométrica o no está configurado.");
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Autenticación Biométrica",
      fallbackLabel: "Usar código",
    });

    if (result.success) {
      const userString = await AsyncStorage.getItem("user");
      if (!userString) {
        Alert.alert("Error", "No hay datos guardados para login biométrico. Prueba a logearte primero");
        return;
      }
      const user = JSON.parse(userString);
      navigation.navigate("Home", { user });
    } else {
      Alert.alert("Error en la autenticación biométrica");
    }
  };

  const formFields = [
    {
      key: "email",
      component: (
        <CustomInput
          label="Email"
          value={email}
          onChangeText={setEmail}
        />
      ),
    },
    {
      key: "password",
      component: (
        <CustomInput
          label="Password"
          isPassword={true}
          value={password}
          onChangeText={setPassword}
        />
      ),
    },
    {
      key: "button",
      component: <CustomButton label="Login" onPress={onLogin} />,
    },
    {
      key: "biometric",
      component: <CustomButton label="Autenticación Biométrica" onPress={LoginBiometric} />,
    },
    {
      key: "google",
      component: <CustomButton label="Login con Google" onPress={handleGoogleLogin} />,
    },
  ];

  return (
    <SafeAreaView style={styles.loginContainer}>
      <View style={styles.login}>
        <Text style={styles.title}>Login</Text>
        <FlatList
          data={formFields}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => item.component}
          contentContainerStyle={{ padding: 20 }}
        />
      </View>
    </SafeAreaView>
  );
};
