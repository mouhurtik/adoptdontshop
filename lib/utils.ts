import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Serialize structured data for a `<script type="application/ld+json">` sink.
 * JSON.stringify leaves `<`, `>` and line separators intact — user-authored
 * strings (post titles, pet names…) could otherwise terminate the script
 * element early. Escaping them keeps the payload valid JSON-LD.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}
