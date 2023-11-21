import {Image} from './create-image';

export const createDataURI = (image: Image) => image.prefix + ',' + image.currentData;
