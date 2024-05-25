export interface LobbyInformation {
    name: string
    isGm: boolean
    _id: string
    assignedCharacter: string | null
}

export interface UserInformation {
    handle: string
    createdAt: string
}
