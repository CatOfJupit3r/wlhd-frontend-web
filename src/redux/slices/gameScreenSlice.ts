import { Battlefield, EntityInfoFull, GameStateContainer } from '@models/Battlefield'
import { GameHandshake, IndividualTurnOrder } from '@models/GameHandshake'
import { GameScreenState } from '@models/Redux'
import { RootState } from '@redux/store'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: GameScreenState = {
    battlefield: {
        pawns: (() => {
            const pawns: Battlefield['pawns'] = {}
            for (let i = 0; i < 6; i++) {
                for (let j = 0; j < 6; j++) {
                    pawns[`${i + 1}/${j + 1}`] = {
                        character: null,
                        areaEffects: [],
                    }
                }
            }
            return pawns
        })(),
    },
    actions: null,
    round: {
        current: '0',
        order: {
            order: [],
            current: null,
        },
    },
    messages: [],
    gameFlow: {
        type: 'pending',
        details: '',
    },
    controlledEntities: null,
    yourTurn: false,
}
const GameScreenSlice = createSlice({
    name: 'gameScreen',
    initialState,
    reducers: {
        reset: () => {
            return initialState
        },
        setRound: (state, action: PayloadAction<string>) => {
            state.round.current = action.payload
        },
        setBattlefield: (state, action: PayloadAction<Battlefield>) => {
            state.battlefield = action.payload
        },
        setActions: (state, action: PayloadAction<GameScreenState['actions']>) => {
            state.actions = action.payload
        },
        setYourTurn: (state, action: PayloadAction<boolean>) => {
            state.yourTurn = action.payload
        },
        haltActions: (state) => {
            state.actions = null
            state.yourTurn = false
        },
        fromHandshake: (state, action: PayloadAction<GameHandshake>) => {
            return {
                ...state,
                ...initialState,
                battlefield: action.payload.currentBattlefield,
                round: {
                    current: action.payload.roundCount,
                    order: action.payload.turnOrder,
                },
                messages: action.payload.messages,
                controlledEntities: action.payload.controlledEntities,
                gameFlow: {
                    type: action.payload.combatStatus === 'pending' ? 'pending' : 'active',
                    details: '',
                },
            }
        },
        addMessage: (state, action: PayloadAction<GameStateContainer[number]>) => {
            state.messages.push(action.payload)
        },
        setControlledEntities: (state, action: PayloadAction<Array<EntityInfoFull> | null>) => {
            state.controlledEntities = action.payload
        },
        setMessages: (state, action: PayloadAction<GameStateContainer>) => {
            state.messages = action.payload
        },
        setTurnOrder: (state, action: PayloadAction<IndividualTurnOrder>) => {
            state.round.order = action.payload
        },
        resetActiveEntity: (state) => {
            state.round.order.current = initialState.round.order.current
        },
        setFlowToActive: (state) => {
            state.gameFlow = {
                type: 'active',
                details: '',
            }
        },
        setFlowToPending: (state) => {
            state.gameFlow = {
                type: 'pending',
                details: '',
            }
        },
        setFlowToEnded: (state, action: PayloadAction<string>) => {
            state.gameFlow = {
                type: 'ended',
                details: action.payload,
            }
        },
        setFlowToAborted: (state, action: PayloadAction<string>) => {
            state.gameFlow = {
                type: 'aborted',
                details: action.payload,
            }
        },
    },
})
export default GameScreenSlice.reducer
export const {
    setRound,
    setFlowToEnded,
    setFlowToActive,
    setFlowToPending,
    setFlowToAborted,
    setBattlefield,
    setActions,
    addMessage,
    setMessages,
    resetActiveEntity,
    setControlledEntities,
    setTurnOrder,
    reset: resetGameScreenSlice,
    setYourTurn,
    haltActions,
    fromHandshake: setGameScreenSliceFromHandshake,
} = GameScreenSlice.actions

export const selectCurrentRoundCount = (state: RootState) => state.gameScreen.round.current
export const selectAllMessages = (state: RootState) => state.gameScreen.messages
export const selectGameFlow = (state: RootState) => state.gameScreen.gameFlow
export const selectControlledEntities = (state: RootState) => state.gameScreen.controlledEntities
export const selectTurnOrder = (state: RootState) => state.gameScreen.round.order
export const selectBattlefield = (state: RootState) => state.gameScreen.battlefield
export const selectActions = (state: RootState) => state.gameScreen.actions
export const selectIsYourTurn = (state: RootState) => state.gameScreen.yourTurn

export const selectActiveEntity = createSelector([(state: RootState) => state.gameScreen.round.order], (turnOrder) => {
    if (turnOrder.current === null) {
        return null
    } else {
        return turnOrder.order[turnOrder.current] || null
    }
})
export const selectActionAliases = createSelector([(state: RootState) => state.gameScreen.actions], (actions) => {
    if (actions === null || actions.aliases === undefined) {
        return null
    } else {
        return actions.aliases
    }
})
export const selectActionAliasTranslations = createSelector(
    [(state: RootState) => state.gameScreen.actions],
    (actions) => {
        if (actions === null || actions.alias_translations === undefined) {
            return null
        } else {
            return actions.alias_translations
        }
    }
)
