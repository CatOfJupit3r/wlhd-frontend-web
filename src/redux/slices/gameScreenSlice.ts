import {
    Battlefield,
    CharacterInfoFull,
    GameHandshake,
    GameStateContainer,
    IndividualTurnOrder,
} from '@models/GameModels';
import { GameScreenState } from '@models/Redux';
import { RootState } from '@redux/store';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: GameScreenState = {
    battlefield: {
        pawns: (() => {
            const pawns: Battlefield['pawns'] = {};
            for (let i = 0; i < 6; i++) {
                for (let j = 0; j < 6; j++) {
                    pawns[`${i + 1}/${j + 1}`] = {
                        character: null,
                    };
                }
            }
            return pawns;
        })(),
        effects: [],
    },
    actions: null,
    round: {
        current: 0,
        order: [],
    },
    messages: [],
    gameFlow: {
        type: 'pending',
        details: '',
    },
    controlledCharacters: null,
    yourTurn: false,
    gameLobbyState: {
        players: [],
    },
    actionTimestamp: null,
};

const GameScreenSlice = createSlice({
    name: 'gameScreen',
    initialState,
    reducers: {
        reset: () => {
            return initialState;
        },
        setRound: (state, action: PayloadAction<number>) => {
            state.round.current = action.payload;
        },
        setBattlefield: (state, action: PayloadAction<Battlefield>) => {
            state.battlefield = action.payload;
        },
        setActions: (state, action: PayloadAction<GameScreenState['actions']>) => {
            state.actions = action.payload;
        },
        setYourTurn: (state, action: PayloadAction<boolean>) => {
            state.yourTurn = action.payload;
        },
        haltActions: (state) => {
            state.actions = null;
            state.yourTurn = false;
        },
        fromHandshake: (state, action: PayloadAction<GameHandshake>) => {
            return {
                ...state,
                ...initialState,
                battlefield: action.payload.currentBattlefield,
                round: {
                    current: action.payload.roundCount,
                    order: action.payload.turnOrder ?? [],
                },
                messages: action.payload.messages,
                controlledCharacters: action.payload.controlledCharacters,
                gameFlow: {
                    type: action.payload.combatStatus === 'pending' ? 'pending' : 'active',
                    details: '',
                },
                gameLobbyState: action.payload.gameLobbyState,
                actionTimestamp: action.payload.actionTimestamp,
            };
        },
        addMessage: (state, action: PayloadAction<GameStateContainer[number]>) => {
            state.messages.push(action.payload);
        },
        setControlledCharacters: (state, action: PayloadAction<Array<CharacterInfoFull> | null>) => {
            state.controlledCharacters = action.payload;
        },
        setMessages: (state, action: PayloadAction<GameStateContainer>) => {
            state.messages = action.payload;
        },
        setTurnOrder: (state, action: PayloadAction<IndividualTurnOrder>) => {
            state.round.order = action.payload;
        },
        setFlowToActive: (state) => {
            state.gameFlow = {
                type: 'active',
                details: '',
            };
        },
        setFlowToPending: (state) => {
            state.gameFlow = {
                type: 'pending',
                details: '',
            };
        },
        setFlowToEnded: (state, action: PayloadAction<string>) => {
            state.gameFlow = {
                type: 'ended',
                details: action.payload,
            };
        },
        setFlowToAborted: (state, action: PayloadAction<string>) => {
            state.gameFlow = {
                type: 'aborted',
                details: action.payload,
            };
        },
        setGameLobbyState: (state, action: PayloadAction<GameScreenState['gameLobbyState']>) => {
            state.gameLobbyState = action.payload;
        },
        setActionTimestamp: (state, action: PayloadAction<number | null>) => {
            state.actionTimestamp = action.payload;
        },
    },
});
export default GameScreenSlice.reducer;
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
    setControlledCharacters,
    setTurnOrder,
    reset: resetGameScreenSlice,
    setYourTurn,
    haltActions,
    fromHandshake: setGameScreenSliceFromHandshake,
    setGameLobbyState,
    setActionTimestamp,
} = GameScreenSlice.actions;

export const selectCurrentRoundCount = (state: RootState) => state.gameScreen.round.current;
export const selectAllMessages = (state: RootState) => state.gameScreen.messages;
export const selectGameFlow = (state: RootState) => state.gameScreen.gameFlow;
export const selectControlledCharacters = (state: RootState) => state.gameScreen.controlledCharacters;
export const selectTurnOrder = (state: RootState) => state.gameScreen.round.order;
export const selectBattlefield = (state: RootState) => state.gameScreen.battlefield;
export const selectActions = (state: RootState) => state.gameScreen.actions;
export const selectIsYourTurn = (state: RootState) => state.gameScreen.yourTurn;
export const selectActionTimestamp = (state: RootState) => state.gameScreen.actionTimestamp;
export const selectGameLobbyState = (state: RootState) => state.gameScreen.gameLobbyState;
export const selectAOEEffects = (state: RootState) => state.gameScreen.battlefield.effects;

export const selectActiveCharacter = createSelector(
    [(state: RootState) => state.gameScreen.round.order],
    (turnOrder) => {
        return turnOrder[0]; // the first character in the turn order is the active character. if none, then it's round end.
    },
);
