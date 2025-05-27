import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Modal, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { getOrdersByUserId, updateOrderByID } from "../service/OrdersService";
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

  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editProducts, setEditProducts] = useState<{ [productId: string]: number }>({});

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

  const handlePay = async () => {
    if (!selectedOrder || !selectedOrder._id) return;
    try {
      await updateOrderByID(selectedOrder._id, { ...selectedOrder, status: "Finalizado" });
      setOrders((prev) =>
        prev.filter((order) => order._id !== selectedOrder._id)
      );
      setModalVisible(false);
      Alert.alert("Pago", "El pedido ha sido marcado como Finalizado.");
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el pedido.");
    }
  };

  const handleCancel = async () => {
    if (!selectedOrder || !selectedOrder._id) return;
    try {
      await updateOrderByID(selectedOrder._id, { ...selectedOrder, status: "Cancelado" });
      setOrders((prev) =>
        prev.filter((order) => order._id !== selectedOrder._id)
      );
      setModalVisible(false);
      Alert.alert("Cancelar", "El pedido ha sido cancelado.");
    } catch (error) {
      Alert.alert("Error", "No se pudo cancelar el pedido.");
    }
  };

  const handleModify = () => {
    if (!selectedOrder) return;
    const initialProducts: { [productId: string]: number } = {};
    selectedOrder.products.forEach((prod) => {
      initialProducts[prod.product_id._id] = prod.quantity;
    });
    setEditProducts(initialProducts);
    setIsEditing(true);
    setModalVisible(false);
  };

  const handleSaveEdit = async () => {
    if (!selectedOrder || !selectedOrder._id) return;
    const company = companies.find(c => c._id === selectedOrder.company_id);
    if (!company) return;

    const newProducts = Object.entries(editProducts)
      .filter(([_, qty]) => qty > 0)
      .map(([productId, quantity]) => {
        const productObj = company.products.find(p => p._id === productId);
        if (!productObj) return null;
        return {
          product_id: {
            _id: productObj._id,
            name: productObj.name,
            description: productObj.description,
            price: productObj.price,
            image: productObj.image ?? "",
            category: productObj.category ?? "",
            stock: productObj.stock ?? 0,
          },
          quantity,
        };
      })
  .filter((item): item is { product_id: any; quantity: number } => item !== null);

    try {
      await updateOrderByID(selectedOrder._id, {
        ...selectedOrder,
        products: newProducts,
      });

      setOrders(prev =>
        prev.map(order =>
          order._id === selectedOrder._id
            ? { ...order, products: newProducts }
            : order
        )
      );
      setIsEditing(false);
      Alert.alert("Pedido modificado", "El pedido ha sido actualizado.");
    } catch (error) {
      Alert.alert("Error", "No se pudo modificar el pedido.");
    }
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
          {orders.map((order) => {
            const total = order.products.reduce(
              (sum, prod) => sum + (prod.product_id.price * prod.quantity),
              0
            );
            return (
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
                <Text style={{ fontWeight: "bold", marginTop: 8 }}>
                  Total: {total.toFixed(2)} €
                </Text>
              </TouchableOpacity>
            );
          })}
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

      {isEditing && selectedOrder && (
        <View style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.3)",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 100,
        }}>
          <View style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            padding: 24,
            width: "90%",
            maxHeight: "80%",
          }}>
            <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 16 }}>
              Modificar pedido
            </Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {companies.find(c => c._id === selectedOrder.company_id)?.products.map((product) => (
                <View key={product._id} style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                  <Text style={{ flex: 1 }}>{product.name} ({product.price}€)</Text>
                  <TouchableOpacity
                    style={{ padding: 5, backgroundColor: "#eee", borderRadius: 5, marginRight: 5 }}
                    onPress={() => setEditProducts(prev => ({
                      ...prev,
                      [product._id]: Math.max((prev[product._id] || 0) - 1, 0)
                    }))}
                    disabled={!editProducts[product._id]}
                  >
                    <Text>-</Text>
                  </TouchableOpacity>
                  <Text style={{ minWidth: 20, textAlign: "center" }}>
                    {editProducts[product._id] || 0}
                  </Text>
                  <TouchableOpacity
                    style={{ padding: 5, backgroundColor: "#eee", borderRadius: 5, marginLeft: 5 }}
                    onPress={() => setEditProducts(prev => ({
                      ...prev,
                      [product._id]: (prev[product._id] || 0) + 1
                    }))}
                  >
                    <Text>+</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
              <TouchableOpacity
                style={{ backgroundColor: "#3498db", borderRadius: 8, padding: 12, flex: 1, marginRight: 10, alignItems: "center" }}
                onPress={handleSaveEdit}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: "#e74c3c", borderRadius: 8, padding: 12, flex: 1, marginLeft: 10, alignItems: "center" }}
                onPress={() => setIsEditing(false)}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default Cart;