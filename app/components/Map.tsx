import React, { useEffect, useState } from "react";
import { Platform, View, Text, TouchableOpacity, TextInput, Image, ScrollView, Modal, Alert } from "react-native";
import { getAllCompanies } from "../../service/CompanyService";
import { Company } from "../../models/Company";
import { styles } from "../styles";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { User } from "../../models/User";
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../../navigation/screenType';
import { Linking } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { BASE_URL } from "../constants/host";

const { default: MapView, Marker } = require("react-native-maps");
interface MapComponentProps {
  user?: User;
  companyId?: string;
  productId?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ user, companyId, productId }) => {

  const [markers, setMarkers] = useState<any[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [highlightProductId, setHighlightProductId] = useState<string | null>(null);
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();


  const handleSearch = (query: string) => {
    if (query) {
      const filteredByProducts = companies.filter((company) =>
        company.products.some((product: any) =>
          product.name.toLowerCase().includes(query.toLowerCase())
        )
      );
      const newMarkers = filteredByProducts.map((company) => ({
        lat: company.coordenates_lat,
        lng: company.coordenates_lng,
        info: company.description,
        shop: company.name,
        phone: company.phone,
        icon: company.icon,
        score: company.rating,
      }));
      setMarkers(newMarkers);
    } else {
      loadCompanies();
    }
  };

  const loadCompanies = async () => {
    const newCompanies: Company[] = await getAllCompanies();
    setCompanies(newCompanies);
    const newMarkers = newCompanies.map((company) => ({
      lat: company.coordenates_lat,
      lng: company.coordenates_lng,
      info: company.description,
      shop: company.name,
      phone: company.phone,
      icon: company.icon,
      score: company.rating,
    }));
    setMarkers(newMarkers);
  };

  useEffect(() => {
  if (companyId && productId && companies.length > 0) {
    const matchedCompany = companies.find((c) => c._id === companyId);
    if (matchedCompany) {
      setSelectedCompany(matchedCompany);
      setSidebarVisible(true);
      setHighlightProductId(productId);
    }
  }
}, [companies]);

useEffect(() => {
  const initialize = async () => {
    await loadCompanies();

    const url = await Linking.getInitialURL();
    if (url && url.includes("companyId") && url.includes("productId")) {
      const params = new URLSearchParams(url.split("?")[1]);
      const sharedCompanyId = params.get("companyId");
      const sharedProductId = params.get("productId");

      if (sharedCompanyId && sharedProductId) {
        const matchedCompany = companies.find(c => c._id === sharedCompanyId);
        if (matchedCompany) {
          setSelectedCompany(matchedCompany);
          setSidebarVisible(true);
          setHighlightProductId(sharedProductId);
        }
      }
    }
  };

  initialize();
}, [companies]);


  const handleMarkerPress = (marker: any) => {
    const company = companies.find(
      (c) => c.coordenates_lat === marker.lat && c.coordenates_lng === marker.lng
    );
    if (company) {
      setSelectedCompany(company);
      setSidebarVisible(true);
    }
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
    setSelectedCompany(null);
  };

  return (
    <View style={styles.mapWrapper}>
      {/* 搜索栏 */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a product..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() => handleSearch(searchQuery)}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => handleSearch(searchQuery)}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* 侧边栏 */}
      <Modal visible={sidebarVisible} animationType="slide" transparent onRequestClose={closeSidebar}>
        <View style={[styles.sidebar, styles.sidebarOpen]}>
          <ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={closeSidebar}>
              <Text style={{ color: "#fff" }}>Close</Text>
            </TouchableOpacity>
            {selectedCompany && (
              <>
                <Text style={{ ...styles.productCardText, fontWeight: "bold", fontSize: 20, marginBottom: 10 }}>
                  {selectedCompany.name || "No Name Available"}
                </Text>
                {selectedCompany.icon && (
                  <View style={styles.iconContainer}>
                    <Image
                      source={{ uri: selectedCompany.icon }}
                      style={styles.iconImage}
                      resizeMode="contain"
                    />
                  </View>
                )}
                <Text style={styles.productCardText}>
                  <Text style={{ fontWeight: "bold" }}>Description: </Text>
                  {selectedCompany.description || "No Description"}
                </Text>
                <Text style={styles.productCardText}>
                  <Text style={{ fontWeight: "bold" }}>Phone: </Text>
                  {selectedCompany.phone || "No Phone"}
                </Text>
                <Text style={styles.productCardText}>
                  <Text style={{ fontWeight: "bold" }}>Rating: </Text>
                  {selectedCompany.rating ? `${selectedCompany.rating} ⭐` : "No Rating"}
                </Text>

                <TouchableOpacity
                  style={[styles.buttonPerfil, { marginVertical: 16 }]}
                  onPress={() => {
                    closeSidebar();
                    if (!user) return;
                    navigation.navigate("ReserveProduct", { company: selectedCompany, user });
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>
                    Reservar productos
                  </Text>
                </TouchableOpacity>

                {selectedCompany.products?.length > 0 ? (
                  <>
                    <Text style={{ fontWeight: "bold", marginTop: 10, marginBottom: 5 }}>Products:</Text>
                    <ScrollView style={styles.productsScrollContainer} nestedScrollEnabled>
                      {selectedCompany.products.map((product, index) => {
                        const productUrl = `${BASE_URL}/share?companyId=${selectedCompany._id}&productId=${product._id}`;
                        const handleWhatsAppShare = () => {
                          const message = `Check out this product: ${product.name}\n${productUrl}`;
                          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
                          Linking.openURL(whatsappUrl);
                        };
                        const handleCopyLink = () => {
                          Clipboard.setStringAsync(productUrl);
                          Alert.alert("Link Copied", "The product link has been copied.");
                        };

                        return (
                          <View
                            key={index}
                            style={[
                              styles.productCard,
                              product._id === highlightProductId && { borderColor: 'red', borderWidth: 2 },
                            ]}
                          >
                            <Text style={styles.productCardText}><Text style={{ fontWeight: "bold" }}>Name: </Text>{product.name}</Text>
                            <Text style={styles.productCardText}><Text style={{ fontWeight: "bold" }}>Rating: </Text>{product.rating || "No Rating"}</Text>
                            <Text style={styles.productCardText}><Text style={{ fontWeight: "bold" }}>Description: </Text>{product.description}</Text>
                            <Text style={styles.productCardText}><Text style={{ fontWeight: "bold" }}>Price: </Text>{product.price ? `${product.price}€` : "No Price"}</Text>

                            <TouchableOpacity style={styles.buttonPerfil} onPress={handleWhatsAppShare}>
                              <Text style={{ color: "#fff", textAlign: "center" }}>Share via WhatsApp</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.buttonPerfil, { backgroundColor: "#aaa" }]} onPress={handleCopyLink}>
                              <Text style={{ color: "#fff", textAlign: "center" }}>Copy link to share</Text>
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                    </ScrollView>
                  </>
                ) : (
                  <Text style={styles.productCardText}>No Products Available</Text>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* 地图区域 */}
      <MapView
        style={styles.mapContainer}
        initialRegion={{
          latitude: 41.3784,
          longitude: 2.1926,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: marker.lat, longitude: marker.lng }}
            onPress={() => handleMarkerPress(marker)}
          />
        ))}
      </MapView>
    </View>
  );
};

export default MapComponent;
