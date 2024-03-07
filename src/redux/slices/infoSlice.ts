import {InfoState, StoreState} from "../../models/Redux";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {GET_ALL_MESSAGES, GET_BATTLEFIELD, GET_THE_MESSAGE} from "../../config/endpoints";


const initialState: InfoState = {
    round: 0,
    allMessages: { // when predeclared, sometimes inner objects are not recognized
    },
    isLoadingBattlefield: true,
    endInfo: {
        ended: false,
        winner: "",
    },
    current_battlefield: {
        battlefield: [
            ["0", "0", "0", "0", "0", "0"],
            ["0", "0", "0", "0", "0", "0"],
            ["0", "0", "0", "0", "0", "0"],
            ["0", "0", "0", "0", "0", "0"],
            ["0", "0", "0", "0", "0", "0"],
            ["0", "0", "0", "0", "0", "0"]
        ],
        game_descriptors: {
            columns: ["builtins::one", "builtins::two", "builtins::three", "builtins::four", "builtins::five", "builtins::six"],
            lines: ["builtins::safe_line", "builtins::ranged_line", "builtins::melee_line", "builtins::melee_line", "builtins::safe_line", "builtins::safe_line"],
            connectors: "builtins::connector",
            separators: "builtins::separator",
            field_components: { "0": "builtins::tile" }
        },
        entities_info: {}
    }
}


export const fetchBattlefield = createAsyncThunk(
    'info/fetchBattlefield',
    async (game_id: string) => {
        return await fetch(GET_BATTLEFIELD(game_id))
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation: ', error);
                return initialState.current_battlefield
            })
    }
)

export const fetchAllMessages = createAsyncThunk(
    'info/fetchMessages',
    async (game_id: string) => {
        return await fetch(GET_ALL_MESSAGES(game_id))
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation: ', error);
                return {}
            });
    }
)

export const fetchTheMessage = createAsyncThunk(
    'info/fetchAMessage',
    async ({game_id, memory_cell}: {game_id: string, memory_cell: string}) => {
        return await fetch(GET_THE_MESSAGE(game_id, memory_cell))
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation: ', error);
                return {}
            });
    }
)


const InfoSlice = createSlice({
    name: 'info',
    initialState,
    reducers: {
        setRound: (state, action) => {
            return {...state, round: action.payload.round}
        },
        setEndInfo: (state, action: {
            payload: {
                ended: boolean,
                winner: string
            }
        }) => {
            return {...state, endInfo: action.payload}
        }
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
        builder.addCase(fetchAllMessages.fulfilled, (state, action) => {
            return {...state, allMessages: action.payload}
        })
        builder.addCase(fetchTheMessage.fulfilled, (state, action) => {
            return {...state, allMessages: {...state.allMessages, ...action.payload as any}}
        })

    }
})


export default InfoSlice.reducer;


export const {
    setRound,
    setEndInfo,
} = InfoSlice.actions

export const selectRound = (state: StoreState) => state.info.round
export const selectAllMessages = (state: StoreState) => state.info.allMessages
export const selectCurrentBattlefield = (state: StoreState) => state.info.current_battlefield
export const selectIsLoadingBattlefield = (state: StoreState) => state.info.isLoadingBattlefield
export const selectEntitiesInfo = (state: StoreState) => state.info.current_battlefield.entities_info
export const selectEndInfo = (state: StoreState) => state.info.endInfo