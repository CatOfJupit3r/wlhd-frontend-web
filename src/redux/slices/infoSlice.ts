import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { InfoState, StoreState } from '../../models/Redux'
import APIService from '../../services/APIService'

const initialState: InfoState = {
    round: 0,
    allMessages: {
        // when predeclared, sometimes inner objects are not recognized
    },
    isLoadingEntitiesInfo: true,
    isLoadingCurrentEntityInfo: true,
    gameFlow: {
        type: 'pending',
        details: '',
    },
    entitiesInfo: {},
    controlledEntities: [],
    activeEntity: {
        name: 'test',
        square: '3/6',
        current_action_points: '30',
        max_action_points: '40',
    },
    chosenMenu: '',
}

export const fetchAllMessages = createAsyncThunk('info/fetchMessages', async (game_id: string) => {
    return await APIService.getAllMessages(game_id)
        .then((response) => response)
        .catch((error) => {
            console.log('There was a problem with the fetch operation: ', error)
            return {}
        })
})

export const fetchTheMessage = createAsyncThunk(
    'info/fetchTheMessage',
    async ({ game_id, message }: { game_id: string; message: string }) => {
        return await APIService.getOneMessage(game_id, message)
            .then((response) => response)
            .catch((error) => {
                console.log('There was a problem with the fetch operation: ', error)
                return {}
            })
    }
)

export const fetchCurrentEntityInfo = createAsyncThunk(
    'info/fetchCurrentEntityInfo',
    async ({ game_id, entity_id }: { game_id: string; entity_id: string }) => {
        return await APIService.getEntityInfo(game_id, entity_id)
            .then((response) => response)
            .catch((error) => {
                console.log('There was a problem with the fetch operation: ', error)
                return {}
            })
    }
)

export const fetchAllEntitiesInfo = createAsyncThunk('info/fetchAllEntitiesInfo', async (game_id: string) => {
    return await APIService.getAllEntitiesInfo(game_id)
        .then((response) => response)
        .catch((error) => {
            console.log('There was a problem with the fetch operation: ', error)
            return {}
        })
})

const InfoSlice = createSlice({
    name: 'info',
    initialState,
    reducers: {
        setRound: (state, action) => {
            return { ...state, round: action.payload.round }
        },
        setEndInfo: (
            state,
            action: {
                payload: {
                    ended: boolean
                    winner: string
                }
            }
        ) => {
            return { ...state, endInfo: action.payload }
        },
        addMessage: (state, action) => {
            return { ...state, allMessages: { ...state.allMessages, ...action.payload } }
        },
        setChosenMenu: (state, action: PayloadAction<string>) => {
            state.chosenMenu = action.payload
        },
        setFlowToActive: (state) => {
            state.gameFlow = {
                type: 'active',
                details: '',
            }
        },
        setFlowToPending: (state) => {
            state.gameFlow = {
                type: 'pending',
                details: '',
            }
        },
        setFlowToEnded: (state, action: PayloadAction<string>) => {
            state.gameFlow = {
                type: 'ended',
                details: action.payload,
            }
        },
        setFlowToAborted: (state, action: PayloadAction<string>) => {
            state.gameFlow = {
                type: 'aborted',
                details: action.payload,
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllMessages.fulfilled, (state, action) => {
            return { ...state, allMessages: action.payload }
        })
        builder.addCase(fetchTheMessage.fulfilled, (state, action) => {
            return { ...state, allMessages: { ...state.allMessages, ...action.payload } }
        })
        builder.addCase(fetchCurrentEntityInfo.fulfilled, (state, action) => {
            return { ...state, entities_info: { ...state.entitiesInfo, [(action.payload as any).id]: action.payload } }
        })
        builder.addCase(fetchAllEntitiesInfo.fulfilled, (state, action) => {
            return { ...state, entities_info: action.payload, isLoadingEntitiesInfo: false }
        })
        builder.addCase(fetchCurrentEntityInfo.pending, (state) => {
            return { ...state, isLoadingCurrentEntityInfo: true }
        })
        builder.addCase(fetchAllEntitiesInfo.pending, (state) => {
            return { ...state, isLoadingEntitiesInfo: true }
        })
        builder.addCase(fetchCurrentEntityInfo.rejected, (state) => {
            return { ...state, isLoadingCurrentEntityInfo: false }
        })
        builder.addCase(fetchAllEntitiesInfo.rejected, (state) => {
            return { ...state, isLoadingEntitiesInfo: false }
        })
    },
})

export default InfoSlice.reducer

export const {
    setRound,
    setEndInfo,
    addMessage,
    setChosenMenu,
    setFlowToEnded,
    setFlowToActive,
    setFlowToPending,
    setFlowToAborted,
} = InfoSlice.actions

export const selectRound = (state: StoreState) => state.info.round
export const selectAllMessages = (state: StoreState) => state.info.allMessages
export const selectEntitiesInfo = (state: StoreState) => state.info.entitiesInfo
export const selectGameFlow = (state: StoreState) => state.info.gameFlow
export const selectChosenMenu = (state: StoreState) => state.info.chosenMenu
// export const selectEntityInControlInfo = (state: StoreState) => state.info.entities_info[state.game.user_name]
export const selectEntityInControlInfo = () => ({
    name: 'test',
    square: '3/6',
    current_ap: '30',
    max_ap: '40',
})
