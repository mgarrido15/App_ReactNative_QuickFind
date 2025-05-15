import React, { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { styles } from "../styles";

export interface MenuHandle {
  toggleMenu: () => void;
}

interface HamburgerMenuProps {
  onHomePress?: () => void;
  onFavoritesPress?: () => void;
  onSettingsPress?: () => void;
  onAboutPress?: () => void;
}

// Usamos forwardRef para poder exponer métodos a los componentes padres
const HamburgerMenu = forwardRef<MenuHandle, HamburgerMenuProps>(({
  onHomePress,
  onFavoritesPress,
  onSettingsPress,
  onAboutPress,
}, ref) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnimation] = useState(new Animated.Value(-250));

  // Toggle del menú hamburguesa
  const toggleMenu = () => {
    const toValue = menuVisible ? -250 : 0;
    
    Animated.timing(menuAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false
    }).start();
    
    setMenuVisible(!menuVisible);
  };
  
  // Exponemos la función toggleMenu para que pueda ser llamada desde fuera
  useImperativeHandle(ref, () => ({
    toggleMenu
  }));

  return (
    <View style={localStyles.menuContainer}>
      {/* Menú desplegable */}
      <Animated.View style={[styles.menuDrawer, { left: menuAnimation, zIndex: 999 }]}>
        <View style={styles.menuHeader}>
          <Text style={styles.menuHeaderText}>Menu</Text>
          <TouchableOpacity style={styles.menuCloseButton} onPress={toggleMenu}>
            <Text style={styles.menuCloseButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.menuContent}>
          <TouchableOpacity style={styles.menuItem} onPress={() => {
            onHomePress?.();
            toggleMenu();
          }}>
            <Text style={styles.menuItemText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => {
            onFavoritesPress?.();
            toggleMenu();
          }}>
            <Text style={styles.menuItemText}>Favorites</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => {
            onSettingsPress?.();
            toggleMenu();
          }}>
            <Text style={styles.menuItemText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => {
            onAboutPress?.();
            toggleMenu();
          }}>
            <Text style={styles.menuItemText}>About</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      
      {/* Overlay para cerrar el menú al tocar fuera */}
      {menuVisible && (
        <TouchableOpacity 
          style={[styles.menuOverlay, { zIndex: 998 }]}
          activeOpacity={1}
          onPress={toggleMenu}
        />
      )}
    </View>
  );
});

// Estilos locales adicionales
const localStyles = StyleSheet.create({
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 900,
    pointerEvents: 'box-none'
  }
});

export default HamburgerMenu;