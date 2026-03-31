import { translateText, translateBlocks } from '../../../../utils/deepl';

// Anti-infinite-loop guard
const translating = new Set<string>();

async function translateEntry(event: any) {
  const { result } = event;
  const docId = result?.documentId;
  strapi.log.info(`[DeepL] Piece hook fired. documentId=${docId}, title=${result?.title}`);
  if (!docId) {
    strapi.log.warn('[DeepL] No documentId found in piece lifecycle event');
    return;
  }

  if (translating.has(docId)) {
    strapi.log.info(`[DeepL] Skipping piece ${docId} — already translating`);
    return;
  }
  translating.add(docId);

  try {
    // Re-fetch the full entry since lifecycle result may not include all fields
    const entry = await strapi.documents('api::piece.piece').findOne({
      documentId: docId,
    });
    if (!entry) return;

    const updates: Record<string, any> = {};

    if (entry.title) {
      const titleEn = await translateText(entry.title);
      if (titleEn) updates.title_en = titleEn;
    }

    if (entry.description) {
      const descEn = await translateBlocks(entry.description);
      if (descEn) updates.description_en = descEn;
    }

    if (entry.period) {
      const periodEn = await translateText(entry.period);
      if (periodEn) updates.period_en = periodEn;
    }

    if (entry.materials) {
      const materialsEn = await translateText(entry.materials);
      if (materialsEn) updates.materials_en = materialsEn;
    }

    if (entry.seo_description) {
      const seoEn = await translateText(entry.seo_description);
      if (seoEn) updates.seo_description_en = seoEn;
    }

    if (Object.keys(updates).length > 0) {
      await strapi.documents('api::piece.piece').update({
        documentId: docId,
        data: updates,
      });
      strapi.log.info(`Translated piece "${entry.title}" to EN`);
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
