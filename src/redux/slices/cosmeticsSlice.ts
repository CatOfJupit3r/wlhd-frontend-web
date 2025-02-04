import { CosmeticsState } from '@models/Redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: CosmeticsState = {
    pageTitle: 'unknown', // this title is displayed
};

const CosmeticsSlice = createSlice({
    name: 'cosmetics',
    initialState,
    reducers: {
        setPageTitle: (state, action: PayloadAction<string>) => {
            return { ...state, pageTitle: action.payload };
        },
    },
});

export default CosmeticsSlice.reducer;

export const { setPageTitle } = CosmeticsSlice.actions;
