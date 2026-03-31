import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import useAuthStore from '../../store/useAuthStore';
import useNoteStore from '../../store/useNoteStore';
import axiosInstance from '../../api/axios';
import { INote } from '../../interfaces/notes.interface';

export default function AgendaScreen() {
    const logout = useAuthStore(state => state.logout);
    const { notes, setOrderedNotesByDate } = useNoteStore(state => state);
    const [loading, setLoading] = useState(true);

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
            } catch (error) {
                console.error("Error fetching notes:", error);
                Alert.alert("Error", "No se pudieron cargar las notas.");
            } finally {
                setLoading(false);
            }
        };

        fetchNotes();
    }, []);

    const renderNote = ({ item }: { item: INote }) => {
        const d = new Date(item.limitDate);
        const dateString = isNaN(d.getTime()) ? 'Sin fecha' : d.toLocaleDateString();

        return (
            <View style={[styles.noteCard, { borderLeftColor: item.color || '#3b82f6', borderLeftWidth: 5 }]}>
                <Text style={styles.noteTitle}>{item.title}</Text>
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
                <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Salir</Text>
                </TouchableOpacity>
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

            <TouchableOpacity style={styles.fab} onPress={() => Alert.alert('Próximamente', 'Acá se abriría el modal para añadir nota.')}>
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>
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
    logoutButton: { backgroundColor: '#ef4444', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
    logoutText: { color: '#fff', fontWeight: 'bold' },
    list: { padding: 20, paddingBottom: 100 },
    noteCard: {
        backgroundColor: '#1f2937',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
    },
    noteTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
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
