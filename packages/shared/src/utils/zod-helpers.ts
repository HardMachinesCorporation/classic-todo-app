import {ZodError, ZodTypeAny} from 'zod';

export function parseOrThrow<T extends ZodTypeAny>(schema: T, data: unknown) {
    const result = schema.safeParse(data)
    if(!result.success) throw new ZodError(result.error.errors)
    return result.data

}