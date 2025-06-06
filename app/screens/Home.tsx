import { View, Text, TouchableOpacity, SafeAreaView, Image } from "react-native";
import React, { useRef } from "react"; // Añade useRef
import { styles } from "../styles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/screenType";
import { User } from "../../models/User";
import { useRoute } from "@react-navigation/native";
import MapComponent from "../components/Map";
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList } from "../../navigation/screenType";

type NavigationProp = BottomTabNavigationProp<TabParamList, "Home">;

export const Home = () => {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp>();

  // ✅ 加入容错处理：避免 Web 报错
  const user = (route.params as { user?: User })?.user;

  // ✅ 如果没有 user，显示提示（主要为 Web 调试）
if (!user) {
  return (
    <SafeAreaView style={styles.HomeContainer}>
      <Text style={{ fontSize: 18, margin: 20 }}>No user info provided.</Text>
    </SafeAreaView>
  );
}



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