import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, Image, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { User } from "../models/User";
import { styles } from "../styles";
import { getOrdersByUserId } from "../service/OrdersService";
import { getFollowedCompanies, UpdateUserById } from "../service/UserService";
import { IOrder } from "../models/Order";

export const Profile = () => {
  const route = useRoute();
  const navigation = useNavigation();
  // Permite que initialUser sea opcional para evitar errores si no llega
  const { user: initialUser } = route.params as { user?: User };

  // Si no hay usuario, muestra un mensaje y no sigas renderizando
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

  const handleSave = async () => {
    try {
      // Envía el usuario entero, pero asegúrate de que todos los campos requeridos existen
      const updatedUser: User = {
        ...user,
        name: editedUser.name,
        email: editedUser.email,
        phone: editedUser.phone,
        description: editedUser.description,
      };
      console.log("Updated User:", updatedUser);
      const response = await UpdateUserById(updatedUser);
      console.log ("Response from server:", response);
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
            source={{ uri: user.avatar || "https://via.placeholder.com/120" }}
            style={styles.avatar}
          />
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