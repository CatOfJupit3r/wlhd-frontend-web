import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ActionInput as ActionInputInterface } from '../../models/ActionInput'
import { TurnState } from '../../models/Redux'
import { RootState } from '../store'

const initialState: TurnState = {
    playersTurn: false,
    readyToSubmit: false,
    needToChooseSquare: false,
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
    currentAlias: 'action',
    scope: {},
    highlightedComponents: {},
    choices: {},
    translatedChoices: {},
    chosenAction: {
        chosenActionValue: '',
        translatedActionValue: '',
    },
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
                readyToSubmit: state.readyToSubmit,
            }
        },
        resetTurnSlice(state) {
            return { ...state, ...initialState }
        },
        setPlayersTurn(state, action: PayloadAction<boolean>) {
            state.playersTurn = action.payload
        },
        setReadyToSubmit(state, action: PayloadAction<boolean>) {
            state.readyToSubmit = action.payload
        },
        setEntityActions(state, action: PayloadAction<ActionInputInterface>) {
            state.entityActions = action.payload
        },
        setCurrentAlias(state, action: PayloadAction<string>) {
            state.currentAlias = action.payload
        },
        appendScope(state, action: PayloadAction<{ [key: string]: string }>) {
            state.scope = { ...state.scope, ...action.payload }
        },
        addHighlightedComponent(state, action: PayloadAction<string>) {
            const key = action.payload
            state.highlightedComponents[key] = (state.highlightedComponents[key] || 0) + 1
        },
        highlightNothingButComponent(state, action: PayloadAction<string>) {
            state.highlightedComponents = {}
            state.highlightedComponents[action.payload] = 1
        },
        resetHighlightedComponents(state) {
            state.highlightedComponents = {}
        },
        setChoice(state, action: PayloadAction<{ key: string; value: string }>) {
            const { key, value } = action.payload
            state.choices[key] = value
        },
        setTranslatedChoice(state, action: PayloadAction<{ key: string; value: string }>) {
            const { key, value } = action.payload
            state.translatedChoices[key] = value
        },
        setChosenAction(state, action: PayloadAction<{ chosenActionValue: string; translatedActionValue: string }>) {
            state.chosenAction = action.payload
        },
        resetChosenAction(state) {
            state.chosenAction = initialState.chosenAction
        },
    },
})

export default turnSlice.reducer

export const {
    resetInput,
    resetTurnSlice,
    setPlayersTurn,
    setReadyToSubmit,
    setEntityActions,
    setCurrentAlias,
    appendScope,
    addHighlightedComponent,
    setChoice,
    setTranslatedChoice,
    setChosenAction,
    resetChosenAction,
    resetHighlightedComponents,
    highlightNothingButComponent,
} = turnSlice.actions

export const selectEntityActions = (state: RootState) => state.turn.entityActions
export const selectCurrentAlias = (state: RootState) => state.turn.currentAlias
export const selectScope = (state: RootState) => state.turn.scope
export const selectHighlightedComponents = (state: RootState) => state.turn.highlightedComponents
export const selectChoices = (state: RootState) => state.turn.choices
export const selectTranslatedChoices = (state: RootState) => state.turn.translatedChoices
export const selectReadyToSubmit = (state: RootState) => state.turn.readyToSubmit
export const selectIsSquareChoice = (state: RootState) => state.turn.needToChooseSquare
export const selectAliasTranslations = (state: RootState) => state.turn.entityActions.alias_translations
export const selectAliases = (state: RootState) => state.turn.entityActions.aliases
export const selectChosenAction = (state: RootState) => state.turn.chosenAction
export const selectPlayersTurn = (state: RootState) => state.turn.playersTurn
