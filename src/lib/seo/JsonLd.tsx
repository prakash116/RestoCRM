import type { JsonLdNode } from "./structured-data";

/**
 * Renders a structured-data block.
 *
 * `JSON.stringify` output is escaped for `<` so a value containing `</script>`
 * can never break out of the tag — the standard XSS guard for inline JSON-LD.
 */
export function JsonLd({ data }: { data: JsonLdNode }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
