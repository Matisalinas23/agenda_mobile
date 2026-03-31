import type { INote } from "./notes.interface"

export interface ILoginUser {
    email: string
    password: string
}

export interface IRegisterUser extends ILoginUser {
    username: string
}

export interface IUser extends IRegisterUser {
    id: number
    createdAt: Date
    notes: INote[]
}
