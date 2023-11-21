import {configureStore} from '@reduxjs/toolkit';
import carouselReducer from './features/carousel/carouselSlice';

export const store = configureStore({
    reducer: {
        carousel: carouselReducer
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
