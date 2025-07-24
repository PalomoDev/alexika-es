import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatError(error: unknown): string {
  if (error && typeof error === 'object' && 'name' in error) {
    if (error.name === 'ZodError' && 'errors' in error) {
      const errors = error.errors as Record<string, { message: string }>;
      const fieldErrors = Object.keys(errors).map(key => errors[key].message);
      return fieldErrors.join('. ');
    } else if (error.name === 'PrismaClientKnownRequestError' && 'code' in error && error.code === 'P2002') {
      const field = 'meta' in error && error.meta && typeof error.meta === 'object' && 'target' in error.meta && Array.isArray(error.meta.target)
          ? error.meta.target[0]
          : 'Field';
      return `${field} already exists`;
    }
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
  }

  return 'An unknown error occurred';
}