import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../../app/store';

export interface OverlayImageState {
    isShown: boolean;
}

const initialState: OverlayImageState = {
    isShown: false
};

export const overlayImageSlice = createSlice({
    name: 'overlay-image',
    initialState,
    reducers: {
        setIsShown: (state, action: PayloadAction<boolean>) => {
            state.isShown = action.payload;
        }
    }
});

export const {setIsShown} = overlayImageSlice.actions;

export const selectIsShown = (state: RootState) => state.overlayImage.isShown;

export default overlayImageSlice.reducer;
