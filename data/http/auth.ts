import type { IPayloadAuth } from "../../interfaces/auth.interface"
import type { ILoginUser, IRegisterUser, IUser } from "../../interfaces/user.interface" 
import api from "./axios"

const authUrl = "/auth"

export const loginHttp = async (loginValues: ILoginUser): Promise<string> => {
    try {
        const res = await api.post(`${authUrl}/login`, loginValues)
        return res.data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export const authMeHttp = async (): Promise<IPayloadAuth> => {
    try {
        const res = await api.get(`${authUrl}/me`)
        return res.data
    } catch (error) {
        console.error("Error fetching user data", error)
        throw error
    }
}

export const getGoogleAuthUrlHttp = async (redirectUrl: string): Promise<{ url: string }> => {
    try {
        const res = await api.get(`${authUrl}/google?redirect=${encodeURIComponent(redirectUrl)}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching Google Auth URL", error);
        throw error;
    }
}

export const logoutHttp = async () => {
    try {
        const res = await api.post(`${authUrl}/logout`);
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
