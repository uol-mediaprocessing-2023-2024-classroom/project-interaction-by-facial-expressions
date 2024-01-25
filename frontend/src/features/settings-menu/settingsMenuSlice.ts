import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../../app/store';
import {FaceDetectorBackend} from '../../common/enums/FaceDetectorBackend';

export interface SettingsMenuState {
    isGridShown: boolean;
    isEmojiShown: boolean;
    faceDetectorBackend: string;
}

const initialState: SettingsMenuState = {
    isGridShown: false,
    isEmojiShown: false,
    faceDetectorBackend: FaceDetectorBackend.OPENCV
};

export const settingsMenuSlice = createSlice({
    name: 'settings-menu',
    initialState,
    reducers: {
        setIsGridShown: (state, action: PayloadAction<boolean>) => {
            state.isGridShown = action.payload;
        },
        setIsEmojiShown: (state, action: PayloadAction<boolean>) => {
            state.isEmojiShown = action.payload;
        },
        setFaceDetectorBackend: (state, action: PayloadAction<string>) => {
            state.faceDetectorBackend = action.payload;
        }
    }
});

export const {setIsGridShown, setIsEmojiShown, setFaceDetectorBackend} = settingsMenuSlice.actions;

export const selectIsGridShown = (state: RootState) => state.settingsMenu.isGridShown;
export const selectIsEmojiShown = (state: RootState) => state.settingsMenu.isEmojiShown;
export const selectFaceDetectorBackend = (state: RootState) => state.settingsMenu.faceDetectorBackend;

export default settingsMenuSlice.reducer;
