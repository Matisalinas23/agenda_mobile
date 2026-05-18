import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { X, Calendar, BookOpen, Type, AlignLeft } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import type { ICreateNote } from '../interfaces/notes.interface';

interface AddNoteModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (formValues: ICreateNote) => Promise<void>;
}

const colors = [
  { code: "#FF8989", name: "Rojo" },
  { code: "#FFAA74", name: "Naranja intenso" },
  { code: "#FFCF81", name: "Naranja" },
  { code: "#F6E878", name: "Amarillo" },
  { code: "#D1F392", name: "Verde manzana" },
  { code: "#87EEA6", name: "Verde esmeralda" },
  { code: "#95F5F5", name: "Azul turquesa" },
  { code: "#8CADFE", name: "Azul francia" },
  { code: "#C79EF3", name: "Morado" },
  { code: "#E7A1EA", name: "Fucsia" },
  { code: "#FFB8E9", name: "Rosado" },
  { code: "#B8B8B8", name: "Gris claro" },
  { code: "#6B6B6B", name: "Gris oscuro" },
];

export default function AddNoteModal({ isVisible, onClose, onSave }: AddNoteModalProps) {
  const { colorScheme } = useColorScheme();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<ICreateNote>({
    title: '',
    assignature: '',
    description: '',
    color: colors[0].code,
    limitDate: new Date().toISOString().split('T')[0], // Default today
  });

  const handleSave = async () => {
    if (!form.title || !form.assignature || !form.limitDate) {
      Alert.alert('Campos incompletos', 'Por favor rellena al menos el título, asignatura y fecha.');
      return;
    }

    setIsLoading(true);
    try {
      await onSave(form);
      setForm({
        title: '',
        assignature: '',
        description: '',
        color: colors[0].code,
        limitDate: new Date().toISOString().split('T')[0],
      });
      onClose();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo crear la nota. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white dark:bg-dark-card rounded-t-[40px] px-6 pt-8 pb-10 shadow-xl">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-8">
              <Text className="text-2xl font-manrope font-bold text-primary-dark dark:text-white">
                Nueva Nota
              </Text>
              <TouchableOpacity onPress={onClose} className="p-2 bg-secondary/50 dark:bg-slate-800 rounded-full">
                <X size={24} color={colorScheme === 'dark' ? '#cbd5e1' : '#1e293b'} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="space-y-6">
              {/* Asignatura */}
              <View>
                <Text className="text-primary-dark dark:text-gray-300 font-manrope font-semibold mb-2 ml-1">Asignatura</Text>
                <View className="flex-row items-center bg-gray-50 dark:bg-dark-card border border-secondary dark:border-slate-700 rounded-2xl px-4 py-1">
                  <BookOpen size={20} color="#94a3b8" />
                  <TextInput
                    value={form.assignature}
                    onChangeText={(val) => setForm({ ...form, assignature: val })}
                    placeholder="Ej: Matemáticas"
                    placeholderTextColor={colorScheme === 'dark' ? '#64748b' : undefined}
                    className="flex-1 h-12 ml-3 font-manrope text-primary-dark dark:text-white"
                  />
                </View>
              </View>

              {/* Título */}
              <View className="mt-4">
                <Text className="text-primary-dark dark:text-gray-300 font-manrope font-semibold mb-2 ml-1">Título</Text>
                <View className="flex-row items-center bg-gray-50 dark:bg-dark-card border border-secondary dark:border-slate-700 rounded-2xl px-4 py-1">
                  <Type size={20} color="#94a3b8" />
                  <TextInput
                    value={form.title}
                    onChangeText={(val) => setForm({ ...form, title: val })}
                    placeholder="Ej: Estudiar para el parcial"
                    placeholderTextColor={colorScheme === 'dark' ? '#64748b' : undefined}
                    className="flex-1 h-12 ml-3 font-manrope text-primary-dark dark:text-white"
                  />
                </View>
              </View>

              {/* Fecha */}
              <View className="mt-4">
                <Text className="text-primary-dark dark:text-gray-300 font-manrope font-semibold mb-2 ml-1">Fecha Límite</Text>
                <View className="flex-row items-center bg-gray-50 dark:bg-dark-card border border-secondary dark:border-slate-700 rounded-2xl px-4 py-1">
                  <Calendar size={20} color="#94a3b8" />
                  <TextInput
                    value={form.limitDate}
                    onChangeText={(val) => setForm({ ...form, limitDate: val })}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={colorScheme === 'dark' ? '#64748b' : undefined}
                    className="flex-1 h-12 ml-3 font-manrope text-primary-dark dark:text-white"
                  />
                </View>
              </View>

              {/* Descripción */}
              <View className="mt-4">
                <Text className="text-primary-dark dark:text-gray-300 font-manrope font-semibold mb-2 ml-1">Descripción (opcional)</Text>
                <View className="flex-row bg-gray-50 dark:bg-dark-card border border-secondary dark:border-slate-700 rounded-2xl px-4 py-3 min-h-[100px]">
                  <AlignLeft size={20} color="#94a3b8" />
                  <TextInput
                    value={form.description}
                    onChangeText={(val) => setForm({ ...form, description: val })}
                    placeholder="Escribe aquí los detalles..."
                    placeholderTextColor={colorScheme === 'dark' ? '#64748b' : undefined}
                    multiline
                    className="flex-1 ml-3 font-manrope text-primary-dark dark:text-white text-start"
                    textAlignVertical="top"
                  />
                </View>
              </View>

              {/* Selector de Color */}
              <View className="mt-6 mb-8">
                <Text className="text-primary-dark dark:text-gray-300 font-manrope font-semibold mb-3 ml-1">Color de la Nota</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                  {colors.map((c) => (
                    <TouchableOpacity
                      key={c.code}
                      onPress={() => setForm({ ...form, color: c.code })}
                      style={{ 
                        backgroundColor: c.code,
                        width: 38,
                        height: 38,
                        borderRadius: 19,
                        marginRight: 12,
                        borderWidth: form.color === c.code ? 3 : 0,
                        borderColor: '#3686FF'
                      }}
                      className="shadow-sm"
                    />
                  ))}
                </ScrollView>
              </View>

              {/* Botón Guardar */}
              <TouchableOpacity 
                onPress={handleSave}
                disabled={isLoading}
                className="bg-primary w-full py-4 rounded-2xl items-center shadow-lg mb-4"
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-manrope font-bold text-lg">
                    Crear Nota
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
