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

const Login = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sharedCompanyId, setSharedCompanyId] = useState<string | null>(null);
  const [sharedProductId, setSharedProductId] = useState<string | null>(null);

  const redirectUri = AuthSession.makeRedirectUri({});

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '47728922688-j402su96su82beicvv2tnegbjejehgo9.apps.googleusercontent.com',
    redirectUri,
    responseType: "token",
    scopes: ["profile", "email"],
  });

  // 从 URL 中读取分享参数
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cId = params.get("companyId");
    const pId = params.get("productId");
    if (cId && pId) {
      setSharedCompanyId(cId);
      setSharedProductId(pId);
      AsyncStorage.setItem("sharedCompanyId", cId);
      AsyncStorage.setItem("sharedProductId", pId);
    }
  }, []);

  // Web Google 登录窗口回传数据监听
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      const { token, refreshToken, user } = event.data;
      if (token && user) {
        await AsyncStorage.setItem("user", JSON.stringify(user));
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("refreshToken", refreshToken);
        await redirectAfterLogin();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Google OAuth 回调处理
  useEffect(() => {
    if (response?.type === 'success') {
      const accessToken = response.authentication?.accessToken;
      if (!accessToken) {
        Alert.alert("Error", "No se recibió el token de Google.");
        return;
      }

      fetch(`${API_URL}/users/auth/google/token?token=${accessToken}`)
        .then(res => res.json())
        .then(async data => {
          const user = data.user;
          if (user && data.token) {
            await AsyncStorage.setItem("user", JSON.stringify(user));
            await AsyncStorage.setItem("token", data.token);
            await AsyncStorage.setItem("refreshToken", data.refreshToken);
            await redirectAfterLogin();
          } else {
            Alert.alert("Error", "Respuesta del servidor inválida");
          }
        })
        .catch(() => {
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
    if (!email || !password) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }
    try {
      const response = await logInUser(email, password);
      await AsyncStorage.setItem("user", JSON.stringify(response.user));
      await AsyncStorage.setItem("token", response.token);
      await AsyncStorage.setItem("refreshToken", response.refreshToken);
      await redirectAfterLogin();
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    }
  }, [email, password]);

  const redirectAfterLogin = async () => {
    const cId = await AsyncStorage.getItem("sharedCompanyId");
    const pId = await AsyncStorage.getItem("sharedProductId");
    if (cId && pId) {
      await AsyncStorage.removeItem("sharedCompanyId");
      await AsyncStorage.removeItem("sharedProductId");
      navigation.navigate("Home", {
        screen: "Home",
        params: { companyId: cId, productId: pId },
      } as any);
    } else {
      navigation.navigate("Home", { screen: "Home" } as any);
    }
  };

  const LoginBiometric = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!hasHardware || !isEnrolled) {
      Alert.alert("Biometría no disponible", "Tu dispositivo no soporta o no tiene configurado biometría.");
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Autenticación Biométrica",
      fallbackLabel: "Usar código",
    });

    if (result.success) {
      const userStr = await AsyncStorage.getItem("user");
      if (!userStr) {
        Alert.alert("Error", "No hay datos guardados para login biométrico.");
        return;
      }
      await redirectAfterLogin();
    } else {
      Alert.alert("Error en la autenticación biométrica");
    }
  };

  const formFields = [
    { key: "email", component: <CustomInput label="Email" value={email} onChangeText={setEmail} /> },
    { key: "password", component: <CustomInput label="Password" isPassword value={password} onChangeText={setPassword} /> },
    { key: "button", component: <CustomButton label="Login" onPress={onLogin} /> },
    { key: "biometric", component: <CustomButton label="Autenticación Biométrica" onPress={LoginBiometric} /> },
    { key: "google", component: <CustomButton label="Login with Google" onPress={handleGoogleLogin} /> },
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

export default Login;
