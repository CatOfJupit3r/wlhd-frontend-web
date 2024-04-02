import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GameState, StoreState } from '../../models/Redux'

const initialState: GameState = {
    user_name: 'ADMIN', // maybe will move to local storage. will see.
    game_id: 'test',
    chosenMenu: '',
    isActive: false,
}

const GameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setName: (state, action: PayloadAction<string>) => {
            return { ...state, user_name: action.payload }
        },
        setActive: (state, action: PayloadAction<boolean>) => {
            return { ...state, isActive: action.payload }
        },
        setGameId: (state, action: PayloadAction<string>) => {
            return { ...state, game_id: action.payload }
        },
        setChosenMenu: (state, action: PayloadAction<string>) => {
            return { ...state, chosenMenu: action.payload }
        },
    },
})

export default GameSlice.reducer

export const { setName, setActive, setGameId, setChosenMenu } = GameSlice.actions

export const selectName = (state: StoreState) => state.game.user_name
export const selectIsActive = (state: StoreState) => state.game.isActive
export const selectGameId = (state: StoreState) => state.game.game_id
export const selectChosenMenu = (state: StoreState) => state.game.chosenMenu
