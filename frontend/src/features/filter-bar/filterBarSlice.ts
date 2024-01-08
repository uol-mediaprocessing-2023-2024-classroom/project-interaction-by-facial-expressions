import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../../app/store';

export interface FilterBarState {
    focusedFilter: number;
}

const initialState: FilterBarState = {
    focusedFilter: 1
};

export const filterBarSlice = createSlice({
    name: 'carousel',
    initialState,
    reducers: {
        setFocusedFilter: (state, action: PayloadAction<number>) => {
            state.focusedFilter = action.payload;
        }
    }
});

export const {setFocusedFilter} = filterBarSlice.actions;

export const selectFocusedFilter = (state: RootState) => state.filterBar.focusedFilter;

export default filterBarSlice.reducer;
