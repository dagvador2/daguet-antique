import { translateText } from '../../../../utils/deepl';

const translating = new Set<string>();

export default {
  async afterUpdate(event: any) {
    const { result } = event;
    const docId = result?.documentId;
    if (!docId) return;

    if (translating.has(docId)) return;
    translating.add(docId);

    try {
      const entry = await strapi.documents('api::site-setting.site-setting').findFirst({});
      if (!entry) return;

      if (entry.footer_text) {
        const v = await translateText(entry.footer_text);
        if (v) {
          await strapi.documents('api::site-setting.site-setting').update({
            documentId: docId,
            data: { footer_text_en: v },
          });
          strapi.log.info('[DeepL] Translated site settings to EN');
        }
      }
    } catch (err) {
      strapi.log.error('[DeepL] Translation failed for site settings:', err);
    } finally {
      translating.delete(docId);
    }
  },
};
