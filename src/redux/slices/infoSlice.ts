import { EntityInfoFull, EntityInfoTooltip, GameStateContainer, TranslatableString } from '@models/Battlefield'
import { InfoState } from '@models/Redux'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { IndividualTurnOrder } from '@models/GameHandshake'

const initialState: InfoState = {
    round: '0',
    turnOrder: {
        order: [],
        current: null,
    },
    messages: {
        start: 0,
        end: 0,
        length: 0,
        loaded: [],
    },
    gameFlow: {
        type: 'pending',
        details: '',
    },
    entityTooltips: {},
    controlledEntities: null,
    chosenMenu: '',
}

const InfoSlice = createSlice({
    name: 'info',
    initialState,
    reducers: {
        setRound: (state, action: PayloadAction<string>) => {
            state.round = action.payload
        },
        addMessage: (state, action: PayloadAction<Array<TranslatableString>>) => {
            state.messages.loaded.push(action.payload)
        },
        setChosenMenu: (state, action: PayloadAction<string | null>) => {
            state.chosenMenu = action.payload
        },
        setEntityTooltips: (state, action: PayloadAction<{ [square: string]: EntityInfoTooltip | null }>) => {
            state.entityTooltips = action.payload
        },
        setControlledEntities: (state, action: PayloadAction<Array<EntityInfoFull> | null>) => {
            state.controlledEntities = action.payload
        },
        setMessages: (state, action: PayloadAction<GameStateContainer>) => {
            state.messages.loaded = action.payload
        },
        setTurnOrder: (state, action: PayloadAction<IndividualTurnOrder>) => {
            state.turnOrder = action.payload
        },
        resetActiveEntity: (state) => {
            state.turnOrder.current = initialState.turnOrder.current
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

export default InfoSlice.reducer

export const {
    setRound,
    addMessage,
    setChosenMenu,
    setFlowToEnded,
    setFlowToActive,
    setFlowToPending,
    setFlowToAborted,
    setMessages,
    resetActiveEntity,
    setEntityTooltips,
    setControlledEntities,
    setTurnOrder,
} = InfoSlice.actions

export const selectRound = (state: RootState) => state.info.round
export const selectAllMessages = (state: RootState) => state.info.messages.loaded
export const selectEntityTooltips = (state: RootState) => state.info.entityTooltips
export const selectGameFlow = (state: RootState) => state.info.gameFlow
export const selectChosenMenu = (state: RootState) => state.info.chosenMenu
export const selectControlledEntities = (state: RootState) => state.info.controlledEntities
export const selectTurnOrder = (state: RootState) => state.info.turnOrder

export const selectActiveEntity = createSelector([(state: RootState) => state.info.turnOrder], (turnOrder) => {
    if (turnOrder.current === null) {
        return null
    } else {
        return turnOrder.order[turnOrder.current] || null
    }
})
