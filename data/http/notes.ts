import type { ICreateNote, INote } from "../../interfaces/notes.interface"
import api from "./axios"

const notesUrl = "/notes"

export const getAllNotesHttp = async (): Promise<INote[]> => {
    try {
        const res = await api.get(notesUrl)
        return res.data
    } catch (error) {
        console.error("Error fetching notes", error)
        throw error
    }
}

export const createNoteHttp = async (formValues: ICreateNote, userId: number): Promise<INote> => {
    const { assignature, title, description, color, limitDate } = formValues;
    const [year, month, day] = limitDate.split("-").map(Number);

    try {
        const res = await api.post(`${notesUrl}/${userId}`, {
            title,
            assignature,
            description,
            color,
            limitDate: new Date(year, month - 1, day)
        })
        return res.data
    } catch (error: any) {
        console.error("Error creating a note", error.response?.data || error.message)
        throw error
    }
}

export const updateNoteHttp = async (id: number, updatedNote: ICreateNote): Promise<INote> => {
    const { assignature, title, description, color, limitDate } = updatedNote;
    const [year, month, day] = limitDate.split("-").map(Number);

    try {
        const res = await api.put(`${notesUrl}/${id}`, {
            assignature,
            title,
            description,
            color,
            limitDate: new Date(year, month - 1, day)
        })
        return res.data
    } catch (error) {
        console.error("Error updating note", error)
        throw error
    }
}

export const deleteNoteHttp = async (id: number): Promise<INote> => {
    try {
        const res = await api.delete(`${notesUrl}/${id}`)
        return res.data.note
    } catch (error) {
        console.error("Error deleting note", error)
        throw error
    }
}

export const orderNotesByDateHttp = async (userId: number): Promise<INote[]> => {
    try {
        const res = await api.get(`${notesUrl}/${userId}/orderByDate`)
        return res.data
    } catch (error) {
        console.error("Error ordering notes by date", error)
        throw error
    }
}
