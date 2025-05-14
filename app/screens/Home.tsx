import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator, Image } from "react-native"; // Asegúrate de importar Image desde react-native
import { useState, useEffect } from "react";
import { FlatList } from "react-native-gesture-handler";
import { styles } from "../styles";
import { CustomButton } from "../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/screenType";
import { User } from "../models/User";
import { useRoute } from "@react-navigation/native";
import MapComponent from "../components/Map"; 

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

export const Home = () => {
  const route = useRoute();
  const { user } = route.params as { user: User };

  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.HomeContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Profile", { user })}>
          <Image
            source={{ uri: user.avatar || "https://via.placeholder.com/50" }} 
            style={styles.headerImage}
          />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, width: "100%" }}>
        <MapComponent />
      </View>
    </SafeAreaView>
  );
};
