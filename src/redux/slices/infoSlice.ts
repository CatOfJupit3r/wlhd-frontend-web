import {InfoState, StoreState} from "../../models/Redux";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {
    GET_ALL_ENTITIES_INFO,
    GET_ALL_MESSAGES,
    GET_BATTLEFIELD,
    GET_ENTITY_INFO,
    GET_THE_MESSAGE
} from "../../config/endpoints";


const initialState: InfoState = {
    round: 0,
    allMessages: { // when predeclared, sometimes inner objects are not recognized
    },
    isLoadingBattlefield: true,
    isLoadingEntitiesInfo: true,
    isLoadingCurrentEntityInfo: true,
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
            columns: ["builtins:one", "builtins:two", "builtins:three", "builtins:four", "builtins:five", "builtins:six"],
            lines: ["builtins:safe_line", "builtins:ranged_line", "builtins:melee_line", "builtins:melee_line", "builtins:ranged_line", "builtins:safe_line"],
            connectors: "builtins:connector",
            separators: "builtins:separator",
            field_components: { "0": "builtins:tile" }
        }
    },
    entities_info: {}
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
    async ({game_id, message}: {game_id: string, message: string}) => {
        return await fetch(GET_THE_MESSAGE(game_id, message))
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


export const fetchCurrentEntityInfo = createAsyncThunk(
    'info/fetchCurrentEntityInfo',
    async ({game_id, entity_id}: {game_id: string, entity_id: string}) => {
        return await fetch(GET_ENTITY_INFO(game_id, entity_id))
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


export const fetchAllEntitiesInfo = createAsyncThunk(
    'info/fetchAllEntitiesInfo',
    async (game_id: string) => {
        return await fetch(GET_ALL_ENTITIES_INFO(game_id))
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
        },
        addMessage: (state, action) => {
            return {...state, allMessages: {...state.allMessages, ...action.payload}}
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
        builder.addCase(fetchCurrentEntityInfo.fulfilled, (state, action) => {
            return {...state, entities_info: {...state.entities_info, [action.payload.id]: action.payload}}
        })
        builder.addCase(fetchAllEntitiesInfo.fulfilled, (state, action) => {
            return {...state, entities_info: action.payload, isLoadingEntitiesInfo: false}
        })
        builder.addCase(fetchCurrentEntityInfo.pending, (state) => {
            return {...state, isLoadingCurrentEntityInfo: true}
        })
        builder.addCase(fetchAllEntitiesInfo.pending, (state) => {
            return {...state, isLoadingEntitiesInfo: true}
        })
        builder.addCase(fetchCurrentEntityInfo.rejected, (state) => {
            return {...state, isLoadingCurrentEntityInfo: false}
        })
        builder.addCase(fetchAllEntitiesInfo.rejected, (state) => {
            return {...state, isLoadingEntitiesInfo: false}
        })
    }
})


export default InfoSlice.reducer;


export const {
    setRound,
    setEndInfo,
    addMessage
} = InfoSlice.actions

export const selectRound = (state: StoreState) => state.info.round
export const selectAllMessages = (state: StoreState) => state.info.allMessages
export const selectBattlefieldMold = (state: StoreState) => state.info.current_battlefield.battlefield
export const selectConnectors = (state: StoreState) => state.info.current_battlefield.game_descriptors.connectors
export const selectColumns = (state: StoreState) => state.info.current_battlefield.game_descriptors.columns
export const selectLines = (state: StoreState) => state.info.current_battlefield.game_descriptors.lines
export const selectSeparators = (state: StoreState) => state.info.current_battlefield.game_descriptors.separators
export const selectFieldComponents = (state: StoreState) => state.info.current_battlefield.game_descriptors.field_components
export const selectIsLoadingBattlefield = (state: StoreState) => state.info.isLoadingBattlefield
export const selectEntitiesInfo = (state: StoreState) => state.info.entities_info
export const selectEndInfo = (state: StoreState) => state.info.endInfo
// export const selectEntityInControlInfo = (state: StoreState) => state.info.entities_info[state.game.user_name]
export const selectEntityInControlInfo = (state: StoreState) => (
    {
        name: "test",
        square: "3/6",
        current_ap: "30",
        max_ap: "40"
    }
)
