import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login } from "./screens/Login";
import BottomTabNavigator from "./components/BottomTabNavigator";
import ReserveProduct from "./screens/ReserveProduct";
import Register from "./screens/Register";

const Stack = createNativeStackNavigator();

export default function Index() {
  return (
    // Remove the NavigationContainer, Expo Router provides one already
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Home" component={BottomTabNavigator} />
      <Stack.Screen name="ReserveProduct" component={ReserveProduct} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}
