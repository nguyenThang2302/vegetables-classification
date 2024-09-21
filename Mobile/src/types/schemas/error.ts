import { z } from 'zod';

export const badRequestErrorSchema = z.object({
    error: z.object({
        message: z.string(),
        code: z.string()
    })
});