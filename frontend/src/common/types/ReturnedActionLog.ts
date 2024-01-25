import {z} from 'zod';
import {ReturnedActionLogSchema} from '../schemas/ReturnedActionLogSchema';

export interface ReturnedActionLog extends z.infer<typeof ReturnedActionLogSchema> {
}
