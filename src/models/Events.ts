export interface TakeActionPayload {
    entity_id: 'string'
}

export interface ActionResultsPayload {
    code: number
    message: string
}

export interface NewMessagePayload {
    message: string
}

export interface BattleEndedPayload {
    battle_result: string
}

export interface RoundUpdatePayload {
    round_number: string
}
