import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Alert, Image, ActivityIndicator, TextInput, Modal } from 'react-native';
import { useRoute } from "@react-navigation/native";
import { User } from "../models/User";
import { Company } from "../models/Company";
import { styles } from '../styles';
import { getAllCompaniesFromUser } from '../service/UserService';
import { updateCompanyById, addProductToCompany } from '../service/CompanyService';
import { postProduct } from '../service/ProductService';
import { Product } from '../models/Product';

interface ModifyCompanyProps {
    onGoBack?: () => void;
}

export const ModifyCompany = ({ onGoBack }: ModifyCompanyProps) => {
    const route = useRoute();
    const { user } = route.params as { user: User };
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingCompany, setEditingCompany] = useState<Company | null>(null);
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        email: '',
        phone: '',
        coordenates_lat: 0,
        coordenates_lng: 0,
    });
    // Actualizado para incluir todos los campos necesarios según el modelo Product
    const [productFormData, setProductFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '0',
        category: '',
        image: '',
        rating: 0,
        available: true
    });
    const [updating, setUpdating] = useState(false);
    const [creatingProduct, setCreatingProduct] = useState(false);

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

    // Actualizado para inicializar todos los campos necesarios
    const handleAddProductToCompany = (companyId: string) => {
        setSelectedCompanyId(companyId);
        setIsAddingProduct(true);
        setProductFormData({
            name: '',
            description: '',
            price: '',
            stock: '0',
            category: '',
            image: '',
            rating: 0,
            available: true
        });
    };

    const updateField = (field: string, value: string | number) => {
        setFormData({
            ...formData,
            [field]: value
        });
    };

    const updateProductField = (field: string, value: string) => {
        setProductFormData({
            ...productFormData,
            [field]: value
        });
    };

    const handleCancelEdit = () => {
        setEditingCompany(null);
    };

    const handleCancelAddProduct = () => {
        setIsAddingProduct(false);
        setSelectedCompanyId(null);
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

    // Actualizado para incluir todos los campos necesarios según el modelo Product
    const handleSubmitProduct = async () => {
        if (!selectedCompanyId) return;

        // Validaciones básicas
        if (!productFormData.name || !productFormData.description || !productFormData.price) {
            Alert.alert('Error', 'Por favor completa los campos obligatorios (nombre, descripción y precio)');
            return;
        }

        try {
            setCreatingProduct(true);

            // Paso 1: Crear el producto
            const productData = {
                name: productFormData.name,
                description: productFormData.description,
                price: parseFloat(productFormData.price),
                stock: parseInt(productFormData.stock),
                category: productFormData.category,
                image: productFormData.image || undefined,
                companyId: selectedCompanyId,
                rating: 0,
                available: true
            };

            const response: any = await postProduct(productData);

            const newProduct = response.newProduct || response;


            // Verificar si tenemos un ID válido
            if (!newProduct || !newProduct._id) {
                throw new Error("No se pudo obtener el ID del producto creado");
            }

            // Paso 2: Añadir el producto a la compañía
            const updatedCompany = await addProductToCompany(selectedCompanyId, {
                productId: newProduct._id
            });

            // Actualizar la lista de compañías
            setCompanies(companies.map(company =>
                company._id === updatedCompany._id ? updatedCompany : company
            ));

            Alert.alert('Éxito', `Producto "${newProduct.name}" añadido correctamente a la compañía`);
            setIsAddingProduct(false);
            setSelectedCompanyId(null);
        } catch (error: any) {
            let errorMessage = 'No se pudo añadir el producto';
            if (error.message) {
                errorMessage = error.message;
            }
            console.error("Error al crear producto:", error);
            Alert.alert('Error', errorMessage);
        } finally {
            setCreatingProduct(false);
        }
    };

    return (
        <View style={{ width: '100%' }}>
            <View style={styles.sectionHeader}>
                <TouchableOpacity
                    onPress={onGoBack}
                    style={{ marginRight: 15 }}
                >
                    <Text style={styles.backButton}>← Atrás</Text>
                </TouchableOpacity>
                <Text style={styles.sectionTitle}>Modificar Empresas</Text>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4c87af" />
                    <Text style={{ marginTop: 10 }}>Cargando empresas...</Text>
                </View>
            ) : companies.length === 0 ? (
                <View style={styles.emptyStateContainer}>
                    <Text style={styles.emptyStateTitle}>
                        No tienes empresas registradas
                    </Text>
                    <Text style={styles.emptyStateMessage}>
                        Para crear una empresa, vuelve atrás y selecciona "Crear Empresa"
                    </Text>
                </View>
            ) : (
                <ScrollView style={{ width: '100%' }}>
                    <Text style={styles.listTitle}>
                        Mis Empresas
                    </Text>

                    {companies.map((company) => (
                        <View key={company._id} style={styles.companyCard}>
                            <View style={styles.companyCardHeader}>
                                {company.icon && (
                                    <Image
                                        source={{ uri: company.icon }}
                                        style={styles.companyIcon}
                                    />
                                )}
                                <Text style={styles.companiesHeader}>
                                    {company.name}
                                </Text>
                            </View>

                            <View style={styles.companyCardContent}>
                                <View style={styles.companyRow}>
                                    <Text style={styles.companyLabel}>ID:</Text>
                                    <Text style={styles.companyValue}>{company._id}</Text>
                                </View>

                                <View style={styles.companyRow}>
                                    <Text style={styles.companyLabel}>Descripción:</Text>
                                    <Text style={styles.companyValue}>{company.description}</Text>
                                </View>

                                <View style={styles.companyRow}>
                                    <Text style={styles.companyLabel}>Ubicación:</Text>
                                    <Text style={styles.companyValue}>{company.location}</Text>
                                </View>

                                <View style={styles.companyRow}>
                                    <Text style={styles.companyLabel}>Email:</Text>
                                    <Text style={styles.companyValue}>{company.email}</Text>
                                </View>

                                <View style={styles.companyRow}>
                                    <Text style={styles.companyLabel}>Teléfono:</Text>
                                    <Text style={styles.companyValue}>{company.phone}</Text>
                                </View>

                                <View style={styles.companyRow}>
                                    <Text style={styles.companyLabel}>Valoración:</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text>{company.rating?.toFixed(1) || "N/A"} ⭐</Text>
                                        <Text style={{ marginLeft: 5, color: '#777' }}>
                                            ({company.userRatingsTotal || 0} valoraciones)
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.companyRow}>
                                    <Text style={styles.companyLabel}>Seguidores:</Text>
                                    <Text style={styles.companyValue}>{company.followers || 0}</Text>
                                </View>

                                <View style={styles.companyRow}>
                                    <Text style={styles.companyLabel}>Coordenadas:</Text>
                                    <Text style={styles.companyValue}>
                                        {company.coordenates_lat}, {company.coordenates_lng}
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => handleModifyCompany(company)}
                                >
                                    <Text style={styles.buttonTextPerfil}>Modificar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => handleAddProductToCompany(company._id)}
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
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView>
                            <Text style={styles.modalTitle}>
                                Editar {editingCompany?.name}
                            </Text>

                            <Text style={styles.formLabel}>Nombre:</Text>
                            <TextInput
                                value={formData.name}
                                onChangeText={(value) => updateField('name', value)}
                                style={styles.input}
                                placeholder="Nombre de la empresa"
                            />

                            <Text style={styles.formLabel}>Descripción:</Text>
                            <TextInput
                                value={formData.description}
                                onChangeText={(value) => updateField('description', value)}
                                style={[styles.input, styles.textarea]}
                                placeholder="Descripción"
                                multiline
                            />

                            <Text style={styles.formLabel}>Ubicación:</Text>
                            <TextInput
                                value={formData.location}
                                onChangeText={(value) => updateField('location', value)}
                                style={styles.input}
                                placeholder="Ubicación"
                            />

                            <Text style={styles.formLabel}>Email:</Text>
                            <TextInput
                                value={formData.email}
                                onChangeText={(value) => updateField('email', value)}
                                style={styles.input}
                                placeholder="Email"
                                keyboardType="email-address"
                            />

                            <Text style={styles.formLabel}>Teléfono:</Text>
                            <TextInput
                                value={formData.phone}
                                onChangeText={(value) => updateField('phone', value)}
                                style={styles.input}
                                placeholder="Teléfono"
                                keyboardType="phone-pad"
                            />

                            <View style={styles.rowContainer}>
                                <View style={styles.halfColumn}>
                                    <Text style={styles.formLabel}>Latitud:</Text>
                                    <TextInput
                                        value={formData.coordenates_lat.toString()}
                                        onChangeText={(value) => updateField('coordenates_lat', parseFloat(value) || 0)}
                                        style={styles.input}
                                        placeholder="Latitud"
                                        keyboardType="numeric"
                                    />
                                </View>

                                <View style={styles.halfColumn}>
                                    <Text style={styles.formLabel}>Longitud:</Text>
                                    <TextInput
                                        value={formData.coordenates_lng.toString()}
                                        onChangeText={(value) => updateField('coordenates_lng', parseFloat(value) || 0)}
                                        style={styles.input}
                                        placeholder="Longitud"
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>

                            <View style={styles.rowContainer}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={handleCancelEdit}
                                    disabled={updating}
                                >
                                    <Text style={styles.buttonTextPerfil}>Cancelar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.modalButton, styles.saveButton]}
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

            {/* Modal para añadir producto */}
            <Modal
                visible={isAddingProduct}
                transparent={true}
                animationType="slide"
                onRequestClose={handleCancelAddProduct}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView>
                            <Text style={styles.modalTitle}>
                                Añadir Nuevo Producto
                            </Text>

                            <Text style={styles.formLabel}>Nombre:</Text>
                            <TextInput
                                value={productFormData.name}
                                onChangeText={(value) => updateProductField('name', value)}
                                style={styles.input}
                                placeholder="Nombre del producto"
                            />

                            <Text style={styles.formLabel}>Descripción:</Text>
                            <TextInput
                                value={productFormData.description}
                                onChangeText={(value) => updateProductField('description', value)}
                                style={[styles.input, styles.textarea]}
                                placeholder="Descripción"
                                multiline
                            />

                            <Text style={styles.formLabel}>Precio:</Text>
                            <TextInput
                                value={productFormData.price}
                                onChangeText={(value) => updateProductField('price', value)}
                                style={styles.input}
                                placeholder="Precio"
                                keyboardType="numeric"
                            />

                            <Text style={styles.formLabel}>Cantidad en stock:</Text>
                            <TextInput
                                value={productFormData.stock}
                                onChangeText={(value) => updateProductField('stock', value)}
                                style={styles.input}
                                placeholder="Cantidad disponible"
                                keyboardType="numeric"
                            />

                            <Text style={styles.formLabel}>Categoría:</Text>
                            <TextInput
                                value={productFormData.category}
                                onChangeText={(value) => updateProductField('category', value)}
                                style={styles.input}
                                placeholder="Categoría"
                            />

                            <Text style={styles.formLabel}>URL de la imagen:</Text>
                            <TextInput
                                value={productFormData.image}
                                onChangeText={(value) => updateProductField('image', value)}
                                style={styles.input}
                                placeholder="URL de la imagen (opcional)"
                            />

                            <View style={styles.rowContainer}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={handleCancelAddProduct}
                                    disabled={creatingProduct}
                                >
                                    <Text style={styles.buttonTextPerfil}>Cancelar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.modalButton, styles.saveButton]}
                                    onPress={handleSubmitProduct}
                                    disabled={creatingProduct}
                                >
                                    {creatingProduct ? (
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