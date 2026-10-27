/**
 * Class name joiner. Falsy values are dropped.
 *
 * Deliberately not `tailwind-merge` — with a token system this small, classes
 * that collide are a design smell rather than something to paper over.
 */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ')
}
