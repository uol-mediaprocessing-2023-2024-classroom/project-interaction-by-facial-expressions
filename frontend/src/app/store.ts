import {configureStore} from '@reduxjs/toolkit';
import {apiSlice} from '../features/api/apiSlice';
import carouselReducer from '../features/carousel/carouselSlice';
import filterBarReducer from '../features/filter-bar/filterBarSlice';
import overlayImageReducer from '../features/overlay-image/overlayImageSlice';
import settingsMenuReducer from '../features/settings-menu/settingsMenuSlice';
import appReducer from './appSlice';

export const store = configureStore({
    reducer: {
        app: appReducer,
        carousel: carouselReducer,
        filterBar: filterBarReducer,
        settingsMenu: settingsMenuReducer,
        overlayImage: overlayImageReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(apiSlice.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
