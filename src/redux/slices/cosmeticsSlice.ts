import { CosmeticsState } from '@models/Redux'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import APIService from '@services/APIService'

const initialState: CosmeticsState = {
    pageTitle: 'unknown', // this title is displayed
}

export const fetchUserInformation = createAsyncThunk('cosmetics/fetchUserInformation', async () => {
    return await APIService.getUserInformation()
})

const CosmeticsSlice = createSlice({
    name: 'cosmetics',
    initialState,
    reducers: {
        setPageTitle: (state, action: PayloadAction<string>) => {
            return { ...state, pageTitle: action.payload }
        },
    },
})

export default CosmeticsSlice.reducer

export const { setPageTitle } = CosmeticsSlice.actions
