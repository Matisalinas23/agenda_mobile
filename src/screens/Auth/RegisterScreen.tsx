import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axiosInstance from '../../api/axios';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<any>();

    const handleSubmit = async () => {
        if (!username || !email || !password) {
            Alert.alert("Error", "Por favor completa todos los campos.");
            return;
        }

        setLoading(true);
        try {
            await axiosInstance.post('/auth/register', { username, email, password });
            Alert.alert("Éxito", "Registro completado. Por favor, verifica tu correo.");
            navigation.navigate('Verification'); // Se asume que el backend manda el correo
        } catch (error: any) {
            Alert.alert("Error", "No se pudo completar el registro. Intentalo de nuevo más tarde.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Registrarse</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nombre de usuario"
                    placeholderTextColor="#9ca3af"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
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
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Crear Cuenta</Text>}
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.footerLink}>Iniciar sesión</Text>
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
        marginBottom: 30,
    },
    input: {
        width: '100%',
        color: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(30, 58, 138, 0.8)',
        fontSize: 18,
        paddingVertical: 10,
        marginBottom: 20,
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
