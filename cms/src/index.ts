import type { Core } from '@strapi/strapi';
import { getTranslator, setGlossaryId } from './utils/deepl';
import { getOrCreateGlossary } from './utils/deepl-glossary';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // --- DeepL glossary ---
    const translator = getTranslator();
    if (translator) {
      getOrCreateGlossary(translator).then((id) => {
        if (id) {
          setGlossaryId(id);
          strapi.log.info(`DeepL glossary initialized: ${id}`);
        }
      });
    }
    // --- Public permissions ---
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (publicRole) {
      const permissions = [
        // Collections: find + findOne
        'api::piece.piece.find',
        'api::piece.piece.findOne',
        'api::subcategory.subcategory.find',
        'api::subcategory.subcategory.findOne',
        'api::article.article.find',
        'api::article.article.findOne',
        // Single types: find
        'api::homepage.homepage.find',
        'api::about-page.about-page.find',
        'api::contact-page.contact-page.find',
        'api::site-setting.site-setting.find',
      ];

      for (const action of permissions) {
        const existing = await strapi
          .query('plugin::users-permissions.permission')
          .findOne({
            where: { action, role: publicRole.id },
          });

        if (!existing) {
          await strapi
            .query('plugin::users-permissions.permission')
            .create({
              data: { action, role: publicRole.id, enabled: true },
            });
        }
      }
    }

    // --- Revalidation webhook ---
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
    const REVALIDATION_SECRET =
      process.env.REVALIDATION_SECRET || 'dev-revalidation-secret';

    try {
      const webhookStore = strapi.get('webhookStore');
      const existingWebhooks = await webhookStore.findWebhooks();
      const exists = existingWebhooks.find(
        (w: any) => w.name === 'Frontend Revalidation'
      );

      if (!exists) {
        await webhookStore.createWebhook({
          name: 'Frontend Revalidation',
          url: `${FRONTEND_URL}/api/revalidate`,
          headers: {
            'x-revalidation-secret': REVALIDATION_SECRET,
          },
          events: [
            'entry.create',
            'entry.update',
            'entry.delete',
            'entry.publish',
            'entry.unpublish',
          ],
          enabled: true,
        });
      }
    } catch (err) {
      // webhookStore API may not be available; webhook can be configured manually via admin UI
      strapi.log.warn(
        'Could not auto-configure webhook. Set it up manually in Settings > Webhooks.'
      );
    }
  },
};
