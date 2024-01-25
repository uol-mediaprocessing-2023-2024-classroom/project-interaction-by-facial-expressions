import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../../app/store';

export interface CarouselState {
    currentIndex: number;
}

const initialState: CarouselState = {
    currentIndex: 0
};

export const carouselSlice = createSlice({
    name: 'carousel',
    initialState,
    reducers: {
        setCurrentIndex: (state, action: PayloadAction<number>) => {
            state.currentIndex = action.payload;
        }
    }
});

export const {setCurrentIndex} = carouselSlice.actions;

export const selectCurrentIndex = (state: RootState) => state.carousel.currentIndex;

export default carouselSlice.reducer;
