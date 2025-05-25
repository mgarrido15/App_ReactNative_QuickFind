import { View, Text, TouchableOpacity, SafeAreaView, Image } from "react-native";
import React, { useRef } from "react"; // Añade useRef
import { styles } from "../styles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/screenType";
import { User } from "../models/User";
import { useRoute } from "@react-navigation/native";
import MapComponent from "../components/Map";
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList } from "../navigation/screenType";

type NavigationProp = BottomTabNavigationProp<TabParamList, "Home">;

export const Home = () => {
  const route = useRoute();
  const { user } = route.params as { user: User };
  const navigation = useNavigation<NavigationProp>();





  return (
    <SafeAreaView style={styles.HomeContainer}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.headerTitle, { marginLeft: 10 }]}>QuickFind</Text>
        </View>
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