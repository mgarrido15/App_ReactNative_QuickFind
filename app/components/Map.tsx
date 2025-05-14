import React, { useEffect, useState } from "react";
import { Platform, View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from "react-native";
import { getAllCompanies } from "../service/CompanyService";
import { Company } from "../models/Company";

let MapComponent: React.FC;

if (Platform.OS === "web") {
  // Usar react-leaflet para la web
  const { MapContainer, TileLayer, Marker, Popup } = require("react-leaflet");
  require("leaflet/dist/leaflet.css");

  MapComponent = () => {
    const [markers, setMarkers] = useState<any[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

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

    return (
      <View style={styles.container}>
        {/* Barra de búsqueda */}
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

        {/* Mapa para la web */}
        <MapContainer
          style={{ height: "100%", width: "100%" }}
          center={[41.3784, 2.1926]}
          zoom={13}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {markers.map((marker, index) => (
            <Marker key={index} position={[marker.lat, marker.lng]}>
              <Popup>
                <Text>{marker.shop}</Text>
                <Text>{marker.info}</Text>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </View>
    );
  };
} else {
  const { default: MapView, Marker } = require("react-native-maps");

  MapComponent = () => {
    const [markers, setMarkers] = useState<any[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

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

    return (
      <View style={styles.container}>
        {/* Barra de búsqueda */}
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

        {/* Mapa para móviles */}
        <MapView
          style={styles.map}
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
              coordinate={{
                latitude: marker.lat,
                longitude: marker.lng,
              }}
            />
          ))}
        </MapView>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchBar: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default MapComponent;