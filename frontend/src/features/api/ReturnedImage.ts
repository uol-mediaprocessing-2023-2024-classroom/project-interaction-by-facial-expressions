import {z} from 'zod';
import {ReturnedImageSchema} from './ReturnedImageSchema';

export interface ReturnedImage extends z.infer<typeof ReturnedImageSchema> {
}
