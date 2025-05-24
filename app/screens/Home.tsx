import { View, Text, TouchableOpacity, SafeAreaView, Image } from "react-native";
import React, { useRef } from "react"; // Añade useRef
import { styles } from "../styles";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/screenType";
import { User } from "../models/User";
import { useRoute } from "@react-navigation/native";
import MapComponent from "../components/Map";
import HamburgerMenu, { MenuHandle } from "../components/Menu"; // Importa el tipo MenuHandle
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList } from "../navigation/screenType";

type NavigationProp = BottomTabNavigationProp<TabParamList, "Home">;

export const Home = () => {
  const route = useRoute();
  const { user } = route.params as { user: User };
  const navigation = useNavigation<NavigationProp>();

  // Creamos una referencia al componente del menú
  const menuRef = useRef<MenuHandle>(null);

  // Manejadores para las opciones del menú
  const handleHomePress = () => {
    console.log("Home pressed");
  };

  const handleProfilePress = () => {
    navigation.navigate("Profile", { user });
  };

  const handleFavoritesPress = () => {
    console.log("Favorites pressed");
  };

  const handleSettingsPress = () => {
    console.log("Settings pressed");
  };

  const handleAboutPress = () => {
    console.log("About pressed");
  };

  return (
    <SafeAreaView style={styles.HomeContainer}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Hamburger menu button */}
          <TouchableOpacity
            style={styles.hamburgerButtonHeader}
            onPress={() => menuRef.current?.toggleMenu()} // Llamamos a toggleMenu usando la ref
          >
            <View style={styles.hamburgerLine}></View>
            <View style={styles.hamburgerLine}></View>
            <View style={styles.hamburgerLine}></View>
          </TouchableOpacity>
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

      {/* Pasamos la ref al componente HamburgerMenu */}
      <HamburgerMenu
        ref={menuRef}
        onHomePress={handleHomePress}
        onFavoritesPress={handleFavoritesPress}
        onSettingsPress={handleSettingsPress}
        onAboutPress={handleAboutPress}
      />
    </SafeAreaView>
  );
};