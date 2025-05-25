import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Company } from "../models/Company";
import { User } from "../models/User";
import { createOrder } from "../service/OrdersService";
import { styles } from "../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ReserveProduct = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { company, user } = route.params as { company: Company; user: User };

  // Estado para cantidades seleccionadas
  const [selectedProducts, setSelectedProducts] = useState<{ [productId: string]: number }>({});

  const handleQuantityChange = (productId: string, delta: number) => {
    setSelectedProducts((prev) => {
      const newQty = Math.max((prev[productId] || 0) + delta, 0);
      return { ...prev, [productId]: newQty };
    });
  };

  const handleReserve = async () => {
    const productsToOrder = Object.entries(selectedProducts)
      .filter(([_, qty]) => qty > 0)
      .map(([productId, quantity]) => {
        const productObj = company.products.find((p) => p._id === productId);
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
      <Text style={[styles.title, { textAlign: "center", marginVertical: 20 }]}>
        Reservar productos en {company.name}
      </Text>
      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
        {company.products && company.products.length > 0 ? (
          company.products.map((product) => (
            <View key={product._id} style={styles.productCard}>
              <Text style={styles.productCardText}>
                <Text style={{ fontWeight: "bold" }}>Nombre: </Text>
                {product.name}
              </Text>
              <Text style={styles.productCardText}>
                <Text style={{ fontWeight: "bold" }}>Precio: </Text>
                {product.price ? `${product.price}€` : "No Price"}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}>
                <TouchableOpacity
                  style={{ padding: 5, backgroundColor: "#eee", borderRadius: 5, marginRight: 5 }}
                  onPress={() => handleQuantityChange(product._id, -1)}
                >
                  <Text>-</Text>
                </TouchableOpacity>
                <Text style={{ minWidth: 20, textAlign: "center" }}>
                  {selectedProducts[product._id] || 0}
                </Text>
                <TouchableOpacity
                  style={{ padding: 5, backgroundColor: "#eee", borderRadius: 5, marginLeft: 5 }}
                  onPress={() => handleQuantityChange(product._id, 1)}
                >
                  <Text>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.productCardText}>No hay productos disponibles</Text>
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