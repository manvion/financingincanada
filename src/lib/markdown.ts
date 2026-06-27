// Minimal, dependency-free Markdown → HTML renderer for blog content.
// Supports: headings, bold, italics, inline code, links, blockquotes,
// unordered/ordered lists, horizontal rules, and paragraphs.
// Escapes HTML first to prevent injection from stored content.

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, href) => {
      const safe = String(href).replace(/"/g, "%22");
      return `<a href="${safe}">${label}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

export function renderMarkdown(md: string): string {
  const lines = escapeHtml(md.replace(/\r\n/g, "\n")).split("\n");
  const html: string[] = [];
  let i = 0;

  const flushParagraph = (buf: string[]) => {
    if (buf.length) {
      html.push(`<p>${inline(buf.join(" "))}</p>`);
      buf.length = 0;
    }
  };

  const para: string[] = [];

  while (i < lines.length) {
    const line = lines[i];

    if (/^\s*$/.test(line)) {
      flushParagraph(para);
      i++;
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      flushParagraph(para);
      const level = heading[1].length;
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      i++;
      continue;
    }

    if (/^---+\s*$/.test(line)) {
      flushParagraph(para);
      html.push("<hr/>");
      i++;
      continue;
    }

    if (/^>\s?/.test(line)) {
      flushParagraph(para);
      const quote: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      html.push(`<blockquote>${inline(quote.join(" "))}</blockquote>`);
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      flushParagraph(para);
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\s*[-*]\s+/, ""))}</li>`);
        i++;
      }
      html.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      flushParagraph(para);
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\s*\d+\.\s+/, ""))}</li>`);
        i++;
      }
      html.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    para.push(line.trim());
    i++;
  }

  flushParagraph(para);
  return html.join("\n");
}
