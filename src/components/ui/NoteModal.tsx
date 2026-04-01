import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, Platform, Alert, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ICreateNote, INote } from '../../interfaces/notes.interface';

interface Props {
    visible: boolean;
    onClose: () => void;
    onSave: (note: ICreateNote, id?: number) => Promise<void>;
    initialData?: INote | null;
}

const COLORS = ['#fbbf24', '#f87171', '#a78bfa', '#34d399', '#60a5fa', '#f472b6'];

export default function NoteModal({ visible, onClose, onSave, initialData }: Props) {
    const [title, setTitle] = useState('');
    const [assignature, setAssignature] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState(COLORS[0]);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            if (initialData) {
                setTitle(initialData.title);
                setAssignature(initialData.assignature);
                setDescription(initialData.description);
                setColor(initialData.color || COLORS[0]);
                
                const parsedDate = new Date(initialData.limitDate);
                setDate(isNaN(parsedDate.getTime()) ? new Date() : parsedDate);
            } else {
                setTitle('');
                setAssignature('');
                setDescription('');
                setColor(COLORS[0]);
                setDate(new Date());
            }
        }
    }, [visible, initialData]);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) setDate(selectedDate);
    };

    const submit = async () => {
        if (!title || !assignature) {
            Alert.alert("Error", "El título y la asignatura son obligatorios.");
            return;
        }

        setLoading(true);
        // Format completo ISO-8601: YYYY-MM-DDTHH:mm:ss.SSSZ
        const formattedDate = date.toISOString();

        const payload: ICreateNote = {
            title,
            assignature,
            description,
            color,
            limitDate: formattedDate
        };

        try {
            await onSave(payload, initialData?.id);
            onClose();
        } catch (error) {
            Alert.alert("Error", "No se pudo guardar la nota.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <ScrollView keyboardShouldPersistTaps="handled">
                        <Text style={styles.headerTitle}>{initialData ? 'Editar Nota' : 'Añadir Nota'}</Text>
                        
                        <TextInput 
                            style={styles.input} 
                            placeholder="Asignatura" 
                            placeholderTextColor="#9ca3af"
                            value={assignature}
                            onChangeText={setAssignature}
                        />

                        <TextInput 
                            style={styles.input} 
                            placeholder="Título" 
                            placeholderTextColor="#9ca3af"
                            value={title}
                            onChangeText={setTitle}
                        />

                        <TextInput 
                            style={[styles.input, { height: 80, textAlignVertical: 'top' }]} 
                            placeholder="Descripción" 
                            placeholderTextColor="#9ca3af"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                        />

                        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                            <Text style={styles.dateLabel}>Fecha límite:</Text>
                            <Text style={styles.dateValue}>{date.toLocaleDateString()}</Text>
                        </TouchableOpacity>

                        {showDatePicker && (
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
                            />
                        )}

                        <Text style={styles.colorLabel}>Color:</Text>
                        <View style={styles.colorsContainer}>
                            {COLORS.map(c => (
                                <TouchableOpacity 
                                    key={c}
                                    style={[styles.colorCircle, { backgroundColor: c }, color === c && styles.selectedColor]}
                                    onPress={() => setColor(c)}
                                />
                            ))}
                        </View>

                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onClose} disabled={loading}>
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveBtn} onPress={submit} disabled={loading}>
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>Guardar</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContainer: { width: '90%', maxHeight: '80%', backgroundColor: '#1f2937', borderRadius: 20, padding: 25 },
    headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { backgroundColor: '#374151', color: '#fff', borderRadius: 10, padding: 12, marginBottom: 15, fontSize: 16 },
    dateButton: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#374151', padding: 15, borderRadius: 10, marginBottom: 15 },
    dateLabel: { color: '#9ca3af', fontSize: 16 },
    dateValue: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    colorLabel: { color: '#9ca3af', marginBottom: 10, fontSize: 16 },
    colorsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    colorCircle: { width: 40, height: 40, borderRadius: 20 },
    selectedColor: { borderWidth: 3, borderColor: '#fff' },
    footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    cancelBtn: { flex: 1, padding: 15, borderRadius: 10, backgroundColor: '#4b5563', marginRight: 10, alignItems: 'center' },
    cancelText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    saveBtn: { flex: 1, padding: 15, borderRadius: 10, backgroundColor: '#3b82f6', marginLeft: 10, alignItems: 'center' },
    saveText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
