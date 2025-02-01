export interface ShortLobbyInformation {
    name: string
    isGm: boolean
    _id: string
    characters: Array<[string, string]>
    needsApproval: boolean
}

export interface iUserAvatarProcessed {
    type: 'static' | 'generated'
    content: string // url or base64
}

export interface UserInformation {
    handle: string
    createdAt: string
    joined: Array<string>
}
