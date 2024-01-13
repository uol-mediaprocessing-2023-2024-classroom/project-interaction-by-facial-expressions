import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Section} from '../common/types/Section';
import {RootState} from './store';

export interface AppState {
    currentSection: Section;
}

const initialState: AppState = {
    currentSection: Section.NAVIGATION
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setCurrentSection: (state, action: PayloadAction<Section>) => {
            state.currentSection = action.payload;
        }
    }
});

export const {setCurrentSection} = appSlice.actions;

export const selectCurrentSection = (state: RootState) => state.app.currentSection;

export default appSlice.reducer;
