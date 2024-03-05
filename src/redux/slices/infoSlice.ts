import {InfoState, StoreState} from "../../models/Redux";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {GET_BATTLEFIELD} from "../../config/endpoints";


const initialState: InfoState = {
    round: 0,
    allMessages: {},
    isLoadingBattlefield: false,
    current_battlefield: {
        battlefield: Array(6).fill(0).map(() => Array(6).fill("0")),
        game_descriptors: {
            columns: ["builtins::one", "builtins::two", "builtins::three", "builtins::four", "builtins::five", "builtins::six"],
            lines: ["builtins::safe_line", "builtins::ranged_line", "builtins::melee_line", "builtins::melee_line", "builtins::safe_line", "builtins::safe_line"],
            connectors: "builtins::connector",
            separators: "builtins::separator",
            field_components: {"0": "builtins::tile"}
        },
        entities_info: {}
    }
}


const fetchBattlefield = createAsyncThunk(
    'info/fetchBattlefield',
    async (game_id: string) => {
        const response = await fetch(GET_BATTLEFIELD(game_id))
        return response.json()
    }
)


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
        setBattlefield: (state, action) => {
            return {...state, current_battlefield: action.payload}
        } // USE ONLY FOR TESTING
    },
    extraReducers: (builder) => {
        builder.addCase(fetchBattlefield.fulfilled, (state, action) => {
            return {...state, current_battlefield: action.payload, isLoadingBattlefield: false}
        })
        builder.addCase(fetchBattlefield.pending, (state) => {
            return {...state, isLoadingBattlefield: true}
        })
        builder.addCase(fetchBattlefield.rejected, (state) => {
            return {...state, isLoadingBattlefield: false}
        })
    }
})


export default InfoSlice.reducer;


export const {
    setRound,
    addMessage,
    setBattlefield
} = InfoSlice.actions

export const selectRound = (state: StoreState) => state.info.round
export const selectAllMessages = (state: StoreState) => state.info.allMessages
export const selectCurrentBattlefield = (state: StoreState) => state.info.current_battlefield
export const selectIsLoadingBattlefield = (state: StoreState) => state.info.isLoadingBattlefield

