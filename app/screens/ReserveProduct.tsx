import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Company } from "../../models/Company";
import { User } from "../../models/User";
import { createOrder } from "../../service/OrdersService";
import { styles } from "../styles";

const ReserveProduct = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { company, user } = route.params as { company: Company; user: User };

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
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 40,
          left: 20,
          zIndex: 10,
          backgroundColor: "#eee",
          borderRadius: 20,
          padding: 8,
        }}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{"<"}</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { textAlign: "center", marginVertical: 20 }]}>
        Reservar productos en {company.name}
      </Text>
      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
        {company.products && company.products.length > 0 ? (
          company.products.map((product) => (
            <View
              key={product._id}
              style={[
                styles.productCard,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                },
              ]}
            >
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => handleQuantityChange(product._id, 1)}
                activeOpacity={0.7}
              >
                <Text style={styles.productCardText}>
                  <Text style={{ fontWeight: "bold" }}>Nombre: </Text>
                  {product.name}
                </Text>
                <Text style={styles.productCardText}>
                  <Text style={{ fontWeight: "bold" }}>Precio: </Text>
                  {product.price ? `${product.price}€` : "No Price"}
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
                disabled={(selectedProducts[product._id] || 0) === 0}
              >
                <Text
                  style={{
                    fontSize: 20,
                    color: (selectedProducts[product._id] || 0) === 0 ? "#ccc" : "#333",
                  }}
                >
                  -
                </Text>
              </TouchableOpacity>
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