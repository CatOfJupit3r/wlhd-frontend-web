import {createSlice} from "@reduxjs/toolkit";
import {GameState, StoreState} from "../../models/Redux";

const initialState: GameState = {
    user_name: "ADMIN", // maybe will move to local storage. will see.
    game_id: "test",
    isActive: false
}

const GameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setName: (state, action) => {
            return {...state, user_name: action.payload.user_name}
        },
        setActive: (state, action) => {
            return {...state, isActive: action.payload.isActive}
        },
        setGameId: (state, action) => {
            return {...state, game_id: action.payload.game_id}
        }
    }
})

export default GameSlice.reducer;

export const {
    setName,
    setActive,
    setGameId
} = GameSlice.actions

export const selectName = (state: StoreState) => state.game.user_name
export const selectIsActive = (state: StoreState) => state.game.isActive
export const selectGameId = (state: StoreState) => state.game.game_id