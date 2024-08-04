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
    pageTitle: 'unknown', // this title is displayed
}

export const fetchUserInformation = createAsyncThunk('cosmetics/fetchUserInformation', async () => {
    return await APIService.getUserInformation()
})

const CosmeticsSlice = createSlice({
    name: 'cosmetics',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserInformation & { loading: LoadingState }>) => {
            const { avatar, handle, joined, loading } = action.payload
            return { ...state, user: { ...state.user, avatar, handle, joined, loading } }
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

export const { setPageTitle, setUser } = CosmeticsSlice.actions

export const selectUserInformation = (state: RootState) => state.cosmetics.user
