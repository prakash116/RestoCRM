type ClassValue = string | number | null | undefined | false | ClassValue[];

/**
 * Minimal class-name joiner.
 *
 * Deliberately dependency-free: components in this codebase compose classes
 * through explicit variant maps rather than by overriding conflicting
 * utilities from the outside, so a full `tailwind-merge` pass is not needed
 * and its ~15 kB gzip has no place in a landing-page bundle.
 */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];

  for (const input of inputs) {
    if (!input) continue;
    if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) out.push(nested);
    } else {
      out.push(String(input));
    }
  }

  return out.join(" ");
}
