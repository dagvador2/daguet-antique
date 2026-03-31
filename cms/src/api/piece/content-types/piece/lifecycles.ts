import { translateText, translateBlocks } from '../../../../utils/deepl';

// Anti-infinite-loop guard
const translating = new Set<string>();

async function translateEntry(event: any) {
  const { result } = event;
  const docId = result?.documentId;
  if (!docId) return;

  // Guard: skip if already translating this entry
  if (translating.has(docId)) return;
  translating.add(docId);

  try {
    const updates: Record<string, any> = {};

    if (result.title) {
      const titleEn = await translateText(result.title);
      if (titleEn) updates.title_en = titleEn;
    }

    if (result.description) {
      const descEn = await translateBlocks(result.description);
      if (descEn) updates.description_en = descEn;
    }

    if (result.period) {
      const periodEn = await translateText(result.period);
      if (periodEn) updates.period_en = periodEn;
    }

    if (result.materials) {
      const materialsEn = await translateText(result.materials);
      if (materialsEn) updates.materials_en = materialsEn;
    }

    if (result.seo_description) {
      const seoEn = await translateText(result.seo_description);
      if (seoEn) updates.seo_description_en = seoEn;
    }

    if (Object.keys(updates).length > 0) {
      await strapi.documents('api::piece.piece').update({
        documentId: docId,
        data: updates,
      });
      strapi.log.info(`Translated piece "${result.title}" to EN`);
    }
  } catch (err) {
    strapi.log.error(`Translation failed for piece ${docId}:`, err);
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
