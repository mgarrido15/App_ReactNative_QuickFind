import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, SafeAreaView, ScrollView } from 'react-native';
import { styles } from '../styles';
import { useRoute } from '@react-navigation/native';
import { User } from '../models/User';

// Importar los componentes modulares si los has creado
import { CreateCompanyForm } from '../components/CreateCompanyForm';
import { ModifyCompany } from '../components/ModifyCompany';

export const ManageCompanies = () => {
    const route = useRoute();
    const { user } = route.params as { user: User };
    const [mode, setMode] = useState<'none' | 'create' | 'modify'>('none');

    // Función para manejar la selección de "Crear Empresa"
    const handleCreateSelected = () => setMode('create');
    const handleGoBack = () => setMode('none');
    const handleModifyCompanies = () => setMode('modify');

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ width: '100%', padding: 16 }}>
                <Text style={styles.title}>Gestionar Empresas</Text>

                {mode === 'none' && (
                    <View style={{ padding: 20, alignItems: 'center', gap: 20 }}>
                        <Text style={[styles.title, { marginBottom: 30 }]}>¿Qué acción deseas realizar?</Text>

                        <TouchableOpacity
                            style={[styles.buttonPerfil, { backgroundColor: '#4c87af', width: '80%' }]}
                            onPress={handleCreateSelected}
                        >
                            <Text style={styles.buttonTextPerfil}>Crear Empresa</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.buttonPerfil, { backgroundColor: '#777', width: '80%' }]}
                            onPress={handleModifyCompanies}
                        >
                            <Text style={styles.buttonTextPerfil}>Modificar Empresas</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {mode === 'create' && (
                    <CreateCompanyForm
                        userId={user._id}
                        onGoBack={handleGoBack}
                    />
                )}


                {mode === 'modify' && (
                    <ModifyCompany
                        onGoBack={handleGoBack}
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
};