export interface IPayloadAuth {
    id: number
    email: string
    verified: boolean
    username: string
    profileImage: string | null
    deleteAfter: string | null
    iat: number
    exp: number
}
