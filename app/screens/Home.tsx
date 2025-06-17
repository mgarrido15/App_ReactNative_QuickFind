import { View, Text, TouchableOpacity, SafeAreaView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { styles } from "../styles";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { TabParamList } from "../../navigation/screenType";
import { User } from "../../models/User";
import MapComponent from "../components/Map";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type NavigationProp = BottomTabNavigationProp<TabParamList, "Home">;

const Home = () => {
  const navigation = useNavigation<NavigationProp>();
  const { companyId, productId } = useLocalSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const userStr = await AsyncStorage.getItem("user");
      if (userStr) {
        setUser(JSON.parse(userStr));
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Login" }],
          })
        );
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.HomeContainer}>
        <Text style={{ fontSize: 18, margin: 20 }}>Cargando usuario...</Text>
      </SafeAreaView>
    );
  }

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
        <View style={{ flexDirection: "row", alignItems: "center" }}>
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
        <MapComponent
          user={user}
          companyId={companyId as string}
          productId={productId as string}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
