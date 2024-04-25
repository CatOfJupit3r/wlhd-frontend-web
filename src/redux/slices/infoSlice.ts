import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
    EntityInfoFull,
    EntityInfoTooltip,
    EntityInfoTurn,
    GameStateContainer,
    TranslatableString,
} from '../../models/Battlefield'
import { InfoState, StoreState } from '../../models/Redux'

const initialState: InfoState = {
    round: 0,
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
    activeEntity: null,
    chosenMenu: '',
}

const InfoSlice = createSlice({
    name: 'info',
    initialState,
    reducers: {
        setRound: (state, action) => {
            state.round = action.payload
        },
        addMessage: (state, action: PayloadAction<Array<TranslatableString>>) => {
            state.messages.loaded.push(action.payload)
        },
        setChosenMenu: (state, action: PayloadAction<string>) => {
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
        setActiveEntity: (state, action: PayloadAction<EntityInfoTurn | null>) => {
            state.activeEntity = action.payload
        },
        resetActiveEntity: (state) => {
            state.activeEntity = initialState.activeEntity
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
    setActiveEntity,
    resetActiveEntity,
    setEntityTooltips,
    setControlledEntities,
} = InfoSlice.actions

export const selectRound = (state: StoreState) => state.info.round
export const selectAllMessages = (state: StoreState) => state.info.messages.loaded
export const selectEntityTooltips = (state: StoreState) => state.info.entityTooltips
export const selectGameFlow = (state: StoreState) => state.info.gameFlow
export const selectChosenMenu = (state: StoreState) => state.info.chosenMenu
export const selectActiveEntity = (state: StoreState) => state.info.activeEntity
export const selectControlledEntities = (state: StoreState) => state.info.controlledEntities
