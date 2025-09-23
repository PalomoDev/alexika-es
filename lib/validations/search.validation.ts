import { z } from "zod";

export const searchSchema = z.object({
    query: z
        .string()
        .trim()
        .min(2, "La búsqueda debe tener al menos 2 caracteres")
        .max(100, "La búsqueda no puede exceder 100 caracteres")
        .regex(/^[a-zA-Zñáéíóúü0-9\s\-_.]+$/u, "Caracteres no válidos en la búsqueda")
});

export type SearchInput = z.infer<typeof searchSchema>;

export interface SearchResponse {
    products: Array<{
        id: string;
        name: string;
        slug: string;
        price: number;
        imageIds: string[];
    }>;
    totalResults: number;
    query: string;
}

export interface SearchError {
    message: string;
    code?: string;
}