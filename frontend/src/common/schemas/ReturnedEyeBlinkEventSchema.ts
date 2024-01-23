import {z} from 'zod';

export const ReturnedEyeBlinkEventSchema = z.object({
    which: z.string()
});
