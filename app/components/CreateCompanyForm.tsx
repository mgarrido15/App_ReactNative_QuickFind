import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Modal, Image, ScrollView } from 'react-native';
import { styles } from '../styles';
import { postCompany } from '../service/CompanyService';
import { Company } from '../models/Company';

interface CreateCompanyFormProps {
    userId: string;
    onGoBack: () => void;
}

export const CreateCompanyForm = ({ userId, onGoBack }: CreateCompanyFormProps) => {
    const [loading, setLoading] = useState(false);
    const [createdCompany, setCreatedCompany] = useState<Company | null>(null);
    const [showDialog, setShowDialog] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        coordenates_lat: 1,
        coordenates_lng: 1,
        email: '',
        phone: '',
        password: ''
    });

    const updateField = (field: string, value: string | number) => {
        setFormData({
            ...formData,
            [field]: value
        });
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.description || !formData.location || !formData.email || !formData.phone || !formData.password) {
            Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
            return;
        }

        try {
            setLoading(true);

            const companyData = {
                ownerId: userId,
                name: formData.name,
                description: formData.description,
                location: formData.location,
                coordenates_lat: formData.coordenates_lat,
                coordenates_lng: formData.coordenates_lng,
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            };

            const result = await postCompany(companyData);

            setCreatedCompany(result);
            setShowDialog(true);

            // Limpiar el formulario
            setFormData({
                name: '',
                description: '',
                location: '',
                coordenates_lat: 1,
                coordenates_lng: 1,
                email: '',
                phone: '',
                password: ''
            });
        } catch (error) {
            console.error("Error al crear compañía:", error);
            Alert.alert('Error', 'No se pudo crear la compañía. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const closeDialog = () => {
        setShowDialog(false);
    };

    return (
        <>
            <View style={{ marginTop: 20, marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={onGoBack}
                    style={{ marginRight: 15 }}
                >
                    <Text style={{ color: '#4c87af', fontSize: 16 }}>← Atrás</Text>
                </TouchableOpacity>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Crear Nueva Empresa</Text>
            </View>

            <TextInput
                placeholder="Nombre de la empresa"
                value={formData.name}
                onChangeText={(value) => updateField('name', value)}
                style={styles.input}
            />

            <TextInput
                placeholder="Descripción"
                value={formData.description}
                onChangeText={(value) => updateField('description', value)}
                style={[styles.input, styles.textarea]}
                multiline
            />

            <TextInput
                placeholder="Ubicación"
                value={formData.location}
                onChangeText={(value) => updateField('location', value)}
                style={styles.input}
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TextInput
                    placeholder="Latitud"
                    value={formData.coordenates_lat.toString()}
                    onChangeText={(value) => updateField('coordenates_lat', parseFloat(value) || 0)}
                    style={[styles.input, { width: '48%' }]}
                    keyboardType="numeric"
                />

                <TextInput
                    placeholder="Longitud"
                    value={formData.coordenates_lng.toString()}
                    onChangeText={(value) => updateField('coordenates_lng', parseFloat(value) || 0)}
                    style={[styles.input, { width: '48%' }]}
                    keyboardType="numeric"
                />
            </View>

            <TextInput
                placeholder="Email"
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                style={styles.input}
                keyboardType="email-address"
            />

            <TextInput
                placeholder="Teléfono"
                value={formData.phone}
                onChangeText={(value) => updateField('phone', value)}
                style={styles.input}
                keyboardType="phone-pad"
            />

            <TextInput
                placeholder="Contraseña"
                value={formData.password}
                onChangeText={(value) => updateField('password', value)}
                style={styles.input}
                secureTextEntry
            />

            <TouchableOpacity
                style={[
                    styles.buttonPerfil,
                    { backgroundColor: '#4c87af', marginTop: 20, marginBottom: 40 }
                ]}
                onPress={handleSubmit}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                ) : (
                    <Text style={styles.buttonTextPerfil}>Crear Empresa</Text>
                )}
            </TouchableOpacity>

            {/* Dialog/Modal para mostrar la empresa creada */}
            <Modal
                visible={showDialog}
                transparent={true}
                animationType="fade"
                onRequestClose={closeDialog}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: 10,
                        padding: 20,
                        width: '90%',
                        maxHeight: '80%'
                    }}>
                        <ScrollView>
                            <Text style={[styles.companiesHeader, { textAlign: 'center', marginBottom: 15 }]}>
                                ¡Empresa Creada Exitosamente!
                            </Text>

                            {createdCompany && (
                                <View style={styles.companyCardContent}>
                                    <View style={styles.companyRow}>
                                        <Text style={styles.companyLabel}>ID:</Text>
                                        <Text style={styles.companyValue}>{createdCompany._id}</Text>
                                    </View>

                                    <View style={styles.companyRow}>
                                        <Text style={styles.companyLabel}>Nombre:</Text>
                                        <Text style={styles.companyValue}>{createdCompany.name}</Text>
                                    </View>

                                    <View style={styles.companyRow}>
                                        <Text style={styles.companyLabel}>Descripción:</Text>
                                        <Text style={styles.companyValue}>{createdCompany.description}</Text>
                                    </View>

                                    <View style={styles.companyRow}>
                                        <Text style={styles.companyLabel}>Ubicación:</Text>
                                        <Text style={styles.companyValue}>{createdCompany.location}</Text>
                                    </View>

                                    <View style={styles.companyRow}>
                                        <Text style={styles.companyLabel}>Email:</Text>
                                        <Text style={styles.companyValue}>{createdCompany.email}</Text>
                                    </View>

                                    <View style={styles.companyRow}>
                                        <Text style={styles.companyLabel}>Teléfono:</Text>
                                        <Text style={styles.companyValue}>{createdCompany.phone}</Text>
                                    </View>

                                    <View style={styles.companyRow}>
                                        <Text style={styles.companyLabel}>Propietario:</Text>
                                        <Text style={styles.companyValue}>{createdCompany.ownerId}</Text>
                                    </View>

                                    {createdCompany.icon && (
                                        <Image
                                            source={{ uri: createdCompany.icon }}
                                            style={[styles.companyIcon, { alignSelf: 'center', marginTop: 10, width: 100, height: 100 }]}
                                        />
                                    )}
                                </View>
                            )}

                            <TouchableOpacity
                                style={[
                                    styles.buttonPerfil,
                                    { backgroundColor: '#4c87af', marginTop: 20 }
                                ]}
                                onPress={closeDialog}
                            >
                                <Text style={styles.buttonTextPerfil}>Continuar</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </>
    );
};