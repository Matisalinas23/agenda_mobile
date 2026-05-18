import { create } from "zustand"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { IPayloadAuth } from "../interfaces/auth.interface"

import { ILoginUser } from "../interfaces/user.interface"

interface IAuthStore {
    isToken: boolean,
    token: string | null,
    payload: IPayloadAuth | null,
    login: (token: string) => Promise<void>,
    loginWithGoogle: () => Promise<void>,
    logout: () => Promise<void>,
    setPayload: (payload: IPayloadAuth) => void,
    initialize: () => Promise<void>,
}

const useAuthStore = create<IAuthStore>((set, get) => ({
    token: null,
    isToken: false,
    payload: null,

    initialize: async () => {
        const token = await AsyncStorage.getItem("token")
        if (token) {
            set({ token, isToken: true })
            try {
                const { authMeHttp } = await import("../data/http/auth");
                const userPayload = await authMeHttp();
                set({ payload: userPayload });
            } catch (error) {
                console.error("Error restoring session payload", error);
                // If fetching payload fails (token expired), clear session
                set({ token: null, isToken: false, payload: null });
                await AsyncStorage.removeItem("token");
            }
        }
    },

    login: async (newToken: string) => {
        await AsyncStorage.setItem("token", newToken)
        set({ token: newToken, isToken: true })
        try {
            const { authMeHttp } = await import("../data/http/auth");
            const userPayload = await authMeHttp();
            set({ payload: userPayload });
        } catch (error) {
            console.error("Error fetching payload after login", error);
        }
    },

    loginWithGoogle: async () => {
        try {
            const { getGoogleAuthUrlHttp } = await import("../data/http/auth");
            const WebBrowser = await import("expo-web-browser");
            const Linking = await import("expo-linking");

            // Define the redirect URL back to the app
            const redirectUrl = Linking.createURL("login");
            console.log("MOBILE - Redirect URL generated:", redirectUrl);

            const { url } = await getGoogleAuthUrlHttp(redirectUrl);
            console.log("MOBILE - Auth URL received:", url);

            const result = await WebBrowser.openAuthSessionAsync(url, redirectUrl);
            console.log("MOBILE - Auth Session Result:", result);

            if (result.type === 'success' && result.url) {
                const urlObj = new URL(result.url);
                const token = urlObj.searchParams.get('token');
                
                if (token) {
                    await get().login(token);
                } else {
                    console.error("No token found in redirect URL");
                }
            }
        } catch (error) {
            console.error("Error signing in with Google:", error);
        }
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
