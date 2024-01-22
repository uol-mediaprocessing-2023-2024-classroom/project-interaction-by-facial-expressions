import {z} from 'zod';

export const ReturnedImageSchema = z.object({
    id: z.string(),
    file_extension: z.string(),
    mime_type: z.string(),
    processed_image_id: z.string().nullable(),
    applied_filter: z.string().nullable()
});
