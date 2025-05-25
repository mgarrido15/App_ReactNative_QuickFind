import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, View, TouchableOpacity, Alert, Image, ActivityIndicator, TextInput, Modal } from 'react-native';
import { useRoute } from "@react-navigation/native";
import { User } from "../models/User";
import { Company } from "../models/Company";
import { styles } from '../styles';
import { getAllCompaniesFromUser } from '../service/UserService';
import { updateCompanyById } from '../service/CompanyService';

interface ModifyCompanyProps {
    onGoBack?: () => void;
}

export const ModifyCompany = ({ onGoBack }: ModifyCompanyProps) => {
    const route = useRoute();
    const { user } = route.params as { user: User };
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingCompany, setEditingCompany] = useState<Company | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        email: '',
        phone: '',
        coordenates_lat: 0,
        coordenates_lng: 0,
    });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchUserCompanies = async () => {
            try {
                setLoading(true);
                const userCompanies = await getAllCompaniesFromUser(user._id);
                setCompanies(userCompanies || []);
            } catch (error) {
                console.error('Error al obtener las empresas del usuario:', error);
                Alert.alert('Error', 'No se pudieron cargar las empresas del usuario');
            } finally {
                setLoading(false);
            }
        };

        fetchUserCompanies();
    }, [user._id]);

    const handleModifyCompany = (company: Company) => {
        setEditingCompany(company);
        setFormData({
            name: company.name || '',
            description: company.description || '',
            location: company.location || '',
            email: company.email || '',
            phone: company.phone || '',
            coordenates_lat: company.coordenates_lat || 0,
            coordenates_lng: company.coordenates_lng || 0,
        });
    };

    const updateField = (field: string, value: string | number) => {
        setFormData({
            ...formData,
            [field]: value
        });
    };

    const handleCancelEdit = () => {
        setEditingCompany(null);
    };

    const handleUpdateCompany = async () => {
        if (!editingCompany) return;

        // Validaciones básicas
        if (!formData.name || !formData.description || !formData.location || !formData.email || !formData.phone) {
            Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
            return;
        }

        try {
            setUpdating(true);

            const updatedCompanyData = {
                name: formData.name,
                description: formData.description,
                location: formData.location,
                email: formData.email,
                phone: formData.phone,
                coordenates_lat: formData.coordenates_lat,
                coordenates_lng: formData.coordenates_lng,
            };

            // Llamar a la API para actualizar la compañía
            const updatedCompany = await updateCompanyById(editingCompany._id, updatedCompanyData);

            // Actualizar la lista de compañías
            setCompanies(companies.map(company =>
                company._id === updatedCompany._id ? updatedCompany : company
            ));

            Alert.alert('Éxito', 'Compañía actualizada correctamente');
            setEditingCompany(null);
        } catch (error: any) {
            let errorMessage = 'No se pudo actualizar la compañía';
            if (error.message === "El email ya está registrado") {
                errorMessage = "El email ya está registrado por otra compañía";
            }
            Alert.alert('Error', errorMessage);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <View style={{ width: '100%' }}>
            <View style={{ marginTop: 20, marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={onGoBack}
                    style={{ marginRight: 15 }}
                >
                    <Text style={{ color: '#4c87af', fontSize: 16 }}>← Atrás</Text>
                </TouchableOpacity>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Modificar Empresas</Text>
            </View>

            {loading ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#4c87af" />
                    <Text style={{ marginTop: 10 }}>Cargando empresas...</Text>
                </View>
            ) : companies.length === 0 ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                    <Text style={[styles.title, { fontSize: 18, marginBottom: 10 }]}>
                        No tienes empresas registradas
                    </Text>
                    <Text style={{ textAlign: 'center', marginBottom: 20 }}>
                        Para crear una empresa, vuelve atrás y selecciona "Crear Empresa"
                    </Text>
                </View>
            ) : (
                <ScrollView style={{ width: '100%' }}>
                    <Text style={[styles.title, { fontSize: 18, marginBottom: 20, textAlign: 'center' }]}>
                        Mis Empresas
                    </Text>

                    {companies.map((company) => (
                        <View key={company._id} style={styles.companyCard}>
                            <View style={styles.companyCardHeader}>
                                {company.icon && (
                                    <Image
                                        source={{ uri: company.icon }}
                                        style={styles.companyIcon || { width: 50, height: 50, borderRadius: 25 }}
                                    />
                                )}
                                <Text style={styles.companiesHeader || { fontSize: 18, fontWeight: 'bold' }}>
                                    {company.name}
                                </Text>
                            </View>

                            <View style={styles.companyCardContent || { padding: 10 }}>
                                <View style={styles.companyRow || { flexDirection: 'row', marginBottom: 5 }}>
                                    <Text style={styles.companyLabel || { fontWeight: 'bold', width: '30%' }}>ID:</Text>
                                    <Text style={styles.companyValue || { width: '70%' }}>{company._id}</Text>
                                </View>

                                <View style={styles.companyRow || { flexDirection: 'row', marginBottom: 5 }}>
                                    <Text style={styles.companyLabel || { fontWeight: 'bold', width: '30%' }}>Descripción:</Text>
                                    <Text style={styles.companyValue || { width: '70%' }}>{company.description}</Text>
                                </View>

                                <View style={styles.companyRow || { flexDirection: 'row', marginBottom: 5 }}>
                                    <Text style={styles.companyLabel || { fontWeight: 'bold', width: '30%' }}>Ubicación:</Text>
                                    <Text style={styles.companyValue || { width: '70%' }}>{company.location}</Text>
                                </View>

                                <View style={styles.companyRow || { flexDirection: 'row', marginBottom: 5 }}>
                                    <Text style={styles.companyLabel || { fontWeight: 'bold', width: '30%' }}>Email:</Text>
                                    <Text style={styles.companyValue || { width: '70%' }}>{company.email}</Text>
                                </View>

                                <View style={styles.companyRow || { flexDirection: 'row', marginBottom: 5 }}>
                                    <Text style={styles.companyLabel || { fontWeight: 'bold', width: '30%' }}>Teléfono:</Text>
                                    <Text style={styles.companyValue || { width: '70%' }}>{company.phone}</Text>
                                </View>

                                <View style={styles.companyRow || { flexDirection: 'row', marginBottom: 5 }}>
                                    <Text style={styles.companyLabel || { fontWeight: 'bold', width: '30%' }}>Valoración:</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text>{company.rating?.toFixed(1) || "N/A"} ⭐</Text>
                                        <Text style={{ marginLeft: 5, color: '#777' }}>
                                            ({company.userRatingsTotal || 0} valoraciones)
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.companyRow || { flexDirection: 'row', marginBottom: 5 }}>
                                    <Text style={styles.companyLabel || { fontWeight: 'bold', width: '30%' }}>Seguidores:</Text>
                                    <Text style={styles.companyValue || { width: '70%' }}>{company.followers || 0}</Text>
                                </View>

                                <View style={styles.companyRow || { flexDirection: 'row', marginBottom: 5 }}>
                                    <Text style={styles.companyLabel || { fontWeight: 'bold', width: '30%' }}>Coordenadas:</Text>
                                    <Text style={styles.companyValue || { width: '70%' }}>
                                        {company.coordenates_lat}, {company.coordenates_lng}
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    style={[styles.buttonPerfil, { backgroundColor: '#4c87af', marginTop: 15 }]}
                                    onPress={() => handleModifyCompany(company)}
                                >
                                    <Text style={styles.buttonTextPerfil}>Modificar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.buttonPerfil, { backgroundColor: '#4c87af', marginTop: 15 }]}
                                    onPress={() => Alert.alert('Información', 'Funcionalidad de añadir productos disponible próximamente')}
                                >
                                    <Text style={styles.buttonTextPerfil}>Añadir Producto</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}

            {/* Modal para editar la compañía */}
            <Modal
                visible={!!editingCompany}
                transparent={true}
                animationType="slide"
                onRequestClose={handleCancelEdit}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center' }}>
                    <View style={{ backgroundColor: 'white', margin: 20, borderRadius: 10, padding: 20, maxHeight: '80%' }}>
                        <ScrollView>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
                                Editar {editingCompany?.name}
                            </Text>

                            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Nombre:</Text>
                            <TextInput
                                value={formData.name}
                                onChangeText={(value) => updateField('name', value)}
                                style={styles.input}
                                placeholder="Nombre de la empresa"
                            />

                            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Descripción:</Text>
                            <TextInput
                                value={formData.description}
                                onChangeText={(value) => updateField('description', value)}
                                style={[styles.input, styles.textarea]}
                                placeholder="Descripción"
                                multiline
                            />

                            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Ubicación:</Text>
                            <TextInput
                                value={formData.location}
                                onChangeText={(value) => updateField('location', value)}
                                style={styles.input}
                                placeholder="Ubicación"
                            />

                            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Email:</Text>
                            <TextInput
                                value={formData.email}
                                onChangeText={(value) => updateField('email', value)}
                                style={styles.input}
                                placeholder="Email"
                                keyboardType="email-address"
                            />

                            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Teléfono:</Text>
                            <TextInput
                                value={formData.phone}
                                onChangeText={(value) => updateField('phone', value)}
                                style={styles.input}
                                placeholder="Teléfono"
                                keyboardType="phone-pad"
                            />

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ width: '48%' }}>
                                    <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Latitud:</Text>
                                    <TextInput
                                        value={formData.coordenates_lat.toString()}
                                        onChangeText={(value) => updateField('coordenates_lat', parseFloat(value) || 0)}
                                        style={styles.input}
                                        placeholder="Latitud"
                                        keyboardType="numeric"
                                    />
                                </View>

                                <View style={{ width: '48%' }}>
                                    <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Longitud:</Text>
                                    <TextInput
                                        value={formData.coordenates_lng.toString()}
                                        onChangeText={(value) => updateField('coordenates_lng', parseFloat(value) || 0)}
                                        style={styles.input}
                                        placeholder="Longitud"
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                <TouchableOpacity
                                    style={[styles.buttonPerfil, { backgroundColor: '#777', width: '48%' }]}
                                    onPress={handleCancelEdit}
                                    disabled={updating}
                                >
                                    <Text style={styles.buttonTextPerfil}>Cancelar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.buttonPerfil, { backgroundColor: '#4c87af', width: '48%' }]}
                                    onPress={handleUpdateCompany}
                                    disabled={updating}
                                >
                                    {updating ? (
                                        <ActivityIndicator color="#fff" size="small" />
                                    ) : (
                                        <Text style={styles.buttonTextPerfil}>Guardar</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
};