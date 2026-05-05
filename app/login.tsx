import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { User, Lock, ArrowLeft } from 'lucide-react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import useAuthStore from '../store/useAuthStore';
import { loginHttp, authMeHttp } from '../data/http/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const setPayload = useAuthStore((state) => state.setPayload);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Llamar al servicio de login
      const token = await loginHttp({ email, password });
      
      // 2. Guardar token en AsyncStorage y Store
      await login(token);
      
      // 3. Obtener datos del usuario
      const userPayload = await authMeHttp();
      setPayload(userPayload);
      
      // 4. Redirigir a la Agenda
      router.replace('/agenda');
      
      Alert.alert('Éxito', 'Bienvenido de nuevo');
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || 'Credenciales incorrectas o error de servidor';
      Alert.alert('Error de Login', message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View className="flex-1 bg-background">
        <View className="flex-1 px-6 pt-12">
        {/* Botón Volver */}
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-white shadow-sm mb-8"
        >
          <ArrowLeft size={24} color="#1e293b" />
        </TouchableOpacity>

        {/* Cabecera */}
        <View className="mb-10">
          <Text className="text-4xl font-manrope font-bold text-primary-dark">
            Bienvenido
          </Text>
          <Text className="text-gray-500 font-manrope text-lg mt-2">
            Inicia sesión para continuar
          </Text>
        </View>

        {/* Formulario */}
        <View className="space-y-4">
          <View>
            <Text className="text-primary-dark font-manrope font-semibold mb-2 ml-1">
              Email
            </Text>
            <View className="flex-row items-center bg-white border border-secondary rounded-2xl px-4 py-1 shadow-sm">
              <User size={20} color="#94a3b8" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="tu@email.com"
                className="flex-1 h-12 ml-3 font-manrope text-primary-dark"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View className="mt-4">
            <Text className="text-primary-dark font-manrope font-semibold mb-2 ml-1">
              Contraseña
            </Text>
            <View className="flex-row items-center bg-white border border-secondary rounded-2xl px-4 py-1 shadow-sm">
              <Lock size={20} color="#94a3b8" />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                className="flex-1 h-12 ml-3 font-manrope text-primary-dark"
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity className="items-end py-2">
            <Text className="text-primary font-manrope font-semibold">
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleLogin}
            disabled={isLoading}
            className="bg-primary w-full py-4 rounded-2xl items-center shadow-md mt-4"
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-manrope font-semibold text-lg">
                Entrar
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row items-center my-8">
            <View className="flex-1 h-[1px] bg-secondary" />
            <Text className="mx-4 text-gray-400 font-manrope">o continuar con</Text>
            <View className="flex-1 h-[1px] bg-secondary" />
          </View>

          <TouchableOpacity 
            className="flex-row items-center justify-center bg-white border border-secondary w-full py-4 rounded-2xl shadow-sm"
          >
            <FontAwesome name="google" size={20} color="#1e293b" />
            <Text className="text-primary-dark font-manrope font-semibold text-lg ml-3">
              Google
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="flex-row justify-center mt-auto mb-8">
          <Text className="text-gray-500 font-manrope">¿No tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text className="text-primary font-manrope font-bold">Regístrate</Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
    </KeyboardAvoidingView>
  );
}
