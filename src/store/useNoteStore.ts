import { create } from "zustand";
import type { INote } from "../interfaces/notes.interface"; 

interface INoteStore {
    notes: INote[]
    setNotes: (notes: INote[]) => void
    addNote: (note: INote) => void
    editNote: (updatedNote: INote) => void
    deleteNote: (id: number) => void
    setOrderedNotesByAssignature: (orderedNotesByAssignature: INote[]) => void
    setOrderedNotesByDate: (orderedNotesByDate: INote[]) => void
}

const useNoteStore = create<INoteStore>((set) => ({
    notes: [],
    setNotes: (notes: INote[]) => set({ notes }),
    addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
    editNote: (updatedNote) => set((state) => ({
        notes: state.notes.map((note) => note.id === updatedNote.id ? updatedNote : note)
    })),
    deleteNote: (id) => set((state) => ({
        notes: state.notes.filter((note) => note.id !== id )
    })),
    setOrderedNotesByAssignature: (orderedNotesByAssignature) => (set({ notes: orderedNotesByAssignature })),
    setOrderedNotesByDate: (orderedNotesByDate) => (set({ notes: orderedNotesByDate })),
}))

export default useNoteStore