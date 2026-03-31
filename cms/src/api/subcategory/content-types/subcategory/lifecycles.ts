import { translateText } from '../../../../utils/deepl';

// Anti-infinite-loop guard
const translating = new Set<string>();

export default {
  async afterCreate(event: any) {
    await translateEntry(event);
  },
  async afterUpdate(event: any) {
    await translateEntry(event);
  },
};

async function translateEntry(event: any) {
  const { result } = event;
  const docId = result?.documentId;
  if (!docId) return;

  if (translating.has(docId)) return;
  translating.add(docId);

  try {
    // Re-fetch to ensure we have all fields
    const entry = await strapi.documents('api::subcategory.subcategory').findOne({
      documentId: docId,
    });
    if (!entry?.name) return;

    const nameEn = await translateText(entry.name);
    if (nameEn) {
      await strapi.documents('api::subcategory.subcategory').update({
        documentId: docId,
        data: { name_en: nameEn },
      });
      strapi.log.info(`Translated subcategory "${entry.name}" to EN`);
    }
  } catch (err) {
    strapi.log.error(`Translation failed for subcategory ${docId}:`, err);
  } finally {
    translating.delete(docId);
  }
}
