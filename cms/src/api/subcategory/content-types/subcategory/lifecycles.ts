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
    if (result.name) {
      const nameEn = await translateText(result.name);
      if (nameEn) {
        await strapi.documents('api::subcategory.subcategory').update({
          documentId: docId,
          data: { name_en: nameEn },
        });
        strapi.log.info(`Translated subcategory "${result.name}" to EN`);
      }
    }
  } catch (err) {
    strapi.log.error(`Translation failed for subcategory ${docId}:`, err);
  } finally {
    translating.delete(docId);
  }
}
