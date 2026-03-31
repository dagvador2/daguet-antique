/**
 * Seed script for Daguet Antique Strapi CMS.
 *
 * Prerequisites:
 *   - Strapi must be running on localhost:1337
 *   - First admin user must NOT exist yet (the script registers one)
 *     OR the admin credentials below must match an existing admin.
 *
 * Usage: npm run seed
 */

const STRAPI_URL = 'http://localhost:1337';
const ADMIN_EMAIL = 'admin@daguet-antique.fr';
const ADMIN_PASSWORD = 'Admin1234!';
const ADMIN_FIRSTNAME = 'Admin';
const ADMIN_LASTNAME = 'Daguet';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getAdminJWT(): Promise<string> {
  // Try registering the first admin (works only if no admin exists)
  const registerRes = await fetch(`${STRAPI_URL}/admin/register-admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstname: ADMIN_FIRSTNAME,
      lastname: ADMIN_LASTNAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    }),
  });

  if (registerRes.ok) {
    const data = await registerRes.json();
    console.log('Admin user created.');
    return data.data.token;
  }

  // Admin already exists — login instead
  const loginRes = await fetch(`${STRAPI_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });

  if (!loginRes.ok) {
    throw new Error(
      `Admin login failed (${loginRes.status}): ${await loginRes.text()}`
    );
  }

  const loginData = await loginRes.json();
  console.log('Admin login successful.');
  return loginData.data.token;
}

async function uploadImageFromUrl(
  jwt: string,
  imageUrl: string,
  fileName: string
): Promise<number> {
  // Download image
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) {
    throw new Error(`Failed to download image from ${imageUrl}`);
  }
  const arrayBuffer = await imgRes.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });

  const formData = new FormData();
  formData.append('files', blob, fileName);

  const uploadRes = await fetch(`${STRAPI_URL}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${jwt}` },
    body: formData,
  });

  if (!uploadRes.ok) {
    throw new Error(
      `Upload failed for ${fileName}: ${await uploadRes.text()}`
    );
  }

  const uploaded = await uploadRes.json();
  return uploaded[0].id;
}

// Content Manager admin API endpoints (admin JWT required)
async function createEntry(
  jwt: string,
  uid: string,
  data: Record<string, unknown>
): Promise<any> {
  const res = await fetch(
    `${STRAPI_URL}/content-manager/collection-types/${uid}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create ${uid}: ${res.status} ${text}`);
  }

  return res.json();
}

async function updateSingleType(
  jwt: string,
  uid: string,
  data: Record<string, unknown>
): Promise<any> {
  const res = await fetch(
    `${STRAPI_URL}/content-manager/single-types/${uid}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to update ${uid}: ${res.status} ${text}`);
  }

  return res.json();
}

async function publishEntry(
  jwt: string,
  uid: string,
  documentId: string
): Promise<void> {
  const res = await fetch(
    `${STRAPI_URL}/content-manager/collection-types/${uid}/${documentId}/actions/publish`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Failed to publish ${uid}/${documentId}: ${res.status} ${text}`
    );
  }
}

async function publishSingleType(
  jwt: string,
  uid: string
): Promise<void> {
  const res = await fetch(
    `${STRAPI_URL}/content-manager/single-types/${uid}/actions/publish`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Failed to publish single type ${uid}: ${res.status} ${text}`
    );
  }
}

function textBlock(text: string) {
  return [{ type: 'paragraph', children: [{ type: 'text', text }] }];
}

function multiParagraphBlock(paragraphs: string[]) {
  return paragraphs.map((p) => ({
    type: 'paragraph',
    children: [{ type: 'text', text: p }],
  }));
}

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const SUBCATEGORIES = [
  { name: 'Sièges', category: 'antiquite', order: 1 },
  { name: 'Tables', category: 'antiquite', order: 2 },
  { name: 'Rangements', category: 'antiquite', order: 3 },
  { name: 'Miroirs', category: 'antiquite', order: 4 },
  { name: 'Objets décoratifs', category: 'antiquite', order: 5 },
  { name: 'Luminaires', category: 'antiquite', order: 6 },
  { name: 'Consoles', category: 'creation', order: 1 },
  { name: 'Tables', category: 'creation', order: 2 },
  { name: 'Miroirs', category: 'creation', order: 3 },
];

// Placeholder image URLs (picsum.photos for reliability, seeded for consistency)
const IMAGES = {
  fauteuils: [
    'https://picsum.photos/seed/fauteuil1/800/1000',
    'https://picsum.photos/seed/fauteuil2/800/1000',
  ],
  tableBasse: [
    'https://picsum.photos/seed/tablebasse1/800/1000',
    'https://picsum.photos/seed/tablebasse2/800/1000',
  ],
  buffet: [
    'https://picsum.photos/seed/buffet1/800/1000',
  ],
  miroir: [
    'https://picsum.photos/seed/miroir1/800/1000',
  ],
  lampe: [
    'https://picsum.photos/seed/lampe1/800/1000',
  ],
  enfilade: [
    'https://picsum.photos/seed/enfilade1/800/1000',
    'https://picsum.photos/seed/enfilade2/800/1000',
  ],
  chaise: [
    'https://picsum.photos/seed/chaise1/800/1000',
  ],
  vase: [
    'https://picsum.photos/seed/vase1/800/1000',
  ],
  console: [
    'https://picsum.photos/seed/console1/800/1000',
    'https://picsum.photos/seed/console2/800/1000',
  ],
  tableSalon: [
    'https://picsum.photos/seed/tablesalon1/800/1000',
  ],
  miroirBoisFlotte: [
    'https://picsum.photos/seed/miroirflotte1/800/1000',
  ],
  banc: [
    'https://picsum.photos/seed/banc1/800/1000',
  ],
  hero: [
    'https://picsum.photos/seed/hero1/1600/900',
  ],
  intro: [
    'https://picsum.photos/seed/intro1/800/1000',
  ],
  portrait: [
    'https://picsum.photos/seed/portrait1/800/1000',
  ],
  atelier: [
    'https://picsum.photos/seed/atelier1/800/600',
    'https://picsum.photos/seed/atelier2/800/600',
  ],
};

interface PieceData {
  title: string;
  category: 'antiquite' | 'creation';
  subcategoryName: string;
  period: string;
  materials: string;
  dimensions: string;
  price: number | null;
  sale_status: 'available' | 'sold';
  featured: boolean;
  work_in_progress: boolean;
  show_price: boolean;
  description: string;
  imageKey: keyof typeof IMAGES;
}

const PIECES: PieceData[] = [
  {
    title: 'Paire de fauteuils club années 50',
    category: 'antiquite',
    subcategoryName: 'Sièges',
    period: 'Années 1950',
    materials: 'Cuir patiné et hêtre',
    dimensions: 'H.75 × L.70 × P.80 cm',
    price: 3200,
    sale_status: 'available',
    featured: true,
    work_in_progress: false,
    show_price: true,
    description:
      "Superbe paire de fauteuils club des années 1950 en cuir brun patiné par le temps. La structure en hêtre massif offre un confort remarquable et une assise généreuse. Le cuir présente une patine naturelle qui témoigne d'un usage soigné au fil des décennies.",
    imageKey: 'fauteuils',
  },
  {
    title: 'Table basse brutaliste en chêne',
    category: 'antiquite',
    subcategoryName: 'Tables',
    period: 'Années 1960',
    materials: 'Chêne massif',
    dimensions: 'H.35 × L.120 × P.60 cm',
    price: 1800,
    sale_status: 'available',
    featured: true,
    work_in_progress: false,
    show_price: true,
    description:
      "Table basse d'inspiration brutaliste en chêne massif des années 1960. Les lignes épurées et la robustesse du plateau en font une pièce de caractère. Le veinage prononcé du chêne et sa teinte miel confèrent une chaleur naturelle à cette table d'exception.",
    imageKey: 'tableBasse',
  },
  {
    title: 'Buffet scandinave en teck',
    category: 'antiquite',
    subcategoryName: 'Rangements',
    period: 'Années 1960',
    materials: 'Teck',
    dimensions: 'H.85 × L.180 × P.45 cm',
    price: 2400,
    sale_status: 'available',
    featured: false,
    work_in_progress: false,
    show_price: true,
    description:
      "Élégant buffet scandinave en teck des années 1960, typique du design danois de cette époque. Portes coulissantes d'origine, intérieur aménagé avec étagères réglables. Le teck a pris une belle teinte dorée avec le temps.",
    imageKey: 'buffet',
  },
  {
    title: 'Miroir soleil en laiton doré',
    category: 'antiquite',
    subcategoryName: 'Miroirs',
    period: 'Années 1950',
    materials: 'Laiton',
    dimensions: 'Ø 90 cm',
    price: 950,
    sale_status: 'sold',
    featured: false,
    work_in_progress: false,
    show_price: true,
    description:
      "Miroir soleil des années 1950 en laiton doré avec ses rayons caractéristiques. Miroir biseauté d'origine en parfait état. Ce miroir iconique du milieu du XXe siècle apporte lumière et élégance à tout intérieur.",
    imageKey: 'miroir',
  },
  {
    title: "Lampe de bureau industrielle Jieldé",
    category: 'antiquite',
    subcategoryName: 'Luminaires',
    period: 'Années 1950',
    materials: 'Acier laqué',
    dimensions: 'H.45 cm',
    price: 680,
    sale_status: 'available',
    featured: false,
    work_in_progress: false,
    show_price: true,
    description:
      "Lampe de bureau Jieldé à deux bras articulés, modèle emblématique du design industriel français. Acier laqué d'origine avec une patine authentique. Mécanisme d'articulation fluide, éclairage directionnel idéal pour un bureau ou une table de chevet.",
    imageKey: 'lampe',
  },
  {
    title: 'Enfilade Art Déco en palissandre',
    category: 'antiquite',
    subcategoryName: 'Rangements',
    period: 'Années 1930',
    materials: 'Palissandre et laiton',
    dimensions: 'H.90 × L.200 × P.50 cm',
    price: 4500,
    sale_status: 'available',
    featured: true,
    work_in_progress: false,
    show_price: true,
    description:
      "Majestueuse enfilade Art Déco en palissandre de Rio avec poignées en laiton ciselé. Le veinage exceptionnel du palissandre et les lignes géométriques typiques de l'Art Déco en font une pièce de collection. Intérieur en sycomore avec tiroirs et étagères.",
    imageKey: 'enfilade',
  },
  {
    title: "Chaise d'atelier Nicolle",
    category: 'antiquite',
    subcategoryName: 'Sièges',
    period: 'Années 1940',
    materials: 'Métal',
    dimensions: 'H.80 × L.40 × P.42 cm',
    price: 450,
    sale_status: 'available',
    featured: false,
    work_in_progress: false,
    show_price: true,
    description:
      "Chaise d'atelier Nicolle en métal, modèle créé par Roger Nicolle pour les ateliers et usines françaises. Hauteur réglable par vis, assise pivotante. Finition métal brut avec traces d'usage qui lui confèrent un caractère authentiquement industriel.",
    imageKey: 'chaise',
  },
  {
    title: 'Vase en grès émaillé signé',
    category: 'antiquite',
    subcategoryName: 'Objets décoratifs',
    period: 'Années 1970',
    materials: 'Grès',
    dimensions: 'H.25 × Ø 15 cm',
    price: 380,
    sale_status: 'sold',
    featured: false,
    work_in_progress: false,
    show_price: true,
    description:
      "Vase en grès émaillé signé par un céramiste français des années 1970. Émail aux tons bruns et ocre avec des coulures caractéristiques du travail artisanal. Forme organique harmonieuse, parfait pour une composition florale ou en objet décoratif seul.",
    imageKey: 'vase',
  },
  {
    title: 'Console murale en chêne brûlé',
    category: 'creation',
    subcategoryName: 'Consoles',
    period: '',
    materials: 'Chêne brûlé (shou sugi ban) et acier',
    dimensions: 'H.85 × L.140 × P.35 cm',
    price: 2800,
    sale_status: 'available',
    featured: true,
    work_in_progress: false,
    show_price: true,
    description:
      "Console murale réalisée en chêne massif traité selon la technique japonaise du shou sugi ban (bois brûlé). Le contraste entre le noir profond du bois carbonisé et la structure en acier brut crée un dialogue entre tradition et modernité. Pièce unique signée.",
    imageKey: 'console',
  },
  {
    title: 'Table de salon en noyer et résine',
    category: 'creation',
    subcategoryName: 'Tables',
    period: '',
    materials: 'Noyer massif et résine époxy',
    dimensions: 'H.40 × L.100 × P.100 cm',
    price: 3500,
    sale_status: 'available',
    featured: false,
    work_in_progress: false,
    show_price: true,
    description:
      "Table de salon en noyer massif fendu avec incrustation de résine époxy transparente. Les bords naturels du noyer sont préservés pour révéler le dessin organique du bois. Piètement en acier noir mat. Chaque table est une pièce unique façonnée à la main.",
    imageKey: 'tableSalon',
  },
  {
    title: 'Miroir cadre bois flotté',
    category: 'creation',
    subcategoryName: 'Miroirs',
    period: '',
    materials: 'Bois flotté et verre',
    dimensions: 'H.120 × L.80 cm',
    price: 1200,
    sale_status: 'available',
    featured: false,
    work_in_progress: false,
    show_price: true,
    description:
      "Grand miroir encadré de bois flotté collecté sur les côtes atlantiques. Chaque morceau est sélectionné pour sa forme et sa texture, puis assemblé à la main autour d'un miroir de qualité optique. Une pièce unique qui apporte un souffle marin et naturel.",
    imageKey: 'miroirBoisFlotte',
  },
  {
    title: "Banc d'entrée en frêne",
    category: 'creation',
    subcategoryName: 'Consoles',
    period: '',
    materials: 'Frêne olivier',
    dimensions: 'H.45 × L.130 × P.35 cm',
    price: null,
    sale_status: 'available',
    featured: false,
    work_in_progress: true,
    show_price: false,
    description:
      "Banc d'entrée en cours de réalisation, façonné dans un plateau de frêne olivier aux veinures spectaculaires. L'assise monoxyle est sculptée à la main pour épouser la forme naturelle du bois. Assemblage par tenons et mortaises traditionnels.",
    imageKey: 'banc',
  },
];

// ---------------------------------------------------------------------------
// Main seed
// ---------------------------------------------------------------------------

async function seed() {
  console.log('=== Starting seed ===\n');

  // 1. Authenticate
  const jwt = await getAdminJWT();
  console.log('');

  // 2. Create subcategories
  console.log('--- Creating subcategories ---');
  const subcatMap = new Map<string, string>(); // "name|category" -> documentId

  for (const sub of SUBCATEGORIES) {
    const baseSlug = sub.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');
    // Append category to slug to avoid duplicates (e.g. "tables" exists in both)
    const slug = `${baseSlug}-${sub.category}`;

    const result = await createEntry(jwt, 'api::subcategory.subcategory', {
      name: sub.name,
      slug,
      category: sub.category,
      order: sub.order,
    });
    const docId = result.data?.documentId || result.documentId;
    subcatMap.set(`${sub.name}|${sub.category}`, docId);
    await publishEntry(jwt, 'api::subcategory.subcategory', docId);
    console.log(`  ✓ ${sub.name} (${sub.category})`);
  }
  console.log('');

  // 3. Upload images and create pieces
  console.log('--- Creating pieces ---');

  for (const piece of PIECES) {
    const urls = IMAGES[piece.imageKey];
    const photoIds: number[] = [];

    for (let i = 0; i < urls.length; i++) {
      const slug = piece.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      const fileName = `${slug}-${i + 1}.jpg`;
      try {
        const id = await uploadImageFromUrl(jwt, urls[i], fileName);
        photoIds.push(id);
      } catch (err: any) {
        console.warn(`  ⚠ Image upload failed for ${fileName}: ${err.message}`);
      }
    }

    if (photoIds.length === 0) {
      console.warn(`  ⚠ Skipping "${piece.title}" — no photos uploaded`);
      continue;
    }

    const subcatKey = `${piece.subcategoryName}|${piece.category}`;
    const subcatDocId = subcatMap.get(subcatKey);

    const entryData: Record<string, unknown> = {
      title: piece.title,
      category: piece.category,
      subcategory: subcatDocId ? { documentId: subcatDocId } : undefined,
      period: piece.period || undefined,
      materials: piece.materials,
      dimensions: piece.dimensions,
      price: piece.price,
      show_price: piece.show_price,
      sale_status: piece.sale_status,
      work_in_progress: piece.work_in_progress,
      featured: piece.featured,
      description: textBlock(piece.description),
      photos: photoIds,
    };

    // Remove undefined values
    for (const key of Object.keys(entryData)) {
      if (entryData[key] === undefined) delete entryData[key];
    }

    const result = await createEntry(jwt, 'api::piece.piece', entryData);
    const pieceDocId = result.data?.documentId || result.documentId;
    await publishEntry(jwt, 'api::piece.piece', pieceDocId);
    console.log(`  ✓ ${piece.title}`);
  }
  console.log('');

  // 4. Seed single types
  console.log('--- Seeding single types ---');

  // Upload images for singletons
  let heroImageId: number | undefined;
  let introImageId: number | undefined;
  let portraitImageId: number | undefined;
  const atelierImageIds: number[] = [];

  try {
    heroImageId = await uploadImageFromUrl(jwt, IMAGES.hero[0], 'hero.jpg');
  } catch (err: any) {
    console.warn(`  ⚠ Hero image upload failed: ${err.message}`);
  }

  try {
    introImageId = await uploadImageFromUrl(jwt, IMAGES.intro[0], 'intro.jpg');
  } catch (err: any) {
    console.warn(`  ⚠ Intro image upload failed: ${err.message}`);
  }

  try {
    portraitImageId = await uploadImageFromUrl(
      jwt,
      IMAGES.portrait[0],
      'portrait.jpg'
    );
  } catch (err: any) {
    console.warn(`  ⚠ Portrait image upload failed: ${err.message}`);
  }

  for (let i = 0; i < IMAGES.atelier.length; i++) {
    try {
      const id = await uploadImageFromUrl(
        jwt,
        IMAGES.atelier[i],
        `atelier-${i + 1}.jpg`
      );
      atelierImageIds.push(id);
    } catch (err: any) {
      console.warn(`  ⚠ Atelier image upload failed: ${err.message}`);
    }
  }

  // Homepage
  const homepageData: Record<string, unknown> = {
    hero_title: 'Daguet Antique',
    hero_subtitle: 'Ébéniste · Designer · Antiquaire',
    intro_text: textBlock(
      "Depuis son atelier, Christophe Daguet sélectionne avec passion des pièces de mobilier du XXe siècle et crée des meubles uniques en bois massif. Chaque pièce raconte une histoire, chaque création porte la marque d'un savoir-faire artisanal exigeant."
    ),
  };
  if (heroImageId) homepageData.hero_image = heroImageId;
  if (introImageId) homepageData.intro_image = introImageId;

  await updateSingleType(jwt, 'api::homepage.homepage', homepageData);
  await publishSingleType(jwt, 'api::homepage.homepage');
  console.log('  ✓ Homepage');

  // About page
  const aboutData: Record<string, unknown> = {
    title: 'À propos',
    biography: multiParagraphBlock([
      "Formé aux techniques traditionnelles de l'ébénisterie dans les ateliers du Faubourg Saint-Antoine, Christophe Daguet a développé très tôt une passion pour les bois nobles et le mobilier d'exception. Après plusieurs années d'apprentissage auprès de maîtres artisans, il a découvert le monde des antiquités et s'est pris de fascination pour le mobilier du XXe siècle, ses lignes audacieuses et ses matériaux chaleureux.",
      "Sa philosophie repose sur un profond respect du matériau. Qu'il restaure un fauteuil club des années 1950 ou crée une console contemporaine en chêne brûlé, Christophe cherche toujours le dialogue entre l'ancien et le contemporain. Chaque pièce est traitée avec le même soin, la même exigence : révéler la beauté du bois, honorer le travail de ceux qui l'ont façonné avant lui.",
      "Son atelier, situé au cœur de Paris, est un lieu où se côtoient outils traditionnels — varlopes, ciseaux à bois, gouges — et pièces chinées aux quatre coins de la France. C'est là que Christophe sélectionne, restaure et crée, entouré de l'odeur du bois et du silence concentré du travail bien fait.",
    ]),
    atelier_description: textBlock(
      "L'atelier est un espace de création où chaque outil a sa place et chaque pièce de bois attend de révéler son potentiel. Ouvert sur rendez-vous, il est aussi un lieu d'échange pour les amateurs de beau mobilier."
    ),
  };
  if (portraitImageId) aboutData.portrait_image = portraitImageId;
  if (atelierImageIds.length > 0) aboutData.atelier_images = atelierImageIds;

  await updateSingleType(jwt, 'api::about-page.about-page', aboutData);
  await publishSingleType(jwt, 'api::about-page.about-page');
  console.log('  ✓ About page');

  // Contact page
  await updateSingleType(jwt, 'api::contact-page.contact-page', {
    address: "12 rue de l'Atelier, 75011 Paris",
    phone: '01 23 45 67 89',
    email: 'contact@antiquedaguet.fr',
    google_maps_embed:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2625.4!2d2.38!3d48.86!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDUxJzM2LjAiTiAywrAyMic0OC4wIkU!5e0!3m2!1sfr!2sfr!4v1',
    social_instagram: 'https://instagram.com/daguet_antique',
    social_facebook: '',
  });
  await publishSingleType(jwt, 'api::contact-page.contact-page');
  console.log('  ✓ Contact page');

  // Site setting
  await updateSingleType(jwt, 'api::site-setting.site-setting', {
    site_name: 'Daguet Antique',
    footer_text: 'Ébénisterie, design et antiquités — Paris',
  });
  await publishSingleType(jwt, 'api::site-setting.site-setting');
  console.log('  ✓ Site setting');

  console.log('\n=== Seed completed successfully! ===');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
