import { themeBootstrapScript } from "@/lib/theme/apply";

/**
 * Blocking inline script that applies the saved theme before first paint.
 *
 * Rendered from a Server Component into `<head>`. The browser executes it
 * synchronously during HTML parsing — earlier than any effect and earlier than
 * React itself — which is the only way to avoid a flash of the shipped palette
 * on a statically prerendered page.
 *
 * Note: this requires `'unsafe-inline'` (or a nonce) if a Content Security
 * Policy is ever added.
 */
export function ThemeScript() {
  return (
    <script
      // Generated from the token schema, not user input — see `apply.ts`.
      dangerouslySetInnerHTML={{ __html: themeBootstrapScript() }}
    />
  );
}
