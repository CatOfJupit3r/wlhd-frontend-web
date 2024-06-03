export interface CharacterInfo {
    descriptor: string
    decorations: {
        name: string
        description: string
        sprite: string
    }
    controlledBy: Array<string> | null
    attributes: {
        [key: string]: string
    }
    spellBook: Array<{
        descriptor: string
        conflictsWith: Array<string>
        requiresToUse: Array<string>
    }>
    spellLayout: Array<string>
    inventory: Array<{
        descriptor: string
        count: number
    }>
    weaponry: Array<{
        descriptor: string
        count: number
    }>
}
