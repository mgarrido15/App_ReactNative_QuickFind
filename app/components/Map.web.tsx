import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, Image, ScrollView, Modal, ActivityIndicator } from "react-native";
import { getAllCompanies } from "../../service/CompanyService";
import { Company } from "../../models/Company";
import { styles } from "../styles";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { BASE_URL } from "../constants/host";


const MAP_CENTER = { lat: 41.3784, lng: 2.1926 };

const MapComponent: React.FC = () => {
  const [markers, setMarkers] = useState<any[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const hasHandledShareLink = useRef(false);
  const [highlightProductId, setHighlightProductId] = useState<string | null>(null);
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

useEffect(() => {
  if (hasHandledShareLink.current) return;

  const params = new URLSearchParams(window.location.search);
  const sharedCompanyId = params.get("companyId");
  const sharedProductId = params.get("productId");

  if (sharedCompanyId && sharedProductId && companies.length > 0) {
    const matchedCompany = companies.find((c) => c._id === sharedCompanyId);
    if (matchedCompany) {
      setSelectedCompany(matchedCompany);
      setSidebarVisible(true);
      setHighlightProductId(sharedProductId);

      // ✅ 高亮时自动平移到目标
      if (mapRef.current) {
        mapRef.current.panTo({
          lat: matchedCompany.coordenates_lat,
          lng: matchedCompany.coordenates_lng,
        });
      }

      hasHandledShareLink.current = true;
    }
  }
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
                      {selectedCompany.products.map((product, index) => {
                       const productUrl =
                        typeof window !== "undefined"
                        ? `${window.location.origin}/share?companyId=${selectedCompany._id}&productId=${product._id}`
                        : `http://192.168.1.146:19006/share?companyId=${selectedCompany._id}&productId=${product._id}`; // mobile fallback

                      const handleWhatsAppShare = () => {
                      const message = `Check out this product: ${product.name}\n${productUrl}`;
                      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
                      window.open(whatsappUrl, "_blank");
                  };

                    const handleCopyLink = () => {
                    navigator.clipboard.writeText(productUrl);
                    alert("Link copied to clipboard");
                   };

                return (
                  <View
                      key={index}
                      style={[
                        styles.productCard,
                        product._id === highlightProductId && { borderColor: "red", borderWidth: 2 },
                      ]}
                    >
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