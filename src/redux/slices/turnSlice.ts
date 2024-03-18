import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {TurnState} from "../../models/Redux";
import {ActionInput as ActionInputInterface} from "../../models/ActionInput";
import {GET_ACTIONS} from "../../config/endpoints";

const initialState: TurnState = {
    playersTurn: false,
    readyToSubmit: false,
    isLoadingEntityActions: true,
    needToChooseSquare: false,
    entityActions: {
        root: [{
            id: "builtins:skip",
            translation_info: {
                descriptor: "builtins:skip",
                co_descriptor: null,
            },
            available: true,
            requires: null
        }],
        aliases : {},
        alias_translations: {
            root: "builtins:action"
        }
    },
    currentAlias: "root",
    scope: {},
    highlightedComponents: {},
    choices: {},
    translatedChoices: {}
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
    async ({
        game_id,
        entity_id
           }: {game_id: string, entity_id: string}) => {
        const response = await fetch(GET_ACTIONS(game_id, entity_id))
        return response.json()
    }
)


const turnSlice = createSlice({
    name: 'turn',
    initialState,
    reducers: {
        resetTurn(state) {
            return {...initialState, isTurnActive: state.playersTurn};
        },
        setPlayersTurn(state, action: PayloadAction<boolean>) {
            state.playersTurn = action.payload;
        },
        setSquareChoice(state, action: PayloadAction<boolean>) {
            state.needToChooseSquare = action.payload;
        },
        setReadyToSubmit(state, action: PayloadAction<boolean>) {
            state.readyToSubmit = action.payload;
        },
        setEntityActions(state, action: PayloadAction<ActionInputInterface>) {
            state.entityActions = action.payload;
        },
        setCurrentAlias(state, action: PayloadAction<string>) {
            state.currentAlias = action.payload;
        },
        setScope(state, action: PayloadAction<{ [key: string]: string }>) {
            state.scope = action.payload;
        },
        addHighlightedComponent(state, action: PayloadAction<string>) {
            const key = action.payload;
            state.highlightedComponents[key] = (state.highlightedComponents[key] || 0) + 1;
        },
        resetHighlightedComponents(state) {
            state.highlightedComponents = {};
        },
        setChoice(state, action: PayloadAction<{ key: string, value: string }>) {
            const { key, value } = action.payload;
            state.choices[key] = value;
        },
        setTranslatedChoice(state, action: PayloadAction<{ key: string, value: string }>) {
            const { key, value } = action.payload;
            state.translatedChoices[key] = value;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchActions.fulfilled, (state, action) => {
            state.entityActions = action.payload
            state.isLoadingEntityActions = false
        })
        builder.addCase(fetchActions.rejected, (state, action) => {
            console.error(action.error)
            state.entityActions = initialState.entityActions
            state.isLoadingEntityActions = false
        })
        builder.addCase(fetchActions.pending, (state) => {
            state.entityActions = initialState.entityActions
            state.isLoadingEntityActions = true
        })
    },
});

export default turnSlice.reducer;

export const {
    resetTurn,
    setPlayersTurn,
    setSquareChoice,
    setReadyToSubmit,
    setEntityActions,
    setCurrentAlias,
    setScope,
    addHighlightedComponent,
    resetHighlightedComponents,
    setChoice,
    setTranslatedChoice,
} = turnSlice.actions;

export const selectEntityActions = (state: {turn: TurnState}) => state.turn.entityActions;
export const selectCurrentAlias = (state: {turn: TurnState}) => state.turn.currentAlias;
export const selectScope = (state: {turn: TurnState}) => state.turn.scope;
export const selectHighlightedComponents = (state: {turn: TurnState}) => state.turn.highlightedComponents;
export const selectChoices = (state: {turn: TurnState}) => state.turn.choices;
export const selectTranslatedChoices = (state: {turn: TurnState}) => state.turn.translatedChoices;
export const selectIsLoadingEntityActions = (state: {turn: TurnState}) => state.turn.isLoadingEntityActions;
export const selectPlayersTurn = (state: {turn: TurnState}) => state.turn.playersTurn;
export const selectReadyToSubmit = (state: {turn: TurnState}) => state.turn.readyToSubmit;
export const selectNeedToChooseSquare = (state: {turn: TurnState}) => state.turn.needToChooseSquare;
export const selectIsTurnActive = (state: {turn: TurnState}) => state.turn.playersTurn && !state.turn.isLoadingEntityActions;
export const selectIsTurnReady = (state: {turn: TurnState}) => state.turn.readyToSubmit;
export const selectIsSquareChoice = (state: {turn: TurnState}) => state.turn.needToChooseSquare;
export const selectIsLoading = (state: {turn: TurnState}) => state.turn.isLoadingEntityActions;

