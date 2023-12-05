import {createSelector} from '@reduxjs/toolkit';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import axios, {AxiosProgressEvent} from 'axios';
import {Image} from '../../common/types/Image';
import {mapReturnedImageToImage} from './mapReturnedImageToImage';
import {ReturnedImageSchema} from './ReturnedImageSchema';

export const API_BASE_URL = 'http://localhost:9000';

export enum ProcessImageAction {
    BLUR_FILTER = 'blur',
    INVERT_FILTER = 'invert',
    BLACK_AND_WHITE_FILTER = 'black-and-white',
    RESET_FILTER = 'reset'
}

export const apiSlice = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL
    }),
    tagTypes: ['Images'],
    endpoints: builder => ({
        getImages: builder.query<Image[], void>({
            query: () => '/images',
            transformResponse: response => ReturnedImageSchema
                .array()
                .parse(response)
                .map(mapReturnedImageToImage),
            providesTags: ['Images']
        }),
        processImage: builder.mutation<void, { id: string, action: ProcessImageAction }>({
            query: ({id, action}) => ({
                url: `/process-image`,
                method: 'POST',
                body: {id, action}
            }),
            invalidatesTags: ['Images']
        }),
        uploadImages: builder.mutation<void, {
            acceptedFiles: File[],
            onUploadProgress: (progressEvent: AxiosProgressEvent) => void
        }>({
            queryFn: async (arg, queryApi, extraOptions, baseQuery) => {
                for (let i = 0; i < arg.acceptedFiles.length; i++) {
                    const formData = new FormData();
                    formData.append('file', arg.acceptedFiles[i]);
                    await axios.post(API_BASE_URL + '/upload-image', formData, {
                        onUploadProgress: arg.onUploadProgress
                    });
                }
                return {data: undefined};
            },
            invalidatesTags: ['Images']
        })
    })
});

export const selectImagesResult = apiSlice.endpoints.getImages.select();

export const selectImages = createSelector(
    selectImagesResult,
    imagesResult => imagesResult?.data ?? []
);

export const {
    useGetImagesQuery,
    useProcessImageMutation,
    useUploadImagesMutation
} = apiSlice;
