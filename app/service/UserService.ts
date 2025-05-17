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

export const UpdateUserById = async (user: User): Promise<{ user: User }> => {
  try {
    const response = await api.put(`/users/${user._id}`, { user });
    console.log("Response from server:", response.data);

    if (response.status !== 200) {
      throw new Error("Failed to update user");
    }

    return { user: response.data};
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await api.get(`/users/${id}`);

    if (response.status !== 200) {
      throw new Error("Failed to fetch user");
    }

    return response.data.user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const FollowCompany = async (userId: string, companyId: string): Promise<{ user: User }> => {
  try {
    const response = await api.put(`/users/follows/${userId}`, { companyId });

    if (response.status !== 200) {
      throw new Error("Failed to follow company");
    }

    return { user: response.data.user };
  } catch (error) {
    console.error("Error following company:", error);
    throw error;
  }
};

export const UnfollowCompany = async (userId: string, companyId: string): Promise<{ user: User }> => {
  try {
    const response = await api.put(`/users/unfollow/${userId}`, { companyId });

    if (response.status !== 200) {
      throw new Error("Failed to unfollow company");
    }

    return { user: response.data.user };
  } catch (error) {
    console.error("Error unfollowing company:", error);
    throw error;
  }
};

export const getFollowedCompanies = async (userId: string): Promise<any[]> => {
  try {
    const response = await api.get(`/users/followedCompanies/${userId}`);

    if (response.status !== 200) {
      throw new Error("Failed to fetch followed companies");
    }

    return response.data.companies || response.data;
  } catch (error) {
    console.error("Error fetching followed companies:", error);
    throw error;
  }
};