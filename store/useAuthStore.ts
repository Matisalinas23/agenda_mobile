import { create } from "zustand"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { IPayloadAuth } from "../interfaces/auth.interface"

interface IUseAuthStore {
    isToken: boolean,
    token: string | null,
    payload: IPayloadAuth | null,
    login: (token: string) => Promise<void>,
    logout: () => Promise<void>,
    setPayload: (payload: IPayloadAuth) => void,
    initialize: () => Promise<void>,
}

const useAuthStore = create<IUseAuthStore>((set) => ({
    token: null,
    isToken: false,
    payload: null,

    initialize: async () => {
        const token = await AsyncStorage.getItem("token")
        if (token) {
            set({ token, isToken: true })
        }
    },

    login: async (newToken: string) => {
        await AsyncStorage.setItem("token", newToken)
        set({ token: newToken, isToken: true })
    },

    logout: async () => {
        set({ token: null, isToken: false, payload: null });
        await AsyncStorage.removeItem("token");
        
        try {
            const { logoutHttp } = await import("../data/http/auth");
            await logoutHttp();
        } catch (error) {
            console.error("Error revoking session on backend", error);
        }
    },

    setPayload: (payload: IPayloadAuth) => {
        set({ payload })
    }
}))

export default useAuthStore
