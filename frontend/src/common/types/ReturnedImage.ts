import {z} from 'zod';
import {ReturnedImageSchema} from '../schemas/ReturnedImageSchema';

export interface ReturnedImage extends z.infer<typeof ReturnedImageSchema> {
}
