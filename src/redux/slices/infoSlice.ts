import {InfoState, StoreState} from "../../models/Redux";
import {createSlice} from "@reduxjs/toolkit";


const initialState: InfoState = {
    round: 0,
    allMessages: {},
    current_battlefield: {
        battlefield: Array(6).fill(0).map(() => Array(6).fill("0")),
        game_descriptors: {
            columns: ["builtins::one", "builtins::two", "builtins::three", "builtins::four", "builtins::five", "builtins::six"],
            lines: ["builtins::safe", "builtins::ranged", "builtins::melee", "builtins::melee", "builtins::safe", "builtins::safe"],
            connectors: "builtins::connector",
            separators: "builtins::separator",
            field_components: {"0": "builtins::tile"}
        },
        entities_info: {}
    }
}


const InfoSlice = createSlice({
    name: 'info',
    initialState,
    reducers: {
        setRound: (state, action) => {
            return {...state, round: action.payload.round}
        },
        addMessage: (state, action) => {
            return {...state, allMessages: {...state.allMessages, ...action.payload.message}}
        },
        setCurrentBattlefield: (state, action) => {
            return {...state, current_battlefield: action.payload.current_battlefield}
        }
    }
})


export default InfoSlice.reducer;


export const {
    setRound,
    addMessage,
    setCurrentBattlefield
} = InfoSlice.actions

export const selectRound = (state: StoreState) => state.info.round
export const selectAllMessages = (state: StoreState) => state.info.allMessages
export const selectCurrentBattlefield = (state: StoreState) => state.info.current_battlefield
