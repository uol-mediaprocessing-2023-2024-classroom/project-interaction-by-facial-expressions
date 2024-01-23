import {z} from 'zod';

export const ReturnedActionLogSchema = z.object({
    timestamp: z.number(),
    message: z.string()
});
