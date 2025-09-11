import {userBaseSchema} from "@/lib/validations/product/base";
import {z} from "zod";

export const userEmail = userBaseSchema.pick({
    id: true,
    email: true,
    name: true,
})

export type UserEmail = z.infer<typeof userEmail>;