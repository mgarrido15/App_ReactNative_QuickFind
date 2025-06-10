import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, Image, TextInput, TouchableOpacity, ScrollView, Alert, Modal, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { User } from "../models/User";
import { styles } from "../styles";
import { getOrdersByUserId } from "../service/OrdersService";
import { getFollowedCompanies, UpdateUserById } from "../service/UserService";
import { IOrder } from "../models/Order";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useRef } from 'react';
import { UpdateProfilePicture } from "../service/UserService";


export const Profile = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user: initialUser } = route.params as { user?: User };
  const [modalVisible, setModalVisible] = useState(false);



  if (!initialUser) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={{ color: "red", textAlign: "center", marginTop: 40 }}>
          No se encontró el usuario.
        </Text>
      </SafeAreaView>
    );
  }

  const [user, setUser] = useState(initialUser);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [companyFollowed, setCompanyFollowed] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"orders" | "followers" | "following">("orders");
  const [editedUser, setEditedUser] = useState({
    email: user.email || '',
    name: user.name || '',
    phone: user.phone || '',
    description: user.description || '',
    avatar: user.avatar || '',
  });

  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [following, setFollowing] = useState<any[]>([]);
  const [loadingFollowing, setLoadingFollowing] = useState(false);

  const followers = [{ id: 1, name: "Empresa A" }];

  

  useEffect(() => {
    setEditedUser({
      email: user.email || '',
      name: user.name || '',
      phone: user.phone || '',
      description: user.description || '',
      avatar: user.avatar || '',
    });

    const fetchOrders = async () => {
      if (user._id) {
        try {
          const orders = await getOrdersByUserId(user._id);
          setRecentOrders(orders || []);
        } catch (error) {
          console.error('Error al cargar las órdenes recientes:', error);
        } finally {
          setIsLoadingOrders(false);
        }
      }
    };

    const fetchSiguiendo = async () => {
      if (user._id) {
        try {
          const companies = await getFollowedCompanies(user._id);
          setCompanyFollowed(companies || []);
        } catch (error) {
          console.error('Error al cargar las empresas seguidas:', error);
        }
      }
    };

    fetchOrders();
    fetchSiguiendo();
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user._id) return;
      setLoadingOrders(true);
      try {
        const fetchedOrders = await getOrdersByUserId(user._id);
        setOrders(fetchedOrders);
      } catch (error) {
        setOrders([]);
      }
      setLoadingOrders(false);
    };
    if (selectedTab === "orders") {
      fetchOrders();
    }
  }, [user._id, selectedTab]);

  useEffect(() => {
    const fetchFollowing = async () => {
      if (!user._id) return;
      setLoadingFollowing(true);
      try {
        const companies = await getFollowedCompanies(user._id);
        setFollowing(companies);
      } catch (error) {
        setFollowing([]);
      }
      setLoadingFollowing(false);
    };
    if (selectedTab === "following") {
      fetchFollowing();
    }
  }, [user._id, selectedTab]);

  // --- Cloudinary image upload logic ---
  const handleImageUpload = async (uri: string) => {
    const data = new FormData();
    data.append('file', { uri, type: 'image/jpeg', name: 'upload.jpg' } as any);
    data.append("upload_preset", "quickfind");
    data.append("cloud_name", "dnt2h1b9z");

    const userEmail = editedUser.email || user.email;

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/dnt2h1b9z/image/upload", {
        method: 'POST',
        body: data,
      });
      const fileData = await response.json();

      //aqui se llama al endpoint para atcar al backend y que se guarde la URL
      await UpdateProfilePicture (userEmail, fileData.secure_url);
      console.log("la url que se guarda en la bbdd", fileData.secure_url);

      setEditedUser({ ...editedUser, avatar: fileData.url });
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error al subir la imagen");
    }
  };

  const openCamera2 = async () => {
  setModalVisible(true);
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permiso requerido', 'Debes conceder permiso a la cámara.');
    return;
  }
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
  });
  console.log("esto es lo que proporciona result        ", result)
  Alert.alert('ha pasado el imagepicker', '');
  console.log(result);
  if (!result.canceled && result.assets && result.assets.length > 0) {
    handleImageUpload(result.assets[0].uri);
  }
};

  const openGallery = async () => {
  setModalVisible(true);
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permiso requerido', 'Debes conceder permiso a la galería.');
    return;
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
  });
    console.log("esto es lo que proporciona result        ", result)

  if (!result.canceled && result.assets && result.assets.length > 0) {
    handleImageUpload(result.assets[0].uri);
  }
};
  // --- Fin Cloudinary ---

  const handleSave = async () => {
    try {
      const updatedUser: User = {
        ...user,
        name: editedUser.name,
        email: editedUser.email,
        phone: editedUser.phone,
        description: editedUser.description,
        avatar: editedUser.avatar,
      };
      const response = await UpdateUserById(updatedUser);
      setUser(response.user);
      setIsEditing(false);
      Alert.alert("Perfil actualizado", "Tus datos han sido actualizados correctamente.");
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el perfil.");
    }
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case "orders":
        if (loadingOrders) {
          return <Text style={styles.emptyText}>Cargando órdenes...</Text>;
        }
        return orders.length ? (
          orders.map((order) => (
            <View key={order._id} style={{ marginBottom: 10 }}>
              <Text style={styles.orderItem}>ID: {order._id}</Text>
              <Text style={styles.orderItem}>Fecha: {new Date(order.orderDate).toLocaleDateString()}</Text>
              <Text style={styles.orderItem}>Estado: {order.status}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No hay órdenes recientes.</Text>
        );
      case "followers":
        return followers.length ? (
          followers.map((c) => (
            <Text key={c.id} style={styles.orderItem}>{c.name}</Text>
          ))
        ) : (
          <Text style={styles.emptyText}>No tienes seguidores.</Text>
        );
      case "following":
        if (loadingFollowing) {
          return <Text style={styles.emptyText}>Cargando empresas...</Text>;
        }
        return following.length ? (
          following.map((company: any) => (
            <View key={company._id || company.id} style={{ marginBottom: 10 }}>
              <Text style={styles.orderItem}>{company.name || company.nombre || "Empresa sin nombre"}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No sigues a ninguna empresa.</Text>
        );
      default:
        return null;
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.containerPerfil}>
        <View style={styles.profileBox}>
          <Image
            source={{ uri: isEditing ? (editedUser.avatar || user.avatar || "https://via.placeholder.com/120") : (user.avatar || "https://via.placeholder.com/120") }}
            style={styles.avatar}
          />
          {isEditing && (
            <>
              <TouchableOpacity style={styles.buttonPerfil} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonTextPerfil}>Cambiar Foto</Text>
              </TouchableOpacity>
              <Modal
                animationType="slide"
                transparent
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={modalStyles.modalView}>
                  <View style={modalStyles.buttonModalView}>
                    <TouchableOpacity style={styles.buttonPerfil} onPress={openCamera2}>
                      <Text style={styles.buttonTextPerfil}>Cámara</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonPerfil} onPress={openGallery}>
                      <Text style={styles.buttonTextPerfil}>Galería</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={styles.buttonPerfil} onPress={() => setModalVisible(false)}>
                    <Text style={styles.buttonTextPerfil}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </>
          )}
          <Text style={styles.idText}><Text style={styles.label}>ID:</Text> {user._id || "No disponible"}</Text>
          <View style={styles.divider} />
          {isEditing ? (
            <>
              <TextInput
                style={styles.input}
                value={editedUser.name}
                onChangeText={(text) => setEditedUser({ ...editedUser, name: text })}
                placeholder="Nombre"
              />
              <TextInput
                style={styles.input}
                value={editedUser.email}
                onChangeText={(text) => setEditedUser({ ...editedUser, email: text })}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                style={styles.input}
                value={editedUser.phone}
                onChangeText={(text) => setEditedUser({ ...editedUser, phone: text })}
                placeholder="Teléfono"
                keyboardType="phone-pad"
              />
              <TextInput
                style={[styles.input, styles.textarea]}
                value={editedUser.description}
                onChangeText={(text) => setEditedUser({ ...editedUser, description: text })}
                placeholder="Descripción"
                multiline
              />
            </>
          ) : (
            <>
              <Text style={styles.name}>{user.name || "Nombre no disponible"}</Text>
              <Text style={styles.infoText}><Text style={styles.label}>Email:</Text> {user.email}</Text>
              <Text style={styles.infoText}><Text style={styles.label}>Teléfono:</Text> {user.phone || "No disponible"}</Text>
              <View style={styles.divider} />
              <Text style={styles.infoText}><Text style={styles.label}>Billetera:</Text> ${user.wallet?.toFixed(2) ?? "No disponible"}</Text>
              <Text style={styles.infoText}><Text style={styles.label}>Descripción:</Text> {user.description || "No hay descripción"}</Text>
            </>
          )}
          <View style={styles.divider} />
          <Text
            style={[
              styles.status,
              { backgroundColor: user.Flag ? "#4c87af" : "#f44336" },
            ]}
          >
            <Text style={styles.label}>Estado:</Text> {user.Flag ? "Activo" : "Inactivo"}
          </Text>
          <View style={styles.buttonRow}>
            {isEditing ? (
              <>
                <TouchableOpacity style={styles.buttonPerfil} onPress={handleSave}>
                  <Text style={styles.buttonTextPerfil}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonPerfil} onPress={() => setIsEditing(false)}>
                  <Text style={styles.buttonTextPerfil}>Cancelar</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.buttonPerfil} onPress={() => setIsEditing(true)}>
                <Text style={styles.buttonTextPerfil}>Modificar Perfil</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.buttonPerfil} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonTextPerfil}>Volver Página Principal</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === "orders" && styles.tabActive]}
            onPress={() => setSelectedTab("orders")}
          >
            <Text style={selectedTab === "orders" ? styles.tabTextActive : styles.tabText}>Órdenes Recientes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === "followers" && styles.tabActive]}
            onPress={() => setSelectedTab("followers")}
          >
            <Text style={selectedTab === "followers" ? styles.tabTextActive : styles.tabText}>Seguidores</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, selectedTab === "following" && styles.tabActive]}
            onPress={() => setSelectedTab("following")}
          >
            <Text style={selectedTab === "following" ? styles.tabTextActive : styles.tabText}>Seguidos</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tabContent}>
          {renderTabContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Estilos para el modal de la imagen
const modalStyles = StyleSheet.create({
  buttonModalView: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-around',
    backgroundColor: 'white',
  },
  modalView: {
    position: 'absolute',
    bottom: 2,
    width: '100%',
    height: 120,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
});