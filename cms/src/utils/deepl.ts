import * as deepl from 'deepl-node';
import type { TargetLanguageCode } from 'deepl-node';

let translator: deepl.Translator | null = null;
let glossaryId: string | undefined;

export function getTranslator(): deepl.Translator | null {
  if (!process.env.DEEPL_API_KEY) return null;
  if (!translator) {
    translator = new deepl.Translator(process.env.DEEPL_API_KEY);
  }
  return translator;
}

export function setGlossaryId(id: string) {
  glossaryId = id;
}

export async function translateText(
  text: string,
  targetLang: TargetLanguageCode = 'en-US'
): Promise<string | null> {
  const t = getTranslator();
  if (!t || !text?.trim()) return null;
  try {
    const result = await t.translateText(text, 'fr', targetLang, {
      glossary: glossaryId,
    });
    return result.text;
  } catch (err) {
    strapi.log.error('DeepL translation failed:', err);
    return null;
  }
}

export async function translateHtml(
  html: string,
  targetLang: TargetLanguageCode = 'en-US'
): Promise<string | null> {
  const t = getTranslator();
  if (!t || !html?.trim()) return null;
  try {
    const result = await t.translateText(html, 'fr', targetLang, {
      glossary: glossaryId,
      tagHandling: 'html',
    });
    return result.text;
  } catch (err) {
    strapi.log.error('DeepL HTML translation failed:', err);
    return null;
  }
}

// Convert Strapi v5 blocks to simple HTML for translation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function blocksToSimpleHtml(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return '';
  return blocks
    .map((block) => {
      if (block.type === 'paragraph') {
        const text = block.children
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ?.map((child: any) => {
            let t = child.text ?? '';
            if (child.bold) t = `<b>${t}</b>`;
            if (child.italic) t = `<i>${t}</i>`;
            return t;
          })
          .join('');
        return `<p>${text}</p>`;
      }
      if (block.type === 'heading') {
        const level = block.level ?? 2;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const text = block.children?.map((c: any) => c.text ?? '').join('');
        return `<h${level}>${text}</h${level}>`;
      }
      if (block.type === 'list') {
        const tag = block.format === 'ordered' ? 'ol' : 'ul';
        const items = block.children
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ?.map((item: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const text = item.children?.map((c: any) => c.text ?? '').join('');
            return `<li>${text}</li>`;
          })
          .join('');
        return `<${tag}>${items}</${tag}>`;
      }
      return '';
    })
    .join('');
}

// Convert simple HTML back to Strapi v5 blocks
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function simpleHtmlToBlocks(html: string): any[] {
  // Simple regex-based conversion
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blocks: any[] = [];
  const tagRegex = /<(p|h[1-6]|ul|ol)>([\s\S]*?)<\/\1>/gi;
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    const tag = match[1].toLowerCase();
    const content = match[2];

    if (tag === 'p') {
      blocks.push({
        type: 'paragraph',
        children: parseInlineChildren(content),
      });
    } else if (tag.startsWith('h')) {
      blocks.push({
        type: 'heading',
        level: parseInt(tag[1]),
        children: [{ type: 'text', text: stripTags(content) }],
      });
    } else if (tag === 'ul' || tag === 'ol') {
      const liRegex = /<li>([\s\S]*?)<\/li>/gi;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const children: any[] = [];
      let liMatch;
      while ((liMatch = liRegex.exec(content)) !== null) {
        children.push({
          type: 'list-item',
          children: [{ type: 'text', text: stripTags(liMatch[1]) }],
        });
      }
      blocks.push({
        type: 'list',
        format: tag === 'ol' ? 'ordered' : 'unordered',
        children,
      });
    }
  }

  return blocks.length > 0
    ? blocks
    : [{ type: 'paragraph', children: [{ type: 'text', text: stripTags(html) }] }];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseInlineChildren(html: string): any[] {
  // Very simple: handle <b> and <i> tags
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const children: any[] = [];
  const remaining = html.replace(/<b>(.*?)<\/b>/gi, (_, text) => {
    children.push({ type: 'text', text, bold: true });
    return '';
  });
  const remaining2 = remaining.replace(/<i>(.*?)<\/i>/gi, (_, text) => {
    children.push({ type: 'text', text, italic: true });
    return '';
  });
  const plainText = stripTags(remaining2).trim();
  if (plainText) {
    children.unshift({ type: 'text', text: plainText });
  }
  if (children.length === 0) {
    children.push({ type: 'text', text: stripTags(html) });
  }
  return children;
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

// Translate Strapi blocks by converting to HTML, translating, and converting back
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function translateBlocks(blocks: any[]): Promise<any[] | null> {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) return null;
  const html = blocksToSimpleHtml(blocks);
  if (!html) return null;
  const translated = await translateHtml(html);
  if (!translated) return null;
  return simpleHtmlToBlocks(translated);
}
