import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axiosInstance from '../../api/axios';
import { useNavigation } from '@react-navigation/native';

export default function AccountVerificationScreen() {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<any>();

    const handleSubmit = async () => {
        if (!code) {
            Alert.alert("Error", "Por favor ingresa el código.");
            return;
        }

        setLoading(true);
        try {
            await axiosInstance.post(`/auth/verify-email?token=${code}`);
            Alert.alert("Éxito", "Cuenta verificada correctamente.");
            navigation.navigate('Login');
        } catch (error: any) {
            Alert.alert("Error", "Código inválido o expirado. Por favor, solicita uno nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Verificación</Text>
                <Text style={styles.subtitle}>Introduce el código</Text>

                <TextInput 
                    style={styles.input} 
                    placeholder="Código de 6 dígitos" 
                    placeholderTextColor="#9ca3af"
                    value={code}
                    onChangeText={setCode}
                    autoCapitalize="none"
                    keyboardType="number-pad"
                    maxLength={6}
                />

                <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading || code.length < 6}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Confirmar</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={styles.resendButton} onPress={() => {}}>
                    <Text style={styles.resendText}>Reenviar código</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.footerLink}>Volver al Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111827',
        alignItems: 'center',
        justifyContent: 'center',
    },
    formContainer: {
        width: '85%',
        backgroundColor: '#1f2937',
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        color: '#9ca3af',
        fontSize: 16,
        marginBottom: 30,
    },
    input: {
        width: '100%',
        color: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(30, 58, 138, 0.8)',
        fontSize: 24,
        paddingVertical: 10,
        marginBottom: 20,
        textAlign: 'center',
        letterSpacing: 10,
    },
    button: {
        marginTop: 20,
        backgroundColor: '#3b82f6',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resendButton: {
        marginTop: 20,
    },
    resendText: {
        color: '#3b82f6',
        fontSize: 14,
    },
    footer: {
        flexDirection: 'row',
        marginTop: 40,
    },
    footerLink: {
        color: '#3b82f6',
    }
});
