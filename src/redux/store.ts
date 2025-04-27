import { configureStore } from '@reduxjs/toolkit';

import gameScreenReducer from './slices/gameScreenSlice';

export const store = configureStore({
    reducer: {
        gameScreen: gameScreenReducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
