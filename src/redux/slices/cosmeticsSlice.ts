import { CosmeticsState, LoadingState } from '@models/Redux'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { UserInformation } from '@models/APIData'
import APIService from '@services/APIService'

const initialState: CosmeticsState = {
    user: {
        avatar: '',
        handle: '',
        createdAt: '',
        joined: [],
        loading: 'idle',
    },
    notification: {
        message: '',
        code: 200,
    },
    pageTitle: 'unknown', // this title is displayed
}

export const fetchUserInformation = createAsyncThunk('cosmetics/fetchUserInformation', async () => {
    console.log('fetchUserInformation')
    return await APIService.getUserInformation()
})

const CosmeticsSlice = createSlice({
    name: 'cosmetics',
    initialState,
    reducers: {
        setNotify: (state, action: PayloadAction<{ message: string; code: number }>) => {
            const { message, code } = action.payload
            return { ...state, notification: { message, code } }
        },
        setUser: (state, action: PayloadAction<UserInformation & { loading: LoadingState }>) => {
            const { avatar, handle, joined, loading } = action.payload
            return { ...state, user: { ...state.user, avatar, handle, joined, loading } }
        },
        clearNotify: (state) => {
            return { ...state, notification: initialState.notification }
        },
        setPageTitle: (state, action: PayloadAction<string>) => {
            return { ...state, pageTitle: action.payload }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchUserInformation.fulfilled, (state, action) => {
            return { ...state, user: { ...action.payload, loading: 'fulfilled' } }
        })
        builder.addCase(fetchUserInformation.pending, (state) => {
            return { ...state, user: { ...state.user, loading: 'pending' } }
        })
        builder.addCase(fetchUserInformation.rejected, (state) => {
            return { ...state, user: { ...state.user, loading: 'rejected' } }
        })
    },
})

export default CosmeticsSlice.reducer

export const { setNotify, clearNotify, setPageTitle, setUser } = CosmeticsSlice.actions

export const selectNotification = (state: RootState) => state.cosmetics.notification
export const selectUserInformation = (state: RootState) => state.cosmetics.user
