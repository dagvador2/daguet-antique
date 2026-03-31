import { translateText, translateBlocks } from '../../../../utils/deepl';

// Anti-infinite-loop guard
const translating = new Set<string>();

async function translateEntry(event: any) {
  const { result } = event;
  const docId = result?.documentId;
  if (!docId) return;

  if (translating.has(docId)) return;
  translating.add(docId);

  try {
    const updates: Record<string, any> = {};

    if (result.title) {
      const titleEn = await translateText(result.title);
      if (titleEn) updates.title_en = titleEn;
    }

    if (result.excerpt) {
      const excerptEn = await translateText(result.excerpt);
      if (excerptEn) updates.excerpt_en = excerptEn;
    }

    if (result.body) {
      const bodyEn = await translateBlocks(result.body);
      if (bodyEn) updates.body_en = bodyEn;
    }

    if (result.seo_description) {
      const seoEn = await translateText(result.seo_description);
      if (seoEn) updates.seo_description_en = seoEn;
    }

    if (Object.keys(updates).length > 0) {
      await strapi.documents('api::article.article').update({
        documentId: docId,
        data: updates,
      });
      strapi.log.info(`Translated article "${result.title}" to EN`);
    }
  } catch (err) {
    strapi.log.error(`Translation failed for article ${docId}:`, err);
  } finally {
    translating.delete(docId);
  }
}

export default {
  async afterCreate(event: any) {
    await translateEntry(event);
  },
  async afterUpdate(event: any) {
    await translateEntry(event);
  },
};
