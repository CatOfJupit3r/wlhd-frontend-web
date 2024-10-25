import { CosmeticsState } from '@models/Redux'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import APIService from '@services/APIService'
import { RootState } from '../store'

const initialState: CosmeticsState = {
    user: {
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
        resetUser: (state) => {
            return { ...state, user: { ...state.user, loading: 'idle' } }
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

export const { setPageTitle, resetUser } = CosmeticsSlice.actions
export const selectUserInformation = (state: RootState) => state.cosmetics.user
