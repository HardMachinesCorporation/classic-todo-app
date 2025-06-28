import {z} from 'zod'

export const TodoSchema = z.object({
    id: z.string().uuid().optional(),
    title: z.string().min(1).describe('Task title'),
    description: z.string().min(1).describe('Task description'),
    completed: z.boolean().default(false).describe('Indicate if Task status is completed'),
})

export type TodoZod = z.infer<typeof TodoSchema>