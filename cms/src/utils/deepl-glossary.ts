import * as deepl from 'deepl-node';

export const GLOSSARY_ENTRIES: Record<string, string> = {
  ébéniste: 'cabinetmaker',
  ébénisterie: 'cabinetmaking',
  noyer: 'walnut',
  chêne: 'oak',
  laiton: 'brass',
  acajou: 'mahogany',
  merisier: 'cherry wood',
  marqueterie: 'marquetry',
  placage: 'veneer',
  antiquaire: 'antique dealer',
  restauration: 'restoration',
  frêne: 'ash',
  palissandre: 'rosewood',
  hêtre: 'beech',
  teck: 'teak',
  rotin: 'rattan',
  'sur demande': 'price on request',
  'en cours': 'in progress',
};

let cachedGlossaryId: string | undefined;

export async function getOrCreateGlossary(
  translator: deepl.Translator
): Promise<string | undefined> {
  if (cachedGlossaryId) return cachedGlossaryId;

  try {
    // Check for existing glossary
    const glossaries = await translator.listGlossaries();
    const existing = glossaries.find(
      (g) => g.name === 'daguet-antique-fr-en'
    );

    if (existing) {
      cachedGlossaryId = existing.glossaryId;
      return cachedGlossaryId;
    }

    // Create new glossary
    const entries = new deepl.GlossaryEntries({
      entries: GLOSSARY_ENTRIES,
    });

    const glossary = await translator.createGlossary(
      'daguet-antique-fr-en',
      'fr',
      'en',
      entries
    );

    cachedGlossaryId = glossary.glossaryId;
    return cachedGlossaryId;
  } catch (err) {
    strapi.log.warn('Failed to create DeepL glossary:', err);
    return undefined;
  }
}
