import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, SafeAreaView, Image, TouchableOpacity, Alert } from 'react-native';
import { getAllCompanies } from '../service/CompanyService';
import { Company } from '../models/Company';
import { StatusBar } from 'expo-status-bar';
import { useRoute } from "@react-navigation/native";
import { FollowCompany, UnfollowCompany } from '../service/UserService';
import { User } from '../models/User';
import { styles } from '../styles';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/screenType";

type CompaniesNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const Companies = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [followingStatus, setFollowingStatus] = useState<{ [key: string]: boolean }>({});
    const [processingFollow, setProcessingFollow] = useState<{ [key: string]: boolean }>({});
    const navigation = useNavigation<CompaniesNavigationProp>();

    const route = useRoute();
    const { user } = route.params as { user: User };

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setLoading(true);
                const companiesData = await getAllCompanies();
                setCompanies(companiesData);

                // Inicializar el estado de seguimiento para cada compañía
                const initialFollowStatus: { [key: string]: boolean } = {};
                companiesData.forEach(company => {
                    initialFollowStatus[company._id] = isUserFollowingCompany(company._id);
                });
                setFollowingStatus(initialFollowStatus);
            } catch (error) {
                console.error("Error fetching companies:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, [user]);

    // Verifica si el usuario sigue a una compañía específica
    const isUserFollowingCompany = (companyId: string): boolean => {
        if (!user || !user.company_Followed) return false;

        return user.company_Followed.some(follow => follow.company_id === companyId);
    };

    // Maneja la acción de seguir/dejar de seguir
    const handleFollowToggle = async (companyId: string) => {
        if (processingFollow[companyId]) return; // Evitar múltiples clics

        try {
            setProcessingFollow({ ...processingFollow, [companyId]: true });

            if (followingStatus[companyId]) {
                // Dejar de seguir
                await UnfollowCompany(user._id, companyId);
                setFollowingStatus({ ...followingStatus, [companyId]: false });
            } else {
                // Seguir
                await FollowCompany(user._id, companyId);
                setFollowingStatus({ ...followingStatus, [companyId]: true });
            }
        } catch (error) {
            console.error("Error al cambiar el estado de seguimiento:", error);
            Alert.alert("Error", "No se pudo actualizar el estado de seguimiento.");
        } finally {
            setProcessingFollow({ ...processingFollow, [companyId]: false });
        }
    };

    return (
        <SafeAreaView style={styles.companiesContainer}>
            <StatusBar style="auto" />
            <Text style={styles.companiesHeader}>Empresas Disponibles</Text>

            {loading ? (
                <Text style={styles.companiesLoadingText}>Cargando Empresas...</Text>
            ) : (
                <ScrollView style={styles.companiesScrollView}>
                    {companies.length === 0 ? (
                        <Text style={styles.companiesNoDataText}>No hay empresas disponibles</Text>
                    ) : (
                        companies.map((company) => (
                            <View key={company._id} style={styles.companyCard}>
                                <View style={styles.companyCardHeader}>
                                    {company.icon && (
                                        <Image
                                            source={{ uri: company.icon }}
                                            style={styles.companyIcon}
                                        />
                                    )}
                                    <TouchableOpacity
                                        style={[
                                            styles.followButton,
                                            followingStatus[company._id]
                                                ? styles.followingButton
                                                : styles.notFollowingButton
                                        ]}
                                        onPress={() => handleFollowToggle(company._id)}
                                        disabled={processingFollow[company._id]}
                                    >
                                        <Text style={styles.followButtonText}>
                                            {followingStatus[company._id] ? 'Siguiendo' : 'Seguir'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.companyCardContent}>
                                    <View style={styles.companyRow}>
                                        <Text style={styles.companyLabel}>Nombre:</Text>
                                        <Text style={styles.companyValue}>{company.name || "N/A"}</Text>
                                    </View>

                                    <View style={styles.companyRow}>
                                        <Text style={styles.companyLabel}>Descripción:</Text>
                                        <Text style={styles.companyValue}>{company.description || "N/A"}</Text>
                                    </View>

                                    <View style={styles.companyRow}>
                                        <Text style={styles.companyLabel}>Ubicación:</Text>
                                        <Text style={styles.companyValue}>{company.location || "N/A"}</Text>
                                    </View>

                                    <View style={styles.companyRow}>
                                        <Text style={styles.companyLabel}>Email:</Text>
                                        <Text style={styles.companyValue}>{company.email || "N/A"}</Text>
                                    </View>

                                    <View style={styles.companyRow}>
                                        <Text style={styles.companyLabel}>Teléfono:</Text>
                                        <Text style={styles.companyValue}>{company.phone || "N/A"}</Text>
                                    </View>

                                    {company.rating !== undefined && (
                                        <View style={styles.companyRatingContainer}>
                                            <Text style={styles.companyRating}>
                                                {company.rating.toFixed(1)} ⭐
                                            </Text>
                                            <Text style={styles.companyRatingCount}>
                                                ({company.userRatingsTotal} valoraciones)
                                            </Text>
                                        </View>
                                    )}
                                    <TouchableOpacity
                                        style={styles.chatButton}
                                        onPress={() => navigation.navigate("Chat", {
                                            user: user,
                                            companyId: company._id
                                        })}
                                    >
                                        <Text style={styles.chatButtonText}>Chat</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};