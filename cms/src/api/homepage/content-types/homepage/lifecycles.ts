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
      const entry = await strapi.documents('api::homepage.homepage').findFirst({});
      if (!entry) return;

      const updates: Record<string, any> = {};

      if (entry.hero_title) {
        const v = await translateText(entry.hero_title);
        if (v) updates.hero_title_en = v;
      }

      if (entry.hero_subtitle) {
        const v = await translateText(entry.hero_subtitle);
        if (v) updates.hero_subtitle_en = v;
      }

      if (entry.intro_text) {
        const v = await translateBlocks(entry.intro_text);
        if (v) updates.intro_text_en = v;
      }

      if (Object.keys(updates).length > 0) {
        await strapi.documents('api::homepage.homepage').update({
          documentId: docId,
          data: updates,
        });
        strapi.log.info('[DeepL] Translated homepage to EN');
      }
    } catch (err) {
      strapi.log.error('[DeepL] Translation failed for homepage:', err);
    } finally {
      translating.delete(docId);
    }
  },
};
