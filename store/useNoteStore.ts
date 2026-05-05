import { create } from "zustand"
import type { ICreateNote, INote } from "../interfaces/notes.interface"
import { orderNotesByDateHttp, deleteNoteHttp, updateNoteHttp, createNoteHttp } from "../data/http/notes"

interface INoteStore {
    notes: INote[] | null
    isLoading: boolean
    fetchNotes: (userId: number) => Promise<void>
    deleteNote: (id: number) => Promise<void>
    setNotes: (notes: INote[]) => void
    updateNote: (id: number, formValues: ICreateNote) => Promise<void>
    createNote: (userId: number, formValues: ICreateNote) => Promise<void>
}

const useNoteStore = create<INoteStore>((set) => ({
    notes: null,
    isLoading: false,

    fetchNotes: async (userId: number) => {
        set({ isLoading: true })
        try {
            const data = await orderNotesByDateHttp(userId)
            set({ notes: data })
        } catch (error) {
            console.error(error)
        } finally {
            set({ isLoading: false })
        }
    },

    deleteNote: async (id: number) => {
        try {
            await deleteNoteHttp(id)
            set((state) => ({
                notes: state.notes ? state.notes.filter((n) => n.id !== id) : null
            }))
        } catch (error) {
            console.error(error)
        }
    },

    setNotes: (notes: INote[]) => set({ notes }),

    updateNote: async (id: number, formValues: ICreateNote) => {
        try {
            const updatedNote = await updateNoteHttp(id, formValues);
            set((state) => ({
                notes: state.notes ? state.notes.map((n) => n.id === id ? { ...n, ...updatedNote } : n) : []
            }))
        } catch (error) {
            console.error(error);
        }
    },

    createNote: async (userId: number, formValues: ICreateNote) => {
        try {
            const newNote = await createNoteHttp(formValues, userId);
            set((state) => ({
                notes: state.notes ? [newNote, ...state.notes] : [newNote]
            }))
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
}))

export default useNoteStore
