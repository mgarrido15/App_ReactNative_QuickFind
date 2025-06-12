import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, Image, ScrollView, Modal, ActivityIndicator } from "react-native";
import { getAllCompanies } from "../../service/CompanyService";
import { Company } from "../../models/Company";
import { styles } from "../styles";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";


const MAP_CENTER = { lat: 41.3784, lng: 2.1926 };

const MapComponent: React.FC = () => {
  const [markers, setMarkers] = useState<any[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyA2mEcj-UQPusAktW_10Szq7hW0rbRya_8", // 替换为你的API密钥
  });

  // 明确类型，避免 onLoad 报错
  const mapRef = useRef<google.maps.Map | null>(null);

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
    loadCompanies();
  }, []);

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

  if (!isLoaded) {
    return (
      <View style={[styles.mapContainer, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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

      {/* 侧边栏 Modal */}
      <Modal
        visible={sidebarVisible}
        animationType="slide"
        transparent
        onRequestClose={closeSidebar}
      >
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
                  {selectedCompany.description || "No Description Available"}
                </Text>
                <Text style={styles.productCardText}>
                  <Text style={{ fontWeight: "bold" }}>Phone: </Text>
                  {selectedCompany.phone || "No Phone Available"}
                </Text>
                <Text style={styles.productCardText}>
                  <Text style={{ fontWeight: "bold" }}>Rating: </Text>
                  {selectedCompany.rating ? `${selectedCompany.rating} ⭐` : "No Rating Available"}
                </Text>
                {/* 产品列表 */}
                {selectedCompany.products && selectedCompany.products.length > 0 ? (
                  <>
                    <Text style={{ fontWeight: "bold", marginTop: 10, marginBottom: 5 }}>Products:</Text>
                    <ScrollView style={styles.productsScrollContainer} nestedScrollEnabled={true}>
                      {selectedCompany.products.map((product, index) => (
                        <View key={index} style={styles.productCard}>
                          <Text style={styles.productCardText}>
                            <Text style={{ fontWeight: "bold" }}>Name: </Text>
                            {product.name || "No Name"}
                          </Text>
                          <Text style={styles.productCardText}>
                            <Text style={{ fontWeight: "bold" }}>Rating: </Text>
                            {product.rating ? `${product.rating} ⭐` : "No Rating"}
                          </Text>
                          <Text style={styles.productCardText}>
                            <Text style={{ fontWeight: "bold" }}>Description: </Text>
                            {product.description || "No Description"}
                          </Text>
                          <Text style={styles.productCardText}>
                            <Text style={{ fontWeight: "bold" }}>Price: </Text>
                            {product.price ? `${product.price}€` : "No Price"}
                          </Text>
                        </View>
                      ))}
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

      {/* Google Map */}
      <View style={{ width: "100%", height: 400, borderRadius: 15, overflow: "hidden" }}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={MAP_CENTER}
          zoom={13}
          onLoad={(map) => { mapRef.current = map; }}
        >
          {markers.map((marker, idx) => (
            <Marker
              key={idx}
              position={{ lat: marker.lat, lng: marker.lng }}
              onClick={() => handleMarkerPress(marker)}
            />
          ))}
        </GoogleMap>
      </View>
    </View>
  );
};

export default MapComponent;