import {z} from 'zod';

export const ReturnedFaceEmotionSchema = z.object({
    emotion: z.string()
});
