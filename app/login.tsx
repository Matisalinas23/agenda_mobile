import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, router } from 'expo-router';
import useAuthStore from '../store/useAuthStore';
import { loginHttp, authMeHttp } from '../data/http/auth';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const login = useAuthStore((state) => state.login);
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
  const setPayload = useAuthStore((state) => state.setPayload);
  const isToken = useAuthStore((state) => state.isToken);

  useEffect(() => {
    if (isToken) {
      router.replace('/agenda');
    }
  }, [isToken]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor, rellena todos los campos');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const token = await loginHttp({ email, password });
      await login(token);
      router.replace('/agenda');
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || 'Error al iniciar sesión';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 pt-4 pb-12">
          <View className="flex-1 pt-6 pb-10">
            {/* Botón Volver */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center rounded-full bg-white dark:bg-dark-card shadow-sm mb-6 border border-secondary dark:border-slate-700"
            >
              <ArrowLeft size={24} color="#94a3b8" />
            </TouchableOpacity>

            {/* Header */}
            <View className="mb-10">
              <Text className="text-4xl font-manrope font-bold text-primary-dark dark:text-white mb-2">
                Bienvenido
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 font-manrope text-lg">
                Inicia sesión para continuar
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-4 mb-6">
              {error ? (
                <Text className="text-red-500 font-manrope text-sm text-center mb-2">{error}</Text>
              ) : null}

              <View>
                <Text className="text-primary-dark dark:text-gray-300 font-manrope font-semibold mb-2 ml-1">Email</Text>
                <View className="flex-row items-center bg-white dark:bg-dark-card border border-secondary dark:border-slate-700 rounded-2xl px-4 py-1 h-14">
                  <Mail size={20} color="#94a3b8" />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="tu@email.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="flex-1 ml-3 font-manrope text-primary-dark dark:text-white"
                  />
                </View>
              </View>

              <View>
                <Text className="text-primary-dark dark:text-gray-300 font-manrope font-semibold mb-2 ml-1">Contraseña</Text>
                <View className="flex-row items-center bg-white dark:bg-dark-card border border-secondary dark:border-slate-700 rounded-2xl px-4 py-1 h-14">
                  <Lock size={20} color="#94a3b8" />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    secureTextEntry={!showPassword}
                    className="flex-1 ml-3 font-manrope text-primary-dark dark:text-white"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-2">
                    {showPassword ? (
                      <EyeOff size={20} color="#94a3b8" />
                    ) : (
                      <Eye size={20} color="#94a3b8" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity className="items-end mt-2">
                <Text className="text-primary font-manrope font-semibold text-sm">
                  ¿Olvidaste tu contraseña?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Buttons */}
            <View className="mt-4 space-y-4">
              <TouchableOpacity
                onPress={handleLogin}
                disabled={isLoading}
                className="bg-primary w-full py-4 rounded-2xl items-center shadow-md"
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-manrope font-semibold text-lg">
                    Entrar
                  </Text>
                )}
              </TouchableOpacity>

              <View className="flex-row items-center my-4">
                <View className="flex-1 h-[1px] bg-secondary" />
                <Text className="mx-4 text-gray-400 dark:text-gray-500 font-manrope text-sm">o continuar con</Text>
                <View className="flex-1 h-[1px] bg-secondary" />
              </View>

              <TouchableOpacity
                onPress={loginWithGoogle}
                className="bg-white dark:bg-dark-card w-full py-4 rounded-2xl items-center flex-row justify-center border border-secondary dark:border-slate-700 shadow-sm"
              >
                <FontAwesome name="google" size={20} color="#94a3b8" />
                <Text className="text-primary-dark dark:text-white font-manrope font-semibold text-lg ml-3">
                  Google
                </Text>
              </TouchableOpacity>
            </View>

            {/* Register Link */}
            <View className="flex-row justify-center mt-auto pt-10">
              <Text className="text-gray-500 dark:text-gray-400 font-manrope">¿No tienes una cuenta? </Text>
              <Link href="/register" asChild>
                <TouchableOpacity>
                  <Text className="text-primary font-manrope font-bold">Regístrate</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
