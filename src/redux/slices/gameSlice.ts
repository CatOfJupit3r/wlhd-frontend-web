import {createSlice} from "@reduxjs/toolkit";
import {StoreState} from "../../types/Redux";

const initialState: {
    user_name: string,
} = {
    user_name: ""
}

const GameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setName: (state, action) => {
            return {...state, user_name: action.payload.user_name}
        },
    }
})

export default GameSlice.reducer;

export const {
    setName
} = GameSlice.actions

export const selectNameMessage = (state: StoreState) => state.game.user_name