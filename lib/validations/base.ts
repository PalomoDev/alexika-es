import {z} from "zod";

export const uuidSchema = z.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
export const urlSchema = z.string().regex(/^https?:\/\/.+/);
export const emailSchema = z.string().regex(
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    "Invalid email format"
);