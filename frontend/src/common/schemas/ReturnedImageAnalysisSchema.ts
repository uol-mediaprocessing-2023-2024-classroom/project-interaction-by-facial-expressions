import {z} from 'zod';

export const ReturnedImageAnalysisSchema = z.object({
    headPose: z.object({
        direction: z.string(),
        boundingBox: z.object({
            width: z.number(),
            height: z.number(),
            minX: z.number(),
            minY: z.number(),
            centerX: z.number(),
            centerY: z.number()
        }),
        leftEye: z.object({
            x: z.number(),
            y: z.number()
        }),
        rightEye: z.object({
            x: z.number(),
            y: z.number()
        }),
        nose: z.object({
            x: z.number(),
            y: z.number()
        })
    })
});
