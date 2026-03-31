import { translateText, translateBlocks } from '../../../../utils/deepl';

const translating = new Set<string>();

export default {
  async afterUpdate(event: any) {
    const { result } = event;
    const docId = result?.documentId;
    if (!docId) return;

    if (translating.has(docId)) return;
    translating.add(docId);

    try {
      const entry = await strapi.documents('api::about-page.about-page').findFirst({});
      if (!entry) return;

      const updates: Record<string, any> = {};

      if (entry.title) {
        const v = await translateText(entry.title);
        if (v) updates.title_en = v;
      }

      if (entry.biography) {
        const v = await translateBlocks(entry.biography);
        if (v) updates.biography_en = v;
      }

      if (entry.atelier_description) {
        const v = await translateBlocks(entry.atelier_description);
        if (v) updates.atelier_description_en = v;
      }

      if (Object.keys(updates).length > 0) {
        await strapi.documents('api::about-page.about-page').update({
          documentId: docId,
          data: updates,
        });
        strapi.log.info('[DeepL] Translated about page to EN');
      }
    } catch (err) {
      strapi.log.error('[DeepL] Translation failed for about page:', err);
    } finally {
      translating.delete(docId);
    }
  },
};
