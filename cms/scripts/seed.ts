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
  const pieceDocMap = new Map<string, string>(); // title -> documentId

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
    pieceDocMap.set(piece.title, pieceDocId);
    console.log(`  ✓ ${piece.title}`);
  }
  console.log('');

  // 4. Create articles
  console.log('--- Creating articles ---');

  const ARTICLES = [
    {
      title: 'Comment reconnaître un meuble Art Déco authentique',
      excerpt: "Découvrez les critères essentiels pour identifier un véritable meuble Art Déco : matériaux, formes géométriques, marqueterie et signatures d'époque.",
      category: 'expertise',
      tags: ['art-deco', 'authentification', 'guide'],
      seo_keywords: 'meuble art déco authentique, reconnaître art déco, mobilier art déco',
      relatedPieceTitles: ['Enfilade Art Déco en palissandre', 'Paire de fauteuils club années 50'],
      imageUrl: 'https://picsum.photos/seed/article-artdeco/1200/675',
      body: [
        "L'Art Déco, mouvement né dans les années 1920 et culminant dans les années 1930, a profondément marqué le mobilier français. Mais comment distinguer une pièce authentique d'une reproduction ? Voici les clés essentielles pour reconnaître un véritable meuble Art Déco.",
        "Les matériaux nobles sont le premier indice. Les ébénistes Art Déco privilégiaient les bois exotiques : palissandre de Rio, ébène de Macassar, amarante, loupe de noyer. Le placage était une technique courante, mais réalisée avec une maîtrise exceptionnelle. La marqueterie géométrique — losanges, chevrons, motifs en soleil — est un signe distinctif de l'époque.",
        "Les formes caractéristiques constituent le deuxième critère. Le mobilier Art Déco se reconnaît à ses lignes géométriques épurées, ses volumes imposants et ses symétries affirmées. Les pieds sont souvent droits ou légèrement évasés, loin des courbes sinueuses de l'Art Nouveau qui le précède. Les angles sont nets, les proportions généreuses.",
        "L'ornementation mérite une attention particulière. Contrairement au style Art Nouveau, chargé de motifs végétaux, l'Art Déco privilégie les motifs abstraits et géométriques. On retrouve fréquemment des garnitures en laiton, en bronze doré ou en ivoire (ce dernier étant aujourd'hui interdit au commerce). Les poignées et serrures sont souvent des pièces décoratives à part entière.",
        "La qualité de construction est un indicateur fiable. Un meuble Art Déco authentique présente des assemblages traditionnels — queues d'aronde, tenons-mortaises — réalisés avec une précision remarquable. Le dos et le fond du meuble sont généralement en bois massif ou en contreplaqué de qualité, jamais en aggloméré (qui n'existait pas à l'époque).",
        "Les signatures et les estampilles méritent d'être recherchées. De grands noms comme Émile-Jacques Ruhlmann, Jules Leleu, Jacques Adnet ou la Maison Dominique signaient leurs créations. Une estampille au fer ou une étiquette augmente considérablement la valeur et l'authenticité de la pièce.",
        "Les proportions et l'ergonomie reflètent les usages de l'époque. Les buffets et enfilades Art Déco sont souvent plus hauts et plus profonds que leurs équivalents contemporains. Les fauteuils, conçus pour une posture assise plus droite, offrent un confort différent de nos fauteuils actuels.",
        "Enfin, la patine du temps est irremplaçable. Un meuble authentique de 90 ans présente des traces d'usage, une couleur du bois qui s'est enrichie avec le temps, des usures légères aux endroits de contact fréquent. Ces signes ne sont pas des défauts mais des preuves d'authenticité que les reproductions ne peuvent imiter.",
      ],
    },
    {
      title: "De la planche au meuble : fabrication d'une console sur mesure",
      excerpt: "Suivez pas à pas la création d'une console sur mesure dans notre atelier parisien, du choix du bois brut à la finition finale.",
      category: 'savoir-faire',
      tags: ['atelier', 'creation', 'processus'],
      seo_keywords: 'ébéniste paris, console sur mesure, fabrication meuble bois',
      relatedPieceTitles: ['Console murale en chêne brûlé', 'Table de salon en noyer et résine'],
      imageUrl: 'https://picsum.photos/seed/article-console/1200/675',
      body: [
        "Créer un meuble sur mesure, c'est un dialogue constant entre le bois et la main de l'artisan. Dans cet article, nous vous emmenons dans les coulisses de la fabrication d'une console en chêne, de la première planche à la pièce finie.",
        "Tout commence par le choix du bois. Pour cette console, nous avons sélectionné un chêne français séché naturellement pendant deux ans dans un séchoir à bois de la Nièvre. Les planches sont triées une à une pour leur grain, leur couleur et l'absence de défauts structurels. Ce moment de sélection est crucial : c'est ici que se dessine la personnalité du meuble futur.",
        "Le débit et le corroyage constituent les premières transformations. Les planches brutes sont débitées à la scie à ruban aux dimensions approximatives, puis corroyées — dégauchies et rabotées — pour obtenir des faces parfaitement planes et d'épaisseur constante. Cette étape révèle le grain du bois dans toute sa beauté.",
        "Le tracé et l'assemblage exigent une précision au dixième de millimètre. Pour cette console, nous utilisons des assemblages traditionnels : tenons-mortaises pour la structure, queues d'aronde pour les tiroirs. Chaque joint est tracé au trusquin et à l'équerre, découpé à la main avec des ciseaux à bois affûtés, puis ajusté par essais successifs.",
        "Le collage et le serrage se font sans aucune vis ni clou apparent. La colle vinylique, chauffée pour une meilleure pénétration dans les fibres, assure une liaison plus résistante que le bois lui-même. Le meuble assemblé repose sous serre pendant 24 heures minimum avant tout travail de finition.",
        "Le ponçage est un art en soi. En partant d'un grain 80, nous progressons méthodiquement jusqu'au grain 320, parfois 400 pour le chêne. Chaque passage élimine les traces du précédent et prépare le bois à recevoir la finition. Entre chaque grain, la surface est dépoussiérée à l'aspirateur et essuyée au chiffon humide pour soulever les dernières fibres.",
        "La technique du shou sugi ban, que nous employons pour certaines de nos consoles, ajoute une dimension supplémentaire. Le bois est brûlé au chalumeau de façon contrôlée, puis brossé vigoureusement pour éliminer les couches carbonisées superficielles. Le résultat est une surface texturée d'un noir profond aux reflets bleutés, résistante aux insectes et à l'humidité.",
        "La finition huile-cire constitue l'étape ultime. Nous appliquons deux couches d'huile dure naturelle qui pénètre en profondeur dans les fibres, suivies d'une cire d'abeille qui protège la surface tout en lui conférant un toucher soyeux. Le meuble est alors laissé au repos pendant une semaine avant livraison.",
        "De la première planche au meuble fini, la fabrication de cette console aura nécessité environ 80 heures de travail réparties sur trois semaines. Un temps long qui garantit la qualité et la pérennité de la pièce — un meuble fait pour traverser les générations.",
      ],
    },
    {
      title: "L'histoire derrière cette table de ferme des années 1940",
      excerpt: "Chaque meuble raconte une histoire. Découvrez le parcours fascinant de cette table brutaliste en chêne, du monde rural à notre atelier.",
      category: 'coulisses',
      tags: ['histoire', 'chine', 'restauration'],
      seo_keywords: 'table ancienne, mobilier années 40, histoire meuble ancien',
      relatedPieceTitles: ['Table basse brutaliste en chêne', "Chaise d'atelier Nicolle"],
      imageUrl: 'https://picsum.photos/seed/article-table/1200/675',
      body: [
        "Il y a des meubles qui portent en eux bien plus que du bois et des assemblages. Cette table basse en chêne massif, que nous avons trouvée dans une ferme du Perche, est de ceux-là. Voici son histoire.",
        "C'est lors d'une tournée de chine dans le Perche normand, en février dernier, que nous avons découvert cette table. Elle se trouvait dans une grange attenante à une ferme du XVIIIe siècle, couverte de poussière et servant de support à des outils de jardinage. Le propriétaire, un agriculteur à la retraite, nous a raconté qu'elle était là « depuis toujours ».",
        "L'examen du meuble a révélé des indices fascinants sur son origine. Le plateau, d'une seule pièce de chêne de 120 cm de long et 60 cm de large, présente un grain serré caractéristique des chênes centenaires. Les pieds, massifs et légèrement évasés, portent des traces de travail à la plane — un outil manuel qui a précédé le rabot électrique.",
        "Nous estimons sa fabrication aux années 1940, probablement pendant l'Occupation, quand les artisans ruraux fabriquaient des meubles solides avec les moyens du bord. L'absence de tout ornement, les lignes brutes et fonctionnelles, la robustesse presque excessive de la construction : tout indique un meuble fait pour durer, créé dans une époque où l'on ne gaspillait rien.",
        "La restauration a demandé un travail délicat de remise en état sans dénaturer. Le plateau présentait des marques de couteaux, des traces de brûlure et quelques fentes superficielles. Plutôt que de les effacer, nous avons choisi de les préserver : elles font partie de l'histoire. Un ponçage léger a suffi pour raviver la couleur du chêne, passée du gris argenté de l'exposition à l'air à un brun doré chaleureux.",
        "Les assemblages, d'une solidité remarquable après plus de 80 ans, n'ont nécessité qu'un recollage partiel et le remplacement de deux chevilles en bois. Les pieds ont été nettoyés et légèrement poncés, puis traités à l'huile dure pour les protéger.",
        "La finition a été minimaliste et respectueuse : deux couches d'huile de tung naturelle qui pénètre le bois en profondeur sans former de film en surface. Le résultat conserve le toucher brut du chêne tout en protégeant le bois des taches et de l'humidité.",
        "Aujourd'hui, cette table de ferme a trouvé une seconde vie dans notre collection. De meuble utilitaire oublié dans une grange, elle est devenue une table basse au caractère unique, témoignage d'un savoir-faire rural et d'une époque révolue. Chaque marque sur sa surface raconte un chapitre de son histoire — et c'est précisément ce qui fait sa beauté.",
      ],
    },
    {
      title: 'Pourquoi le mobilier français du XXe siècle séduit les décorateurs du monde entier',
      excerpt: "Le mobilier vintage français connaît un engouement mondial. Décryptage d'une tendance de fond portée par les décorateurs, designers et collectionneurs internationaux.",
      category: 'marche',
      tags: ['marche', 'tendances', 'international'],
      seo_keywords: 'mobilier français vintage, French vintage furniture, décoration intérieure',
      relatedPieceTitles: ['Buffet scandinave en teck', "Lampe de bureau industrielle Jieldé"],
      imageUrl: 'https://picsum.photos/seed/article-marche/1200/675',
      body: [
        "Depuis une dizaine d'années, le mobilier français du XXe siècle connaît un engouement sans précédent sur la scène internationale. Des showrooms de Los Angeles aux appartements londoniens, des hôtels de luxe à Tokyo aux résidences new-yorkaises, les pièces françaises vintage sont devenues incontournables. Décryptage d'un phénomène.",
        "L'attrait pour le mobilier français s'explique d'abord par sa diversité stylistique exceptionnelle. Le XXe siècle français a vu se succéder des mouvements d'une richesse incomparable : l'Art Nouveau, l'Art Déco, le modernisme, le style reconstruction, le design industriel, le style scandinave interprété à la française. Chaque décennie a produit des pièces remarquables.",
        "La qualité de fabrication est un facteur déterminant. Les meubles français du XXe siècle bénéficient d'une tradition artisanale multiséculaire. Même les pièces de production semi-industrielle des années 1950-1960 présentent un niveau de finition supérieur à ce que l'on trouve dans la production de masse actuelle. Les bois sont massifs, les assemblages traditionnels, les finitions soignées.",
        "Les décorateurs internationaux apprécient particulièrement la capacité du mobilier français à s'intégrer dans des intérieurs contemporains. Un fauteuil club des années 1940, une enfilade Art Déco, une lampe Jieldé s'associent naturellement avec des meubles modernes pour créer des intérieurs éclectiques et personnels — l'antithèse du décor standardisé.",
        "Le marché américain est particulièrement dynamique. Les designers d'intérieur de la côte Est et de la côte Ouest s'arrachent les pièces françaises, qu'ils considèrent comme des investissements autant que des objets décoratifs. Les salons comme la Biennale des Antiquaires à Paris ou le Marché aux Puces de Saint-Ouen attirent chaque année davantage d'acheteurs internationaux.",
        "Le marché anglais, traditionnellement tourné vers l'antiquité britannique, s'est lui aussi ouvert au mobilier français. Les marchands londoniens proposent de plus en plus de pièces Art Déco et modernistes françaises, répondant à une demande croissante de la part d'une clientèle cosmopolite en quête d'authenticité.",
        "L'essor du marché en ligne a considérablement élargi la portée du mobilier français. Des plateformes spécialisées permettent aujourd'hui aux collectionneurs du monde entier d'accéder à des pièces qui étaient autrefois réservées aux initiés fréquentant les marchés aux puces et les brocantes françaises.",
        "Les prix reflètent cet engouement. Les pièces signées par de grands noms — Prouvé, Perriand, Royère, Guariche — atteignent des sommets aux enchères. Mais au-delà de ces signatures prestigieuses, l'ensemble du mobilier français du XXe siècle connaît une appréciation régulière, faisant de ces pièces un placement à la fois esthétique et financier.",
        "Cette tendance n'est pas un effet de mode passager. Elle s'inscrit dans un mouvement profond de retour à l'authenticité, à la durabilité et au beau qui ne peut que se renforcer à mesure que la production industrielle standardisée montre ses limites.",
      ],
    },
    {
      title: 'Guide des essences de bois dans le mobilier ancien français',
      excerpt: "Noyer, chêne, acajou, merisier : apprenez à identifier les essences de bois utilisées dans le mobilier ancien français et leurs caractéristiques.",
      category: 'expertise',
      tags: ['bois', 'guide', 'identification'],
      seo_keywords: 'essences bois meuble ancien, identifier bois meuble, chêne noyer acajou',
      relatedPieceTitles: ['Table de salon en noyer et résine', "Banc d'entrée en frêne"],
      imageUrl: 'https://picsum.photos/seed/article-bois/1200/675',
      body: [
        "Savoir identifier une essence de bois est fondamental pour tout amateur de mobilier ancien. Chaque bois a ses caractéristiques visuelles, sa densité, son grain — et sa valeur. Voici un guide des principales essences que vous rencontrerez dans le mobilier français.",
        "Le chêne est le roi des forêts françaises et le bois le plus utilisé dans le mobilier traditionnel. Reconnaissable à son grain prononcé et sa teinte dorée qui fonce avec le temps, le chêne est un bois dur et résistant. On le retrouve dans les coffres médiévaux, les buffets Renaissance, les tables de ferme et les parquets nobles. Sa couleur varie du blond clair au brun foncé selon l'âge et la finition.",
        "Le noyer est le bois noble par excellence de l'ébénisterie française. Sa palette va du brun clair au brun chocolat foncé, avec des veinures spectaculaires qui peuvent inclure des zones de loupe (excroissances) très prisées. Le noyer est plus tendre que le chêne mais se travaille merveilleusement bien. Il a été le bois de prédilection des ébénistes depuis le XVIIe siècle pour les commodes, secrétaires et tables de salon.",
        "L'acajou, importé des Amériques et d'Afrique, a connu son apogée au XVIIIe siècle et sous l'Empire. Sa couleur rouge-brun qui s'approfondit avec le temps, sa stabilité exceptionnelle et sa facilité de polissage en ont fait le bois favori des grands ébénistes. On distingue l'acajou de Cuba (le plus précieux), l'acajou du Honduras et l'acajou d'Afrique.",
        "Le merisier, ou cerisier sauvage, offre une teinte rosée à brun-rouge qui lui est propre. Plus abordable que le noyer, il a été largement utilisé dans le mobilier régional français, notamment en Normandie et en Île-de-France. Sa couleur s'enrichit magnifiquement avec le temps, prenant des tons dorés et ambrés.",
        "Le hêtre est le bois des sièges par excellence. Moins noble que le noyer ou le chêne en apparence, il possède des qualités mécaniques exceptionnelles : résistant à la flexion, il se cintrer facilement à la vapeur. C'est pourquoi on le retrouve dans la quasi-totalité des chaises et fauteuils français, des sièges Louis XV aux chaises bistrot. Sa teinte claire et son grain fin le rendent facile à teinter.",
        "Le frêne est apprécié pour ses qualités mécaniques et son grain élégant. Le frêne-olivier, variété aux veinures ondulées spectaculaires, est particulièrement recherché pour les pièces contemporaines. Sa couleur claire et ses dessins naturels en font un bois de caractère pour les tables et consoles.",
        "Le palissandre, bois tropical précieux, a été massivement utilisé dans le mobilier Art Déco. Ses tons sombres allant du brun violacé au noir, ses veinures contrastées et son poli naturel en ont fait le matériau emblématique de ce style. Le palissandre de Rio, le plus recherché, est aujourd'hui protégé par la convention CITES.",
        "Le teck, bois tropical originaire d'Asie du Sud-Est, est le matériau signature du design scandinave des années 1950-1970. Sa teinte brun doré, sa résistance naturelle à l'humidité et aux insectes, et son toucher satiné expliquent sa popularité durable. Les buffets, tables et sièges en teck restent très recherchés sur le marché de la seconde main.",
        "Apprendre à identifier ces essences est un savoir qui s'acquiert avec l'expérience. La couleur, le grain, la densité, l'odeur même du bois fraîchement poncé sont autant d'indices. N'hésitez pas à manipuler les meubles, à observer les parties non finies (fond de tiroir, dos du meuble) où le bois se montre dans sa vérité.",
      ],
    },
  ];

  for (const article of ARTICLES) {
    // Upload cover image
    let coverImageId: number | undefined;
    try {
      const slug = article.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      coverImageId = await uploadImageFromUrl(jwt, article.imageUrl, `${slug}-cover.jpg`);
    } catch (err: any) {
      console.warn(`  ⚠ Cover image upload failed for "${article.title}": ${err.message}`);
    }

    // Resolve related pieces
    const relatedPieceDocIds = article.relatedPieceTitles
      .map((title) => pieceDocMap.get(title))
      .filter(Boolean)
      .map((docId) => ({ documentId: docId }));

    const entryData: Record<string, unknown> = {
      title: article.title,
      excerpt: article.excerpt,
      body: multiParagraphBlock(article.body),
      category: article.category,
      language: 'fr',
      tags: article.tags,
      seo_keywords: article.seo_keywords,
      related_pieces: relatedPieceDocIds.length > 0 ? relatedPieceDocIds : undefined,
    };

    if (coverImageId) entryData.cover_image = coverImageId;

    // Remove undefined values
    for (const key of Object.keys(entryData)) {
      if (entryData[key] === undefined) delete entryData[key];
    }

    const result = await createEntry(jwt, 'api::article.article', entryData);
    const articleDocId = result.data?.documentId || result.documentId;
    await publishEntry(jwt, 'api::article.article', articleDocId);
    console.log(`  ✓ ${article.title}`);
  }
  console.log('');

  // 5. Seed single types
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
