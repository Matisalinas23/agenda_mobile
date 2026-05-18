import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useEffect } from 'react';
import useAuthStore from '../store/useAuthStore';

export default function HomeScreen() {
  const isToken = useAuthStore((state) => state.isToken);
  const payload = useAuthStore((state) => state.payload);

  useEffect(() => {
    if (isToken && payload) {
      router.replace('/agenda');
    }
  }, [isToken, payload]);

  return (
    <View className="flex-1 bg-background dark:bg-dark-bg justify-center items-center px-6">
      <View className="w-full bg-white dark:bg-dark-card p-8 rounded-3xl shadow-sm border border-secondary dark:border-slate-700 items-center">
        <Text className="text-3xl font-manrope font-bold text-primary-dark dark:text-white mb-2">
          Mi Agenda
        </Text>
        
        {isToken && payload ? (
          <>
            <Text className="text-center text-gray-500 dark:text-gray-400 font-manrope mb-8">
              Bienvenido de nuevo, <Text className="font-bold text-primary dark:text-blue-400">{payload.username}</Text>
            </Text>
            <TouchableOpacity 
              onPress={() => router.push('/agenda')} // Ahora a la agenda
              className="bg-primary w-full py-4 rounded-2xl items-center shadow-sm"
            >
              <Text className="text-white font-manrope font-semibold text-lg">
                Ver mi Agenda
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text className="text-center text-gray-500 dark:text-gray-400 font-manrope mb-8">
              Tu agenda personal ahora en tu dispositivo móvil con una experiencia premium.
            </Text>

            <TouchableOpacity 
              onPress={() => router.push('/login')}
              className="bg-primary w-full py-4 rounded-2xl items-center shadow-sm"
            >
              <Text className="text-white font-manrope font-semibold text-lg">
                Empezar
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

