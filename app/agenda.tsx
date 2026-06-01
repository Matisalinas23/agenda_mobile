import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView, RefreshControl, Image, Modal } from 'react-native';
import { Plus, LogOut, LayoutGrid, User, Settings, Moon, Sun } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { router } from 'expo-router';
import useAuthStore from '../store/useAuthStore';
import useNoteStore from '../store/useNoteStore';
import NoteCard from '../components/NoteCard';
import AddNoteModal from '../components/AddNoteModal';

export default function AgendaScreen() {
  const payload = useAuthStore((state) => state.payload);
  const logout = useAuthStore((state) => state.logout);
  const { notes, isLoading, fetchNotes, deleteNote, updateNote, createNote } = useNoteStore();
  const [refreshing, setRefreshing] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isUserMenuVisible, setIsUserMenuVisible] = useState(false);
  const { colorScheme, toggleColorScheme } = useColorScheme();

  useEffect(() => {
    if (payload?.id) {
      fetchNotes(payload.id);
    }
  }, [payload]);

  const onRefresh = async () => {
    if (payload?.id) {
      setRefreshing(true);
      await fetchNotes(payload.id);
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const handleAddNote = async (formValues: any) => {
    if (payload?.id) {
      await createNote(payload.id, formValues);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-dark-bg pt-8">
      <View className="px-6 py-2 flex-row justify-between items-center z-10">
        <View>
          <Text className="text-gray-500 dark:text-gray-400 font-manrope text-sm">Mi Agenda</Text>
          <Text className="text-[18px] font-manrope font-bold text-primary-dark dark:text-white">
            {payload?.username || 'Usuario'}
          </Text>
        </View>
        <TouchableOpacity 
          onPress={() => setIsUserMenuVisible(true)}
          className="w-12 h-12 bg-white dark:bg-dark-card rounded-full items-center justify-center shadow-sm border border-secondary dark:border-slate-700 overflow-hidden"
        >
          {payload?.profileImage ? (
            <Image source={{ uri: payload.profileImage }} className="w-full h-full" />
          ) : (
            <User size={22} color={colorScheme === 'dark' ? '#94a3b8' : '#1e293b'} />
          )}
        </TouchableOpacity>

        {/* Menú de Usuario Desplegable */}
        <Modal
          visible={isUserMenuVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsUserMenuVisible(false)}
        >
          <TouchableOpacity 
            className="flex-1 bg-black/5"
            activeOpacity={1}
            onPress={() => setIsUserMenuVisible(false)}
          >
            <View className="absolute top-20 right-6 bg-white dark:bg-dark-card rounded-2xl shadow-xl w-52 overflow-hidden border border-secondary dark:border-slate-700">
              <TouchableOpacity 
                className="flex-row items-center px-4 py-4 border-b border-secondary/50 dark:border-slate-700"
                onPress={() => {
                  toggleColorScheme();
                  // Opcional: setIsUserMenuVisible(false) si quieres que se cierre, 
                  // pero es mejor dejarlo abierto para ver el cambio
                }}
              >
                {colorScheme === 'dark' ? (
                  <Sun size={20} color="#f59e0b" />
                ) : (
                  <Moon size={20} color="#64748b" />
                )}
                <Text className="font-manrope font-semibold text-primary-dark dark:text-white ml-3">
                  Modo {colorScheme === 'dark' ? 'Claro' : 'Oscuro'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                className="flex-row items-center px-4 py-4 border-b border-secondary/50 dark:border-slate-700"
                onPress={() => {
                  setIsUserMenuVisible(false);
                  router.push('/profile');
                }}
              >
                <Settings size={20} color="#64748b" />
                <Text className="font-manrope font-semibold text-primary-dark dark:text-white ml-3">Cuenta</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-row items-center px-4 py-4 bg-red-50/30 dark:bg-red-950/20"
                onPress={() => {
                  setIsUserMenuVisible(false);
                  handleLogout();
                }}
              >
                <LogOut size={20} color="#ef4444" />
                <Text className="font-manrope font-semibold text-red-500 ml-3">Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <NoteCard 
            note={item} 
            onDelete={deleteNote} 
            onEdit={updateNote} 
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100, paddingTop: 20 }}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center py-20">
              <LayoutGrid size={60} color="#cbd5e1" strokeWidth={1} />
              <Text className="text-gray-400 font-manrope mt-4 text-center">
                No tienes notas todavía.{"\n"}¡Comienza a organizar tu día!
              </Text>
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3686FF" />
        }
      />

      <AddNoteModal 
        isVisible={isAddModalVisible} 
        onClose={() => setIsAddModalVisible(false)} 
        onSave={handleAddNote}
      />

      {isLoading && !refreshing && (
        <View className="absolute inset-0 items-center justify-center bg-background/50">
          <ActivityIndicator size="large" color="#3686FF" />
        </View>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity 
        className="absolute bottom-16 right-6 w-16 h-16 bg-primary rounded-full items-center justify-center shadow-xl"
        onPress={() => setIsAddModalVisible(true)}
      >
        <Plus size={32} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
