import {configureStore} from '@reduxjs/toolkit';
import {apiSlice} from '../features/api/apiSlice';
import carouselReducer from '../features/carousel/carouselSlice';
import manualModeSwitchReducer from '../features/manual-mode-switch/manualModeSwitchSlice';

export const store = configureStore({
    reducer: {
        carousel: carouselReducer,
        manualModeSwitch: manualModeSwitchReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
