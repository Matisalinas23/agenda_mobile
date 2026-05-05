import { Calendar, Edit3, Trash2, Check, X } from 'lucide-react-native';
import { Text, TouchableOpacity, View, TextInput, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import type { INote, ICreateNote } from '../interfaces/notes.interface';

interface NoteCardProps {
  note: INote;
  onDelete: (id: number) => void;
  onEdit: (id: number, note: ICreateNote) => Promise<void>;
}

export default function NoteCard({ note, onDelete, onEdit }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // States for editing
  const [title, setTitle] = useState(note.title);
  const [description, setDescription] = useState(note.description);
  
  // Format limitDate for input "YYYY-MM-DD"
  const dateObj = new Date(note.limitDate);
  const formattedDateInit = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
  const [limitDate, setLimitDate] = useState(formattedDateInit);

  // Formatear fecha simple para visualización
  const formattedDateView = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updatedNote: ICreateNote = {
        title,
        description,
        limitDate,
        assignature: note.assignature,
        color: note.color,
      };
      await onEdit(note.id, updatedNote);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle(note.title);
    setDescription(note.description);
    setLimitDate(formattedDateInit);
    setIsEditing(false);
  };

  // Lógica de colores para la fecha
  const getDueDateStatus = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const limit = new Date(note.limitDate);
    limit.setHours(0, 0, 0, 0);
    
    const diffTime = limit.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 3) return { color: '#ef4444', bg: '#fee2e2', text: 'Urgente' }; // Rojo pastel
    if (diffDays <= 7) return { color: '#f97316', bg: '#ffedd5', text: 'Próximo' }; // Naranja pastel
    return { color: '#22c55e', bg: '#dcfce7', text: 'Pendiente' }; // Verde pastel
  };

  const status = getDueDateStatus();

  if (isEditing) {
    return (
      <View className="bg-white rounded-3xl p-5 mb-4 shadow-md border-2 border-primary/20">
        <View className="flex-row justify-between items-start mb-3">
          <View className="px-3 py-1 rounded-full" style={{ backgroundColor: note.color + '20' }}>
            <Text className="font-manrope font-bold text-xs" style={{ color: note.color }}>
              {note.assignature.toUpperCase()}
            </Text>
          </View>
          <View className="flex-row gap-2">
            <TouchableOpacity onPress={handleCancel} disabled={isLoading} className="p-2 bg-gray-100 rounded-full">
              <X size={18} color="#64748b" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} disabled={isLoading} className="p-2 bg-primary/20 rounded-full">
              {isLoading ? <ActivityIndicator size="small" color="#3686FF" /> : <Check size={18} color="#3686FF" />}
            </TouchableOpacity>
          </View>
        </View>

        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Título"
          className="text-xl font-manrope font-bold text-primary-dark mb-2 border-b border-gray-200 pb-1"
        />
        
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Descripción"
          multiline
          className="text-gray-600 font-manrope text-sm mb-4 border-b border-gray-200 pb-1"
        />

        <View className="flex-row items-center pt-3 border-t border-secondary/50">
          <Calendar size={16} color="#94a3b8" />
          <TextInput
            value={limitDate}
            onChangeText={setLimitDate}
            placeholder="YYYY-MM-DD"
            className="text-gray-500 font-manrope text-xs ml-2 border-b border-gray-200 flex-1 py-0"
          />
        </View>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-3xl p-5 mb-4 shadow-sm border border-secondary">
      <View className="flex-row justify-between items-start mb-3">
        <View
          className="px-3 py-1 rounded-full"
          style={{ backgroundColor: note.color + '20' }} // 20 es para opacidad en hex
        >
          <Text className="font-manrope font-bold text-xs" style={{ color: note.color }}>
            {note.assignature.toUpperCase()}
          </Text>
        </View>
        <View className="flex-row gap-2">
          <TouchableOpacity onPress={() => setIsEditing(true)} className="p-2 bg-secondary/30 rounded-full">
            <Edit3 size={18} color="#3686FF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(note.id)} className="p-2 bg-red-50 rounded-full">
            <Trash2 size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      <Text className="text-xl font-manrope font-bold text-primary-dark mb-2">
        {note.title}
      </Text>

      <Text className="text-gray-500 font-manrope text-sm mb-4" numberOfLines={2}>
        {note.description}
      </Text>

      <View className="flex-row items-center justify-between pt-3 border-t border-secondary/50">
        <View className="flex-row items-center">
          <Calendar size={16} color={status.color} />
          <Text 
            className="font-manrope text-xs ml-2 font-semibold"
            style={{ color: status.color }}
          >
            Entrega: {formattedDateView}
          </Text>
        </View>
        <View 
          className="px-2 py-0.5 rounded-lg"
          style={{ backgroundColor: status.bg }}
        >
          <Text className="text-[10px] font-manrope font-bold" style={{ color: status.color }}>
            {status.text.toUpperCase()}
          </Text>
        </View>
      </View>
    </View>
  );
}
