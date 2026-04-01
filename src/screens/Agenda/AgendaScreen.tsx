import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import useAuthStore from '../../store/useAuthStore';
import useNoteStore from '../../store/useNoteStore';
import axiosInstance from '../../api/axios';
import { ICreateNote, INote } from '../../interfaces/notes.interface';
import { jwtDecode } from 'jwt-decode';
import NoteModal from '../../components/ui/NoteModal';

export default function AgendaScreen() {
    const logout = useAuthStore(state => state.logout);
    const token = useAuthStore(state => state.token);
    const { notes, setOrderedNotesByDate, addNote, editNote, deleteNote } = useNoteStore(state => state);
    const [loading, setLoading] = useState(true);
    const [menuVisible, setMenuVisible] = useState(false);

    // Modal properties
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedNote, setSelectedNote] = useState<INote | null>(null);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                // 1. Get user payload to find userId
                const meRes = await axiosInstance.get('/auth/me');
                const userId = meRes.data.user?.userId;

                if (!userId) {
                    console.error("userId not found in /auth/me response", meRes.data);
                    return;
                }

                // 2. Fetch notes for this user
                const notesRes = await axiosInstance.get(`/notes/${userId}/orderByDate`);
                setOrderedNotesByDate(notesRes.data);
            } catch (error: any) {
                console.error("Fetch Notes Error:", error.message);
                console.error("Fetch Notes URL:", error.config?.url);
                console.error("Token being used in store:", token);
                Alert.alert("Error", "No se pudieron cargar las notas.");
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, []);

    const handleSaveNote = async (payload: ICreateNote, id?: number) => {
        try {
            const meRes = await axiosInstance.get('/auth/me');
            const userId = meRes.data.user?.userId;

            if (!userId) {
                console.error("userId not found for saving note");
                throw new Error("No user ID");
            }

            if (id) {
                // Edit
                const res = await axiosInstance.put(`/notes/${id}`, payload);
                editNote(res.data);
            } else {
                // Create
                const res = await axiosInstance.post(`/notes/${userId}`, payload);
                addNote(res.data);
            }
        } catch (error) {
            throw error; // Let the modal catch it
        }
    };

    const handleDeleteNote = (id: number) => {
        Alert.alert("Eliminar Nota", "¿Estás seguro de querer eliminar esta nota?", [
            { text: "Cancelar", style: "cancel" },
            { 
                text: "Eliminar", 
                style: "destructive", 
                onPress: async () => {
                    try {
                        await axiosInstance.delete(`/notes/${id}`);
                        deleteNote(id);
                    } catch (error) {
                        Alert.alert("Error", "No se pudo eliminar la nota");
                    }
                } 
            }
        ]);
    };

    const renderNote = ({ item }: { item: INote }) => {
        const d = new Date(item.limitDate);
        const dateString = isNaN(d.getTime()) ? 'Sin fecha' : d.toLocaleDateString();

        return (
            <View style={[styles.noteCard, { borderLeftColor: item.color || '#3b82f6', borderLeftWidth: 5 }]}>
                <View style={styles.noteHeader}>
                    <Text style={styles.noteTitle}>{item.title}</Text>
                    <View style={styles.noteActions}>
                        <TouchableOpacity onPress={() => { setSelectedNote(item); setModalVisible(true); }}>
                            <Text style={styles.actionIcon}>✏️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteNote(item.id)}>
                            <Text style={styles.actionIcon}>🗑️</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.noteAssignature}>{item.assignature}</Text>
                <Text style={styles.noteDesc} numberOfLines={2}>{item.description}</Text>
                <Text style={styles.noteDate}>Límite: {dateString}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mi Agenda</Text>

                <View style={{ position: 'relative', zIndex: 10 }}>
                    <TouchableOpacity
                        style={styles.profileIcon}
                        onPress={() => setMenuVisible(!menuVisible)}
                    >
                        <Text style={styles.profileIconText}>👤</Text>
                    </TouchableOpacity>

                    {menuVisible && (
                        <View style={styles.dropdownMenu}>
                            <TouchableOpacity
                                style={styles.dropdownItem}
                                onPress={() => {
                                    setMenuVisible(false);
                                    logout();
                                }}
                            >
                                <Text style={styles.dropdownItemText}>Cerrar Sesión</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#3b82f6" />
                </View>
            ) : (
                <FlatList
                    data={notes}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderNote}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No tienes notas registradas aún.</Text>
                    }
                />
            )}

            <TouchableOpacity style={styles.fab} onPress={() => { setSelectedNote(null); setModalVisible(true); }}>
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>

            <NoteModal 
                visible={modalVisible} 
                initialData={selectedNote} 
                onClose={() => setModalVisible(false)} 
                onSave={handleSaveNote} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#111827' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
        backgroundColor: '#1f2937'
    },
    headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    profileIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#374151',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileIconText: { fontSize: 22 },
    dropdownMenu: {
        position: 'absolute',
        top: 55,
        right: 0,
        backgroundColor: '#374151',
        borderRadius: 12,
        padding: 5,
        minWidth: 160,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    dropdownItem: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    dropdownItemText: { color: '#ef4444', fontSize: 16, fontWeight: 'bold' },
    list: { padding: 20, paddingBottom: 100 },
    noteCard: {
        backgroundColor: '#1f2937',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
    },
    noteHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
    noteTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', flex: 1 },
    noteActions: { flexDirection: 'row', gap: 15 },
    actionIcon: { fontSize: 18 },
    noteAssignature: { color: '#60a5fa', fontSize: 14, marginBottom: 8 },
    noteDesc: { color: '#9ca3af', fontSize: 14, marginBottom: 10 },
    noteDate: { color: '#f87171', fontSize: 12, fontWeight: 'bold' },
    emptyText: { color: '#9ca3af', textAlign: 'center', marginTop: 50 },
    fab: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#3b82f6',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3
    },
    fabIcon: { color: '#fff', fontSize: 32, fontWeight: '300', marginTop: -2 },
});
