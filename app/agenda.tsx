import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView, RefreshControl } from 'react-native';
import { Plus, LogOut, LayoutGrid } from 'lucide-react-native';
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
    router.replace('/');
  };

  const handleAddNote = async (formValues: any) => {
    if (payload?.id) {
      await createNote(payload.id, formValues);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background pt-8">
      <View className="px-6 pt-4 pb-2 flex-row justify-between items-center">
        <View>
          <Text className="text-gray-500 font-manrope text-sm">Mi Agenda</Text>
          <Text className="text-2xl font-manrope font-bold text-primary-dark">
            Hola, {payload?.username || 'Usuario'}
          </Text>
        </View>
        <TouchableOpacity 
          onPress={handleLogout}
          className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm border border-secondary"
        >
          <LogOut size={22} color="#ef4444" />
        </TouchableOpacity>
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
