export interface ShortLobbyInformation {
    name: string
    isGm: boolean
    _id: string
    characters: Array<string>
}

export interface iUserAvatarInDB {
    preferred: 'static' | 'generated'
    url: string
    generated: {
        pattern: string
        mainColor: string
        secondaryColor: string
    }
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
