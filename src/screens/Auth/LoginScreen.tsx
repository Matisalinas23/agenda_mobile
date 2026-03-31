import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import useAuthStore from '../../store/useAuthStore';
import axiosInstance from '../../api/axios'; // Direct API call for now to skip hooks migration initially
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const login = useAuthStore(state => state.login);
    const navigation = useNavigation<any>();

    const handleSubmit = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Por favor ingresa correo y contraseña.");
            return;
        }

        setLoading(true);
        try {
            const { data } = await axiosInstance.post('/auth/login', { email, password });
            
            // Si res.data es el token directamente (un string), usamos data, si no extraemos de data.token
            const token = typeof data === 'string' ? data : data.token;
            
            await login(token); 
        } catch (error: any) {
            console.error("Login Error:", error.message);
            console.error("Login Response:", error.response?.data);
            
            const status = error.response?.status;
            if (status === 403) {
                Alert.alert("Error", "El usuario no ha sido verificado aún. Revisa tu correo.");
                navigation.navigate('Verification');
            } else if (status === 401) {
                Alert.alert("Atención", "Credenciales inválidas, intenta de nuevo.");
            } else {
                Alert.alert("Error", "Ocurrió un error al iniciar sesión.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                {/* Placeholder for Icon */}
                <View style={styles.iconPlaceholder}>
                    <Text style={styles.iconText}>👤</Text>
                </View>

                <TextInput 
                    style={styles.input} 
                    placeholder="Correo" 
                    placeholderTextColor="#9ca3af"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TextInput 
                    style={styles.input} 
                    placeholder="Contraseña" 
                    placeholderTextColor="#9ca3af"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Iniciar sesión</Text>}
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>¿Aún no tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.footerLink}>Crear una cuenta</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111827', // dark:bg-background-dark approx
        alignItems: 'center',
        justifyContent: 'center',
    },
    formContainer: {
        width: '85%',
        backgroundColor: '#1f2937', // dark:bg-secondary-dark
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
    },
    iconPlaceholder: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#374151',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    iconText: {
        fontSize: 32,
    },
    input: {
        width: '100%',
        color: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(30, 58, 138, 0.8)', // border-blue-900/80
        fontSize: 18,
        paddingVertical: 10,
        marginBottom: 20,
    },
    button: {
        marginTop: 20,
        backgroundColor: '#3b82f6', // typical blue button
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
    footer: {
        flexDirection: 'row',
        marginTop: 40,
    },
    footerText: {
        color: '#fff',
    },
    footerLink: {
        color: '#3b82f6',
    }
});
