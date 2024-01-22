import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Section} from '../common/enums/Section';
import {RootState} from './store';

export interface AppState {
    currentSection: Section;
    isSectionFocused: boolean;
}

const initialState: AppState = {
    currentSection: Section.NAVIGATION,
    isSectionFocused: false
};

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setCurrentSection: (state, action: PayloadAction<Section>) => {
            state.currentSection = action.payload;
        },
        setIsSectionFocused: (state, action: PayloadAction<boolean>) => {
            state.isSectionFocused = action.payload;
        }
    }
});

export const {setCurrentSection, setIsSectionFocused} = appSlice.actions;

export const selectCurrentSection = (state: RootState) => state.app.currentSection;
export const selectIsSectionFocused = (state: RootState) => state.app.isSectionFocused;

export default appSlice.reducer;
