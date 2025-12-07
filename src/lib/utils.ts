import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// DATE CORRECTION:
// Receives "2025-12-01" and returns "01/12/2025" 
export function formatDateDisplay(dateString: string) {
  if (!dateString) return "--/--/----"
  const parts = dateString.split('-')
  if (parts.length >= 3) {
    const year = parts[0]
    const month = parts[1]
    const day = parts[2].substring(0, 2) 
    return `${day}/${month}/${year}`
  }
  return dateString
}