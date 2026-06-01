import { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Switch, Image, Platform } from 'react-native';
import { ArrowLeft, User, Shield, Monitor, AlertTriangle, Pencil } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { router } from 'expo-router';
import useAuthStore from '../store/useAuthStore';

export default function ProfileScreen() {
  const payload = useAuthStore((state) => state.payload);
  const { colorScheme, toggleColorScheme } = useColorScheme();
  
  // Local state for interactive mockup switches
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Fallbacks for user info
  const username = payload?.username || 'Usuario';
  const email = payload?.email || 'usuario@correo.com';
  const profileImage = payload?.profileImage;

  return (
    <SafeAreaView className="flex-1 bg-[#edf3fc] dark:bg-dark-bg pt-8">
      {/* Top Header */}
      <View className="px-6 py-4 flex-row justify-between items-center bg-[#edf3fc] dark:bg-dark-bg">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-white dark:bg-dark-card shadow-sm border border-secondary dark:border-slate-700"
          >
            <ArrowLeft size={20} color={colorScheme === 'dark' ? '#94a3b8' : '#3b82f6'} />
          </TouchableOpacity>
          <Text className="ml-4 text-xl font-manrope font-bold text-[#3686FF] dark:text-blue-400">
            Mi Perfil
          </Text>
        </View>

        {/* Small Profile Pic in Header */}
        <View className="w-10 h-10 bg-white dark:bg-dark-card rounded-full overflow-hidden border border-secondary dark:border-slate-700 items-center justify-center">
          {profileImage ? (
            <Image source={{ uri: profileImage }} className="w-full h-full" />
          ) : (
            <User size={18} color={colorScheme === 'dark' ? '#94a3b8' : '#64748b'} />
          )}
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Large Profile Card */}
        <View className="bg-white dark:bg-dark-card rounded-3xl p-6 items-center shadow-sm border border-secondary dark:border-slate-800 mb-6 mt-2">
          <View className="relative mb-4">
            <View className="w-28 h-28 rounded-full border-4 border-[#3686FF] overflow-hidden items-center justify-center bg-gray-100 dark:bg-slate-800">
              {profileImage ? (
                <Image source={{ uri: profileImage }} className="w-full h-full" />
              ) : (
                <User size={50} color={colorScheme === 'dark' ? '#94a3b8' : '#64748b'} />
              )}
            </View>
            {/* Edit Pencil Icon Badge */}
            <TouchableOpacity 
              activeOpacity={0.8}
              className="absolute bottom-0 right-0 w-8 h-8 bg-[#3686FF] rounded-full items-center justify-center border-2 border-white dark:border-dark-card shadow-md"
            >
              <Pencil size={14} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-xl font-manrope font-bold text-slate-850 dark:text-white">
            {username}
          </Text>
          <Text className="text-sm font-manrope text-gray-400 dark:text-gray-500 mt-1">
            {email}
          </Text>
        </View>

        {/* Username and Email Fields Card */}
        <View className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-sm border border-secondary dark:border-slate-800 mb-6 space-y-4">
          <View>
            <Text className="text-xs font-manrope font-bold tracking-wider text-[#3686FF] dark:text-blue-400 mb-2 uppercase">
              Nombre de Usuario
            </Text>
            <View className="bg-gray-50 dark:bg-[#131B2E] border border-secondary dark:border-slate-700 rounded-xl px-4 py-3 h-12 justify-center">
              <Text className="text-slate-800 dark:text-gray-200 font-manrope font-medium">
                {username}
              </Text>
            </View>
          </View>

          <View className="mt-4">
            <Text className="text-xs font-manrope font-bold tracking-wider text-[#3686FF] dark:text-blue-400 mb-2 uppercase">
              Correo Electrónico
            </Text>
            <View className="bg-gray-50 dark:bg-[#131B2E] border border-secondary dark:border-slate-700 rounded-xl px-4 py-3 h-12 justify-center">
              <Text className="text-slate-800 dark:text-gray-200 font-manrope font-medium">
                {email}
              </Text>
            </View>
          </View>
        </View>

        {/* Preferences Card */}
        <View className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-sm border border-secondary dark:border-slate-800 mb-6">
          <Text className="text-lg font-manrope font-bold text-slate-800 dark:text-white mb-4">
            Preferencias
          </Text>

          {/* Notifications Switch Row */}
          <View className="flex-row justify-between items-center py-2">
            <View>
              <Text className="text-base font-manrope font-semibold text-slate-800 dark:text-white">
                Notificaciones
              </Text>
              <Text className="text-xs font-manrope font-bold text-[#3686FF] dark:text-blue-400 uppercase mt-0.5">
                {notificationsEnabled ? 'ACTIVADAS' : 'DESACTIVADAS'}
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#94a3b8', true: '#3686FF' }}
              thumbColor={Platform.OS === 'ios' ? undefined : '#ffffff'}
            />
          </View>

          {/* Separator */}
          <View className="h-[1px] bg-secondary/50 dark:bg-slate-750 my-3" />

          {/* Dark Mode Switch Row */}
          <View className="flex-row justify-between items-center py-2">
            <View>
              <Text className="text-base font-manrope font-semibold text-slate-800 dark:text-white">
                Modo Oscuro
              </Text>
              <Text className="text-xs font-manrope font-medium text-gray-400 dark:text-gray-500 uppercase mt-0.5">
                {colorScheme === 'dark' ? 'DARK THEME' : 'LIGHT THEME'}
              </Text>
            </View>
            <Switch
              value={colorScheme === 'dark'}
              onValueChange={toggleColorScheme}
              trackColor={{ false: '#475569', true: '#3686FF' }}
              thumbColor={Platform.OS === 'ios' ? undefined : '#ffffff'}
            />
          </View>

          {/* Footer ready to sync */}
          <View className="mt-4 items-center">
            <Text className="text-xs font-manrope font-bold text-[#3686FF] dark:text-blue-400 tracking-wider">
              READY TO SYNC
            </Text>
          </View>
        </View>

        {/* Security Section Card */}
        <View className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-sm border border-secondary dark:border-slate-800 mb-6">
          <View className="flex-row items-center mb-3">
            <Shield size={20} color="#3686FF" />
            <Text className="text-lg font-manrope font-bold text-slate-800 dark:text-white ml-2.5">
              Seguridad
            </Text>
          </View>
          <Text className="text-gray-400 dark:text-gray-500 font-manrope text-sm mb-4 leading-relaxed">
            Protege tu cuenta activando la verificación de dos pasos y actualizando tu contraseña periódicamente.
          </Text>
          <TouchableOpacity 
            activeOpacity={0.8}
            className="w-full bg-[#3686FF] py-3.5 rounded-2xl items-center justify-center shadow-sm"
          >
            <Text className="text-white font-manrope font-semibold text-base">
              Cambiar Contraseña
            </Text>
          </TouchableOpacity>
        </View>

        {/* Connected Devices Card */}
        <View className="bg-white dark:bg-dark-card rounded-3xl p-6 shadow-sm border border-secondary dark:border-slate-800 mb-6">
          <View className="flex-row items-center mb-4">
            <Monitor size={20} color="#3686FF" />
            <Text className="text-lg font-manrope font-bold text-slate-800 dark:text-white ml-2.5">
              Dispositivos Conectados
            </Text>
          </View>

          {/* Device row item */}
          <View className="flex-row items-center bg-gray-50 dark:bg-[#131B2E] border border-secondary dark:border-slate-700 rounded-2xl p-4">
            <View className="w-10 h-10 bg-secondary/60 dark:bg-secondary-dark/20 rounded-xl items-center justify-center">
              <Monitor size={20} color="#3686FF" />
            </View>
            <View className="flex-1 ml-3.5">
              <Text className="text-base font-manrope font-semibold text-slate-800 dark:text-white">
                Windows - Chrome
              </Text>
              <View className="flex-row items-center mt-1">
                <View className="w-2 h-2 bg-green-500 rounded-full" />
                <Text className="text-[10px] font-manrope font-bold text-green-500 ml-1.5 uppercase">
                  ACTIVO AHORA
                </Text>
                
                {/* Current device badge */}
                <View className="ml-3 px-2 py-1 border border-[#3686FF]/50 bg-[#3686FF]/5 rounded-md">
                  <Text className="text-[8px] font-manrope font-bold text-[#3686FF]">
                    ESTE DISPOSITIVO
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Danger Zone Card */}
        <View className="bg-red-50/50 dark:bg-red-950/10 border border-red-200 dark:border-red-500/40 rounded-3xl p-6 mb-6">
          <View className="flex-row items-center mb-3">
            <AlertTriangle size={20} color="#ef4444" />
            <Text className="text-lg font-manrope font-bold text-red-650 dark:text-red-400 ml-2.5">
              Danger Zone
            </Text>
          </View>
          <Text className="text-gray-500 dark:text-gray-400 font-manrope text-sm mb-4 leading-relaxed">
            Se borrará toda la información relacionada con tu agenda universitaria. Esta acción es irreversible.
          </Text>
          <TouchableOpacity 
            activeOpacity={0.8}
            className="w-full bg-white dark:bg-transparent border border-red-500 dark:border-red-400 py-3.5 rounded-2xl items-center justify-center"
          >
            <Text className="text-red-500 dark:text-red-400 font-manrope font-bold text-base">
              Eliminar Cuenta
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
