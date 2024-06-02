export interface ShortLobbyInformation {
    name: string
    isGm: boolean
    _id: string
    characters: Array<string>
}

export interface UserInformation {
    handle: string
    createdAt: string
    joined: Array<string>
}
