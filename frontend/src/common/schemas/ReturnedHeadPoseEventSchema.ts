import {z} from 'zod';

export const ReturnedHeadPoseEventSchema = z.object({
    direction: z.string()
});
