import { cn } from "@/lib/utils";

const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "ul",
  "ol",
  "li",
  "sub",
  "sup",
  "code",
  "pre",
  "blockquote",
  "span",
]);

/**
 * Stems are authored by staff through tiptap, but they also arrive from Excel
 * imports, so strip anything outside the small tag set the editor produces.
 */
export function sanitizeStem(html: string): string {
  return html
    .replace(/<\s*(script|style|iframe|object|embed)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\/?([a-zA-Z0-9]+)([^>]*)>/g, (match, rawTag: string) => {
      const tag = rawTag.toLowerCase();
      if (!ALLOWED_TAGS.has(tag)) return "";
      return match.startsWith("</") ? `</${tag}>` : `<${tag}>`;
    });
}

export function StemView({ html, className }: { html: string; className?: string }) {
  return (
    <div
      className={cn("stem-content", className)}
      dangerouslySetInnerHTML={{ __html: sanitizeStem(html) }}
    />
  );
}
