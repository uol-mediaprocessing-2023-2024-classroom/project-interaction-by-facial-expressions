import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {createImage, Image} from '../../utils/create-image';
import mod from '../../utils/mod';

import image0 from './demo/0.jpg';
import image1 from './demo/1.jpg';
import image2 from './demo/2.jpg';
import image3 from './demo/3.jpg';
import image4 from './demo/4.jpg';
import image5 from './demo/5.jpg';
import image6 from './demo/6.jpg';
import image7 from './demo/7.jpg';
import image8 from './demo/8.jpg';

const images = [
    createImage(image0),
    createImage(image1),
    createImage(image2),
    createImage(image3),
    createImage(image4),
    createImage(image5),
    createImage(image6),
    createImage(image7),
    createImage(image8)
];

export interface CarouselState {
    images: Image[];
    index: number;
    previewLeft: Image;
    currentImage: Image;
    previewRight: Image;
}

const initialState: CarouselState = {
    images,
    index: 0,
    previewLeft: images[8],
    currentImage: images[0],
    previewRight: images[1]
};

const changeImages = (state: CarouselState) => {
    state.previewLeft = state.images[mod(state.index - 1, state.images.length)];
    state.currentImage = state.images[state.index];
    state.previewRight = state.images[mod(state.index + 1, state.images.length)];
};

export const carouselSlice = createSlice({
    name: 'carousel',
    initialState,
    reducers: {
        previousImage: state => {
            state.index = mod(state.index - 1, state.images.length);
            changeImages(state);
        },
        nextImage: state => {
            state.index = mod(state.index + 1, state.images.length);
            changeImages(state);
        },
        changeCurrentImage: (state, action: PayloadAction<{ data: string, filter: string }>) => {
            state.currentImage.currentData = action.payload.data;
            state.currentImage.filter = action.payload.filter;
            state.currentImage.isUnchanged = false;
            state.images[state.index] = state.currentImage;
        },
        resetCurrentImage: state => {
            state.currentImage.currentData = state.currentImage.originalData;
            state.currentImage.filter = null;
            state.currentImage.isUnchanged = true;
            state.images[state.index] = state.currentImage;
        }
    }
});

export const {previousImage, nextImage, changeCurrentImage, resetCurrentImage} = carouselSlice.actions;

export default carouselSlice.reducer;
