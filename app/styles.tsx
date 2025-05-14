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
        alignItems: "center",          padding: 20,
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

});