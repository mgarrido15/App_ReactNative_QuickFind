import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Company } from "../models/Company";
import { User } from "../models/User";
import { createOrder } from "../service/OrdersService";
import { styles } from "../styles";
import { Ionicons } from '@expo/vector-icons';

const ReserveProduct = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { company, user } = route.params as { company: Company; user: User };

  const [selectedProducts, setSelectedProducts] = useState<{ [productId: string]: number }>({});
  const [localProducts, setLocalProducts] = useState(company.products.map(p => ({ ...p })));

  const handleQuantityChange = (productId: string, delta: number) => {
    setLocalProducts((prev) =>
      prev.map((p) => {
        if (p._id !== productId) return p;
        if (delta > 0 && (p.stock ?? 0) > 0) {
          return { ...p, stock: (p.stock ?? 0) - 1 };
        }
        if (delta < 0 && (selectedProducts[productId] || 0) > 0) {
          return { ...p, stock: (p.stock ?? 0) + 1 };
        }
        return p;
      })
    );
    setSelectedProducts((prev) => {
      const currentQty = prev[productId] || 0;
      let newQty = currentQty + delta;
      if (delta > 0 && (localProducts.find(p => p._id === productId)?.stock ?? 0) <= 0) {
        newQty = currentQty; 
      }
      newQty = Math.max(newQty, 0);
      return { ...prev, [productId]: newQty };
    });
  };

  const handleReserve = async () => {
    const productsToOrder = Object.entries(selectedProducts)
      .filter(([_, qty]) => qty > 0)
      .map(([productId, quantity]) => {
        const productObj = localProducts.find((p) => p._id === productId);
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

    if (productsToOrder.length === 0) {
      Alert.alert("Selecciona al menos un producto para reservar.");
      return;
    }

    try {
      await createOrder({
        user_id: user._id,
        orderDate: new Date(),
        status: "Pendiente",
        company_id: company._id,
        products: productsToOrder,
      });
      Alert.alert("¡Reserva realizada!", "Tu pedido ha sido guardado.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "No se pudo realizar la reserva.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <TouchableOpacity
         style={{
            position: 'absolute',
            top: 30,
            left: 10,
            zIndex: 10,
            backgroundColor: '#e0e6ed',
            borderRadius: 20,
            padding: 8,
          }} 
          onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#222" />
      </TouchableOpacity>

      <Text style={[styles.title, { textAlign: "center", marginVertical: 20 }]}>
        {company.name}
      </Text>
      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
        {localProducts && localProducts.length > 0 ? (
          localProducts.map((product) => {
            const noStock = (product.stock ?? 0) <= 0;
            return (
              <View
                key={product._id}
                style={[
                  styles.productCard,
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    opacity: noStock ? 0.5 : 1,
                  },
                ]}
              >
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => {
                    if (!noStock) handleQuantityChange(product._id, 1);
                  }}
                  activeOpacity={noStock ? 1 : 0.7}
                  disabled={noStock}
                >
                  <Text style={styles.productCardText}>
                    <Text style={{ fontWeight: "bold" }}>Nombre: </Text>
                    {product.name}
                    {noStock ? " (No disponible)" : ""}
                  </Text>
                  <Text style={styles.productCardText}>
                    <Text style={{ fontWeight: "bold" }}>Precio: </Text>
                    {product.price ? `${product.price}€` : "No Price"}
                  </Text>
                  <Text style={styles.productCardText}>
                    <Text style={{ fontWeight: "bold" }}>Stock: </Text>
                    {product.stock ?? 0}
                  </Text>
                  <Text style={{ marginTop: 5, fontWeight: "bold", fontSize: 16 }}>
                    Cantidad: {selectedProducts[product._id] || 0}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    marginLeft: 10,
                    backgroundColor: "#eee",
                    borderRadius: 20,
                    width: 32,
                    height: 32,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => handleQuantityChange(product._id, -1)}
                  disabled={noStock || (selectedProducts[product._id] || 0) === 0}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      color:
                        noStock || (selectedProducts[product._id] || 0) === 0
                          ? "#ccc"
                          : "#333",
                    }}
                  >
                    -
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })
        ) : (
          <Text style={styles.productCardText}>No disponibles</Text>
        )}
      </ScrollView>
      <TouchableOpacity
        style={[
          styles.reserveButton,
          Object.values(selectedProducts).some((qty) => qty > 0) ? null : styles.reserveButtonDisabled,
          { margin: 20 },
        ]}
        onPress={handleReserve}
        disabled={!Object.values(selectedProducts).some((qty) => qty > 0)}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>
          Reservar
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReserveProduct;