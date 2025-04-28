export const SOCKET_EVENTS = {
    BATTLE_STARTED: 'battle_started',
    ROUND_UPDATE: 'round_update',
    GAME_HANDSHAKE: 'game_handshake',
    ACTION_RESULT: 'action_result',
    BATTLE_ENDED: 'battle_ended',
    NO_CURRENT_CHARACTER: 'no_current_character',
    HALT_ACTION: 'halt_action',
    TAKE_ACTION: 'take_action',
    NEW_MESSAGE: 'new_message',
    BATTLEFIELD_UPDATE: 'battlefield_updated',
    CHARACTERS_UPDATED: 'characters_updated',
    TURN_ORDER_UPDATED: 'turn_order_updated',
    GAME_LOBBY_STATE: 'game_lobby_state',
    ERROR: 'error',
    ACTION_TIMESTAMP: 'action_timestamp',
} as const;
export type SocketEventType = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];

export const ELEVATED_RIGHTS_EVENTS = {
    TAKE_UNALLOCATED_ACTION: 'take_unallocated_action',
    // if player is not present, but GM is, then GM can take action and is notified about unallocated character.
    TAKE_OFFLINE_PLAYER_ACTION: 'take_offline_player_action',
} as const;
export type ElevatedRightsEventType = (typeof ELEVATED_RIGHTS_EVENTS)[keyof typeof ELEVATED_RIGHTS_EVENTS];

export const SOCKET_RESPONSES = {
    TAKE_ACTION: 'take_action',
    SKIP: 'skip',
} as const;
export type SocketResponseType = (typeof SOCKET_RESPONSES)[keyof typeof SOCKET_RESPONSES];

export const ELEVATED_RIGHTS_RESPONSES = {
    ALLOCATE: 'allocate',
    START_COMBAT: 'start_combat',
    END_COMBAT: 'end_combat',
    TRY_SENDING_AGAIN: 'try_sending_again', // this event used to tell server to try sending action to the player again.
} as const;
export type ElevatedRightsResponseType = (typeof ELEVATED_RIGHTS_RESPONSES)[keyof typeof ELEVATED_RIGHTS_RESPONSES];
