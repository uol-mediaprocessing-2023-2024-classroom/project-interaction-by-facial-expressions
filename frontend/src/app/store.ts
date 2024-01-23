import {configureStore} from '@reduxjs/toolkit';
import {apiSlice} from '../features/api/apiSlice';
import carouselReducer from '../features/carousel/carouselSlice';
import filterBarReducer from '../features/filter-bar/filterBarSlice';
import manualModeSwitchReducer from '../features/manual-mode-switch/manualModeSwitchSlice';
import settingsMenuReducer from '../features/settings-menu/settingsMenuSlice';
import appReducer from './appSlice';

export const store = configureStore({
    reducer: {
        app: appReducer,
        carousel: carouselReducer,
        filterBar: filterBarReducer,
        manualModeSwitch: manualModeSwitchReducer,
        settingsMenu: settingsMenuReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
