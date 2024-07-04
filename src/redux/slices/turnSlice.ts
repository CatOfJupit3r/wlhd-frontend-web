import { ActionInput as ActionInputInterface } from '@models/ActionInput'
import { TurnState } from '@models/Redux'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

const initialState: TurnState = {
    playersTurn: false,
    entityActions: {
        action: [
            {
                id: 'builtins:skip',
                translation_info: {
                    descriptor: 'builtins:skip',
                    co_descriptor: null,
                },
                available: true,
                requires: null,
            },
        ],
        aliases: {},
        alias_translations: {
            action: 'builtins:action',
        },
    },
    halted: false,
    needToChooseSquare: false,
    actionOutputs: null,
}

/*

yourTurn
readyToSubmit
isLoadingEntityActions


entityActions - keeps all info about all actions that are available to entity.
currentAlias="root" - keeps track of alias that is currently in choice.
scope={} - stores requirements that needs to be chosen. this is a workaround and doesn't support nested requirements
highlightedComponents - components that have been chosen by player and thus need to be distinct

choices
translatedChoices

*/

const turnSlice = createSlice({
    name: 'turn',
    initialState,
    reducers: {
        resetInput(state) {
            return {
                ...state,
                ...initialState,
                playersTurn: state.playersTurn,
                entityActions: state.entityActions,
            }
        },
        resetTurnSlice(state) {
            return { ...state, ...initialState, halted: state.halted }
        },
        setPlayersTurn(state, action: PayloadAction<boolean>) {
            state.playersTurn = action.payload
        },
        setEntityActions(state, action: PayloadAction<ActionInputInterface>) {
            state.entityActions = action.payload
        },
        setOutput(state, action: PayloadAction<{ [key: string]: string }>) {
            state.actionOutputs = action.payload
        },
        haltAction(state) {
            state.halted = true
        },
        receivedHalt(state) {
            state.halted = false
        },
    },
})

export default turnSlice.reducer

export const { resetInput, resetTurnSlice, setPlayersTurn, setEntityActions, setOutput, receivedHalt, haltAction } =
    turnSlice.actions

export const selectEntityActions = (state: RootState) => state.turn.entityActions
export const selectAliasTranslations = (state: RootState) => state.turn.entityActions.alias_translations
export const selectAliases = (state: RootState) => state.turn.entityActions.aliases
export const selectPlayersTurn = (state: RootState) => state.turn.playersTurn
export const selectOutput = (state: RootState) => state.turn.actionOutputs
export const selectHalted = (state: RootState) => state.turn.halted
