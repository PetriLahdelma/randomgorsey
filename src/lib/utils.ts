import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using clsx and resolves Tailwind conflicts with tailwind-merge
 * Usage: cn("px-4 py-2", condition && "bg-primary", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
