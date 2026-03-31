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
    // Re-fetch the full entry since lifecycle result may not include all fields
    const entry = await strapi.documents('api::article.article').findOne({
      documentId: docId,
    });
    if (!entry) return;

    const updates: Record<string, any> = {};

    if (entry.title) {
      const titleEn = await translateText(entry.title);
      if (titleEn) updates.title_en = titleEn;
    }

    if (entry.excerpt) {
      const excerptEn = await translateText(entry.excerpt);
      if (excerptEn) updates.excerpt_en = excerptEn;
    }

    if (entry.body) {
      const bodyEn = await translateBlocks(entry.body);
      if (bodyEn) updates.body_en = bodyEn;
    }

    if (entry.seo_description) {
      const seoEn = await translateText(entry.seo_description);
      if (seoEn) updates.seo_description_en = seoEn;
    }

    if (Object.keys(updates).length > 0) {
      await strapi.documents('api::article.article').update({
        documentId: docId,
        data: updates,
      });
      strapi.log.info(`Translated article "${entry.title}" to EN`);
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
