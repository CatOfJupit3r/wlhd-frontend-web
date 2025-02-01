import { configureStore } from '@reduxjs/toolkit';
import cosmeticsSlice from './slices/cosmeticsSlice';
import gameScreenReducer from './slices/gameScreenSlice';

export const store = configureStore({
    reducer: {
        cosmetics: cosmeticsSlice,
        gameScreen: gameScreenReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
