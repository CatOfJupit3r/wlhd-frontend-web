import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ActionInput as ActionInputInterface } from '../../models/ActionInput'
import { StoreState, TurnState } from '../../models/Redux'
import APIService from '../../services/APIService'

const initialState: TurnState = {
    playersTurn: false,
    readyToSubmit: false,
    isLoadingEntityActions: true,
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

export const fetchActions = createAsyncThunk(
    'turn/fetchActions',
    async ({ game_id, entity_id }: { game_id: string; entity_id: string }) => {
        return await APIService.getActions(game_id, entity_id)
            .then((response) => response)
            .catch((error) => {
                console.log('There was a problem with the fetch operation: ', error)
                return {}
            })
    }
)

const turnSlice = createSlice({
    name: 'turn',
    initialState,
    reducers: {
        resetInput(state) {
            return {
                ...state,
                ...initialState,
                isTurnActive: state.playersTurn,
                entityActions: state.entityActions,
                readyToSubmit: state.readyToSubmit,
                isLoadingEntityActions: state.isLoadingEntityActions,
            }
        },
        resetTurn() {
            return {
                ...initialState,
            }
        },
        setPlayersTurn(state, action: PayloadAction<boolean>) {
            state.playersTurn = action.payload
        },
        setSquareChoice(state, action: PayloadAction<boolean>) {
            state.needToChooseSquare = action.payload
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
    extraReducers: (builder) => {
        builder.addCase(fetchActions.fulfilled, (state, action) => {
            console.log('Fetched actions: ', action.payload)
            if (Object.keys(action.payload).length > 0) {
                state.entityActions = action.payload as ActionInputInterface
                state.isLoadingEntityActions = false
            }
        })
        builder.addCase(fetchActions.rejected, (state, action) => {
            console.log(action.error)
            state.entityActions = initialState.entityActions
            state.isLoadingEntityActions = false
        })
        builder.addCase(fetchActions.pending, (state) => {
            state.entityActions = initialState.entityActions
            state.isLoadingEntityActions = true
        })
    },
})

export default turnSlice.reducer

export const {
    resetInput,
    resetTurn,
    setPlayersTurn,
    setSquareChoice,
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

export const selectEntityActions = (state: StoreState) => state.turn.entityActions
export const selectCurrentAlias = (state: StoreState) => state.turn.currentAlias
export const selectScope = (state: StoreState) => state.turn.scope
export const selectHighlightedComponents = (state: StoreState) => state.turn.highlightedComponents
export const selectChoices = (state: StoreState) => state.turn.choices
export const selectTranslatedChoices = (state: StoreState) => state.turn.translatedChoices
export const selectIsLoadingEntityActions = (state: StoreState) => state.turn.isLoadingEntityActions
export const selectReadyToSubmit = (state: StoreState) => state.turn.readyToSubmit
export const selectIsSquareChoice = (state: StoreState) => state.turn.needToChooseSquare
export const selectAliasTranslations = (state: StoreState) => state.turn.entityActions.alias_translations
export const selectAliases = (state: StoreState) => state.turn.entityActions.aliases
export const selectChosenAction = (state: StoreState) => state.turn.chosenAction
