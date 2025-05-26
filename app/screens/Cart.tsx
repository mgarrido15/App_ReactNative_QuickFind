import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Modal, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { getOrdersByUserId } from "../service/OrdersService";
import { getAllCompanies } from "../service/CompanyService";
import { IOrder } from "../models/Order";
import { Company } from "../models/Company";
import { styles } from "../styles";

const Cart = () => {
  const route = useRoute();
  const { user } = route.params as { user: { _id: string } };
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado para el modal de opciones
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const allOrders = await getOrdersByUserId(user._id);
        const pendingOrders = allOrders.filter((order: IOrder) => order.status === "Pendiente");
        setOrders(pendingOrders);
      } catch (error) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user._id]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const allCompanies = await getAllCompanies();
        setCompanies(allCompanies);
      } catch {
        setCompanies([]);
      }
    };
    fetchCompanies();
  }, []);

  // Acciones de los botones
  const handlePay = () => {
    setModalVisible(false);
    Alert.alert("Pago", "Funcionalidad de pago no implementada.");
  };

  const handleModify = () => {
    setModalVisible(false);
    Alert.alert("Modificar", "Funcionalidad de modificar no implementada.");
  };

  const handleCancel = () => {
    setModalVisible(false);
    Alert.alert("Cancelar", "Funcionalidad de cancelar no implementada.");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", padding: 16 }}>
      <Text style={[styles.title, { textAlign: "center", marginVertical: 20 }]}>
        Tus pedidos pendientes
      </Text>
      {loading ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : orders.length === 0 ? (
        <Text style={{ textAlign: "center" }}>No tienes pedidos pendientes.</Text>
      ) : (
        <ScrollView>
          {orders.map((order) => (
            <TouchableOpacity
              key={order._id}
              style={[styles.productCard, { marginBottom: 16 }]}
              onPress={() => {
                setSelectedOrder(order);
                setModalVisible(true);
              }}
              activeOpacity={0.8}
            >
              <Text style={{ fontWeight: "bold" }}>
                Empresa: {companies.find(c => c._id === order.company_id)?.name || order.company_id}
              </Text>
              <Text>Fecha: {new Date(order.orderDate).toLocaleString()}</Text>
              <Text>Estado: {order.status}</Text>
              <Text style={{ fontWeight: "bold", marginTop: 8 }}>Productos:</Text>
              {order.products.map((prod, idx) => (
                <Text key={idx}>
                  {prod.product_id.name} x {prod.quantity}
                </Text>
              ))}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.3)",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <View style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 24,
            width: "80%",
            alignItems: "center"
          }}>
            <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 16 }}>
              ¿Qué deseas hacer con este pedido?
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#3498db",
                borderRadius: 8,
                paddingVertical: 12,
                marginBottom: 12,
                width: "100%",
                alignItems: "center",
                minHeight: 44,
                justifyContent: "center",
              }}
              onPress={handlePay}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Pagar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#3498db",
                borderRadius: 8,
                paddingVertical: 12,
                marginBottom: 12,
                width: "100%",
                alignItems: "center",
                minHeight: 44,
                justifyContent: "center",
              }}
              onPress={handleModify}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Modificar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#e74c3c",
                borderRadius: 8,
                paddingVertical: 12,
                width: "100%",
                alignItems: "center",
                minHeight: 44,
                justifyContent: "center",
              }}
              onPress={handleCancel}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginTop: 10 }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "#3498db" }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Cart;