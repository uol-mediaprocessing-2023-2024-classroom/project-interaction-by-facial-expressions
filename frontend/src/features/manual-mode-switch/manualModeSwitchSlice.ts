import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../../app/store';

export interface ManualModeSwitchState {
    isChecked: boolean;
}

const initialState: ManualModeSwitchState = {
    isChecked: true
};

export const manualModeSwitchSlice = createSlice({
    name: 'manual-mode-switch',
    initialState,
    reducers: {
        setIsChecked: (state, action: PayloadAction<boolean>) => {
            state.isChecked = action.payload;
        }
    }
});

export const {setIsChecked} = manualModeSwitchSlice.actions;

export const selectIsChecked = (state: RootState) => state.manualModeSwitch.isChecked;

export default manualModeSwitchSlice.reducer;
