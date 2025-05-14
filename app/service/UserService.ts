import { User } from "../models/User";
import api from "./AxiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const logInUser = async (
  email: string,
  password: string
): Promise<{ token: string; user: User; refreshToken: string }> => {
  try {
    const response = await api.post("/users/login", {
      email,
      password,
    });

    if (response.status !== 200) {
      throw new Error("Failed to log in");
    }

    const { token, user, refreshToken } = response.data;

    console.log("Token recibido del servidor:", token);

    // Guarda el token y el refreshToken en AsyncStorage
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("refreshToken", refreshToken);

    return { token, user, refreshToken };
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    throw error;
  }
};