import {API_BASE_URL} from './apiSlice';
import {ReturnedImage} from './ReturnedImage';

const determineUrl = (image: ReturnedImage) => {
    const baseUrl = `${API_BASE_URL}/images/${image.id}`;
    if (image.processed_image_id == null) {
        return baseUrl;
    }
    return `${baseUrl}?processed_image=${Date.now()}`;
};

export const mapReturnedImageToImage = (returnedImage: ReturnedImage) => ({
    id: returnedImage.id,
    url: determineUrl(returnedImage),
    hasBeenProcessed: Boolean(returnedImage.processed_image_id),
    appliedFilter: returnedImage.applied_filter
});
