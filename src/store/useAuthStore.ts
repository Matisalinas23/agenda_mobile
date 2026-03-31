import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { IPayloadAuth } from "../interfaces/auth.interface";

interface IUseAuthStore {
    isToken: boolean;
    token: string | null;
    payload: IPayloadAuth | null;
    isReady: boolean;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
    setPayload: (payload: IPayloadAuth) => void;
    checkAuth: () => Promise<void>;
}

const useAuthStore = create<IUseAuthStore>((set) => ({
    token: null,
    isToken: false,
    payload: null,
    isReady: false,
    login: async (token: string) => {
        await AsyncStorage.setItem("token", token);
        set({ token, isToken: true });
    },
    logout: async () => {
        await AsyncStorage.removeItem("token");
        set({ token: null, isToken: false, payload: null });
    },
    setPayload: (payload: IPayloadAuth) => {
        set({ payload });
    },
    checkAuth: async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            set({ token, isToken: !!token, isReady: true });
        } catch (error) {
            set({ token: null, isToken: false, isReady: true });
        }
    }
}));

export default useAuthStore;
