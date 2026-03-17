/**
 * Preprocesses markdown content to convert [^N] footnote references
 * into clickable links that open the corresponding source URL.
 */
export function processFootnotes(content: string): string {
  // Split content to find the References section
  const refSectionMatch = content.match(/^## References\s*$/m);
  if (!refSectionMatch || refSectionMatch.index === undefined) return content;

  const refStart = refSectionMatch.index;
  const refSection = content.slice(refStart);
  const bodySection = content.slice(0, refStart);

  // Parse references: "N. [Title](URL) - description"
  const urlMap = new Map<string, string>();
  const refPattern = /^(\d+)\.\s+\[.*?\]\((https?:\/\/[^\s)]+)\)/gm;
  let match;
  while ((match = refPattern.exec(refSection)) !== null) {
    urlMap.set(match[1], match[2]);
  }

  if (urlMap.size === 0) return content;

  // Replace inline [^N] with markdown links using ^N^ as marker
  const processed = bodySection.replace(
    /\[\^(\d+)\]/g,
    (_full, num: string) => {
      const url = urlMap.get(num);
      if (!url) return _full;
      return `[^${num}^](${url})`;
    },
  );

  return processed + refSection;
}
