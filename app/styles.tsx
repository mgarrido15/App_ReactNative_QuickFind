import React from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export const styles = StyleSheet.create({
  textStyle:
  {
    fontSize: 20,
    color: 'black',
    margin: 10,
  },
  inputStyle:
  {
    borderRadius: 20,
    backgroundColor: '#E0E8EF',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  inputContainer:
  {
    width: '80%',
    paddingLeft: 65,
    paddingRight: 35,
  },
  container: {
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingRight: 45,
    paddingLeft: 45,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007BFF',
    padding: 15,
    width: 120,
    height: 60,
    alignSelf: "center",
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  countContainer: {
    alignItems: 'center',
    padding: 10,
  },

  HomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center", padding: 20,
    backgroundColor: "#f5f5f5",
  },

  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },

  userEmail: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },

  userCard: {
    marginVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  container_Profile: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    borderColor: "#007BFF",
  },

  text_Profile: {
    fontSize: 16,
    marginBottom: 10,
  },
  title_Profile: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ADD8E6",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  imageStyle: {
    width: 100,
    height: 100,
  },

  login: {
    width: "90%",
    maxWidth: 400,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  header: {
    width: "100%",
    height: 60,
    backgroundColor: "#007BFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerTitle: {
    color: "#FFFFFF", // Blanco
    fontSize: 20,
    fontWeight: "bold",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },










  //Mapa

  mapWrapper: {
    position: "relative", // Asegura que la barra lateral se posicione dentro del contenedor
    width: "100%",
    height: "100%", // Asegúrate de que el mapa ocupe toda la pantalla
    display: "flex", // Para que el mapa y la barra lateral estén alineados
  },

  mapContainer: {
    flex: 1, // El mapa ocupa el espacio restante
    height: "100%", // Asegura que el mapa ocupe toda la altura del contenedor
    borderRadius: 15, // Bordes redondeados
    overflow: "hidden", // Evita que el contenido se desborde
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Sombra para destacar el mapa
  },

  searchBar: {
    flexDirection: "row",
    justifyContent: "center", // Centra los elementos dentro de la barra
    alignItems: "center",
    margin: 10, // Espaciado alrededor
    padding: 10, // Espaciado interno
    backgroundColor: "#fff", // Fondo blanco
    borderRadius: 5, // Bordes redondeados
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Sombra para Android
  },

  searchInput: {
    flex: 1, // Ocupa todo el espacio disponible dentro de la barra
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    fontSize: 16,
    marginRight: 10,
  },

  searchButton: {
    padding: 10,
    backgroundColor: "#61dafb",
    borderRadius: 5,
  },

  searchButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  sidebar: {
    position: "absolute", // Superpone la barra lateral dentro del mapa
    top: 0,
    left: -400, // Oculto inicialmente
    width: 400,
    height: "100%", // Ocupa toda la altura del mapa
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 15, // Bordes redondeados
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // Sombra para Android
    zIndex: 1000,
  },

  sidebarOpen: {
    left: 0, // Muestra la barra lateral
  },

  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#f44336",
    color: "#fff",
    borderRadius: 5,
    padding: 10,
  },

  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },

  iconImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    resizeMode: "contain",
  },

  productsContainer: {
    flexDirection: "column",
    gap: 10,
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
    marginTop: 10,
  },

  productCard: {
    backgroundColor: "#ffffff", // Fondo blanco para cada producto
    padding: 10, // Espaciado interno
    borderWidth: 1,
    borderColor: "#ddd", // Borde sutil
    borderRadius: 5, // Bordes redondeados
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2, // Sombra para Android
  },

  productCardText: {
    marginVertical: 5, // Espaciado entre líneas
    fontSize: 14, // Tamaño de fuente
    color: "#333", // Color del texto
  },

  reserveButton: {
    padding: 10,
    backgroundColor: "#2563eb",
    borderRadius: 5,
    color: "#fff",
    textAlign: "center",
  },

  reserveButtonDisabled: {
    backgroundColor: "#ccc",
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },

  productsScrollContainer: {
    maxHeight: 300, // Mayor altura para más productos visibles
    marginBottom: 20, // Espacio al final
  },



  // Estilos para el botón hamburguesa
  hamburgerButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    padding: 8,
  },

  hamburgerLine: {
    width: 24,
    height: 3,
    backgroundColor: '#333',
    marginVertical: 2,
    borderRadius: 5,
  },

  // Estilos para el menú desplegable
  menuDrawer: {
    position: 'absolute',
    top: 0,
    height: '100%',
    width: 250,
    backgroundColor: 'white',
    zIndex: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },

  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f8f8',
  },

  menuHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  menuCloseButton: {
    padding: 5,
  },

  menuCloseButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  menuContent: {
    padding: 15,
  },

  menuItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },

  menuItemText: {
    fontSize: 16,
  },

  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 15,
  },

  hamburgerButtonHeader: {
    padding: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },


  //Perfil

  safeArea: { flex: 1, backgroundColor: "#f5f5f5" },
  containerPerfil: { alignItems: "center", padding: 16 },
  profileBox: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#4c87af",
  },
  idText: { fontSize: 14, color: "#555", marginBottom: 5 },
  divider: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    marginVertical: 10,
  },
  name: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 8 },
  infoText: { fontSize: 16, color: "#555", marginVertical: 2 },
  label: { color: "#4c87af", fontWeight: "bold" },
  status: {
    fontSize: 16,
    color: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginTop: 8,
    alignSelf: "flex-start",
    fontWeight: "bold",
  },
  input: {
    width: "95%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    fontSize: 16,
    marginVertical: 6,
    backgroundColor: "#f9f9f9",
  },
  textarea: { height: 80, textAlignVertical: "top" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 12,
    marginBottom: 8,
    gap: 10,
  },
  buttonPerfil: {
    backgroundColor: "#4caf50",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
    marginVertical: 4,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 2,
  },
  buttonTextPerfil: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 1,
    paddingVertical: 6,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#4c87af",
  },
  tabText: { color: "#555", fontSize: 16 },
  tabTextActive: { color: "#4c87af", fontWeight: "bold", fontSize: 16 },
  tabContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 14,
    minHeight: 80,
    marginBottom: 30,
    elevation: 1,
  },
  orderItem: { fontSize: 15, color: "#333", paddingVertical: 4 },
  emptyText: { color: "#aaa", fontStyle: "italic", textAlign: "center" },

  // Estilos para el BottomTabNavigator
  tabBar: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderTopWidth: 0,
    elevation: 0,
    height: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  createButtonContainer: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  createButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3498db',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },

  // Estilos para el componente Companies
  companiesContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    paddingTop: 40,
  },
  companiesHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  companiesScrollView: {
    flex: 1,
  },
  companyCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  companyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  companyCardContent: {
    gap: 8,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  companyLabel: {
    width: 100,
    fontWeight: 'bold',
    color: '#555',
  },
  companyValue: {
    flex: 1,
    color: '#333',
  },
  companiesLoadingText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666',
  },
  companiesNoDataText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666',
  },
  companyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  companyRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  companyRating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f39c12',
  },
  companyRatingCount: {
    fontSize: 14,
    color: '#777',
    marginLeft: 8,
  },
  followButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followingButton: {
    backgroundColor: '#e0e0e0',
  },
  notFollowingButton: {
    backgroundColor: '#4c87af',
  },
  followButtonText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 14,
  },

});