import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from "@react-navigation/native";
import { TabParamList } from '../navigation/screenType';
import { styles } from '../styles'; // Importación de estilos centralizados

// Importar pantallas
import { Home } from '../screens/Home';
import { Profile } from '../screens/Profile';
import { Companies } from '../screens/Companies';

const Tab = createBottomTabNavigator<TabParamList>();

// Componente personalizado para el botón de crear
const CustomCreateButton = ({ onPress }: { onPress: () => void }) => {
    return (
        <TouchableOpacity
            style={styles.createButtonContainer}
            onPress={onPress}
        >
            <View style={styles.createButton}>
                <Ionicons name="add" size={26} color="white" />
            </View>
        </TouchableOpacity>
    );
};

const BottomTabNavigator = () => {
    const route = useRoute();
    const { user } = route.params as { user: any };

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: styles.tabBar,
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                initialParams={{ user }}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            name={focused ? 'home' : 'home-outline'}
                            size={24}
                            color={focused ? '#3498db' : '#777'}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Companies"
                component={Companies}
                initialParams={{ user }}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            name={focused ? 'search' : 'search-outline'}
                            size={26}
                            color={focused ? '#3498db' : '#777'}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Notifications"
                component={Profile}
                initialParams={{ user }}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            name={focused ? 'construct' : 'construct-outline'}
                            size={24}
                            color={focused ? '#3498db' : '#777'}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                initialParams={{ user }}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            name={focused ? 'person' : 'person-outline'}
                            size={24}
                            color={focused ? '#3498db' : '#777'}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;