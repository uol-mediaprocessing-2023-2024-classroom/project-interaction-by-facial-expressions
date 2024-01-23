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
        setIsOverlayImageShown: (state, action: PayloadAction<boolean>) => {
            state.isShown = action.payload;
        }
    }
});

export const {setIsOverlayImageShown} = overlayImageSlice.actions;

export const selectIsOverlayImageShown = (state: RootState) => state.overlayImage.isShown;

export default overlayImageSlice.reducer;
