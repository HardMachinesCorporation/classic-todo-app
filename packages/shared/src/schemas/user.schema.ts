import {z} from 'zod'

export const UserSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1).describe("First name of the user"),
  lastName: z.string().min(1).describe("Last name of the user"),
  email: z.string().email().describe("Email of the user"),
})
export type UserZod = z.infer<typeof UserSchema>