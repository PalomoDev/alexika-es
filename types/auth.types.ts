import { registerSchema, loginSchema } from '@/lib/validations/auth.validation'
import { z } from "zod";



export type RegisterSchemaType = z.infer<typeof registerSchema>
export type LoginSchemaType = z.infer<typeof loginSchema>