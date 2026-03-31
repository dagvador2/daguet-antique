import type {
  Piece,
  Subcategory,
  Homepage,
  AboutPage,
  ContactPage,
  SiteSettings,
} from "./types";

// --- Subcategories ---

export const mockSubcategories: Subcategory[] = [
  // Antiquites
  { id: 1, name: "Sièges", slug: "sieges", category: "antiquite", order: 1 },
  { id: 2, name: "Tables", slug: "tables", category: "antiquite", order: 2 },
  {
    id: 3,
    name: "Rangements",
    slug: "rangements",
    category: "antiquite",
    order: 3,
  },
  { id: 4, name: "Miroirs", slug: "miroirs", category: "antiquite", order: 4 },
  {
    id: 5,
    name: "Objets décoratifs",
    slug: "objets-decoratifs",
    category: "antiquite",
    order: 5,
  },
  {
    id: 6,
    name: "Luminaires",
    slug: "luminaires",
    category: "antiquite",
    order: 6,
  },
  // Creations
  {
    id: 7,
    name: "Consoles",
    slug: "consoles",
    category: "creation",
    order: 1,
  },
  { id: 8, name: "Tables", slug: "tables-creation", category: "creation", order: 2 },
  { id: 9, name: "Miroirs", slug: "miroirs-creation", category: "creation", order: 3 },
];

// --- Pieces ---

export const mockPieces: Piece[] = [
  // Antiquites
  {
    id: 1,
    title: "Fauteuil club Art Déco en cuir",
    slug: "fauteuil-club-art-deco-cuir",
    description:
      "<p>Superbe fauteuil club des années 1930 en cuir havane patiné par le temps. Structure en hêtre massif, assise profonde et confortable. Un classique intemporel du mobilier français.</p><p>Ce fauteuil a été entièrement restauré dans notre atelier : ressorts, sangles et cuir d'origine conservés, patine nourrie et ravivée.</p>",
    photos: [
      {
        id: 1,
        url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=1000&fit=crop",
        alternativeText: "Fauteuil club Art Déco en cuir havane",
        width: 800,
        height: 1000,
        formats: null,
      },
      {
        id: 2,
        url: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=1000&fit=crop",
        alternativeText: "Détail du cuir patiné",
        width: 800,
        height: 1000,
        formats: null,
      },
    ],
    category: "antiquite",
    subcategory: mockSubcategories[0],
    period: "Années 1930",
    materials: "Cuir, hêtre massif",
    dimensions: "H.85 × L.80 × P.90 cm",
    provenance: "Paris",
    price: 2800,
    showPrice: true,
    status: "available",
    workInProgress: false,
    featured: true,
    publishedAt: "2026-03-28T10:00:00.000Z",
  },
  {
    id: 2,
    title: "Paire de chaises scandinaves en teck",
    slug: "paire-chaises-scandinaves-teck",
    description:
      "<p>Élégante paire de chaises danoises des années 1960, en teck massif et assise en corde tressée. Design épuré et lignes fluides caractéristiques du style scandinave.</p>",
    photos: [
      {
        id: 3,
        url: "https://images.unsplash.com/photo-1503602642458-232111445657?w=800&h=1000&fit=crop",
        alternativeText: "Chaises scandinaves en teck",
        width: 800,
        height: 1000,
        formats: null,
      },
    ],
    category: "antiquite",
    subcategory: mockSubcategories[0],
    period: "Années 1960",
    materials: "Teck massif, corde tressée",
    dimensions: "H.78 × L.50 × P.48 cm",
    provenance: "Danemark",
    price: 1200,
    showPrice: true,
    status: "sold",
    workInProgress: false,
    featured: false,
    publishedAt: "2026-03-25T10:00:00.000Z",
  },
  {
    id: 3,
    title: "Table basse en palissandre",
    slug: "table-basse-palissandre",
    description:
      "<p>Table basse rectangulaire en palissandre de Rio, design danois des années 1960. Plateau aux veinures remarquables, pieds fuselés. Un meuble d'exception pour les amateurs de mobilier mid-century.</p>",
    photos: [
      {
        id: 4,
        url: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&h=1000&fit=crop",
        alternativeText: "Table basse en palissandre de Rio",
        width: 800,
        height: 1000,
        formats: null,
      },
      {
        id: 5,
        url: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=1000&fit=crop",
        alternativeText: "Détail du plateau en palissandre",
        width: 800,
        height: 1000,
        formats: null,
      },
    ],
    category: "antiquite",
    subcategory: mockSubcategories[1],
    period: "Années 1960",
    materials: "Palissandre de Rio",
    dimensions: "H.45 × L.130 × P.60 cm",
    provenance: "Danemark",
    price: 3200,
    showPrice: true,
    status: "available",
    workInProgress: false,
    featured: true,
    publishedAt: "2026-03-20T10:00:00.000Z",
  },
  {
    id: 4,
    title: "Guéridon Art Nouveau en noyer",
    slug: "gueridon-art-nouveau-noyer",
    description:
      "<p>Ravissant guéridon Art Nouveau en noyer sculpté. Plateau rond, piétement galbé orné de motifs floraux. Parfait comme table d'appoint ou sellette.</p>",
    photos: [
      {
        id: 6,
        url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=1000&fit=crop",
        alternativeText: "Guéridon Art Nouveau en noyer",
        width: 800,
        height: 1000,
        formats: null,
      },
    ],
    category: "antiquite",
    subcategory: mockSubcategories[1],
    period: "Début XXe siècle",
    materials: "Noyer sculpté",
    dimensions: "H.72 × Ø55 cm",
    provenance: "France",
    price: null,
    showPrice: false,
    status: "available",
    workInProgress: false,
    featured: false,
    publishedAt: "2026-03-18T10:00:00.000Z",
  },
  {
    id: 5,
    title: "Enfilade scandinave en chêne",
    slug: "enfilade-scandinave-chene",
    description:
      "<p>Grande enfilade danoise des années 1950, en chêne blond. Quatre portes coulissantes révélant des étagères et tiroirs intérieurs. Poignées en laiton d'origine.</p>",
    photos: [
      {
        id: 7,
        url: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&h=1000&fit=crop",
        alternativeText: "Enfilade scandinave en chêne blond",
        width: 800,
        height: 1000,
        formats: null,
      },
    ],
    category: "antiquite",
    subcategory: mockSubcategories[2],
    period: "Années 1950",
    materials: "Chêne, laiton",
    dimensions: "H.85 × L.200 × P.45 cm",
    provenance: "Danemark",
    price: 4500,
    showPrice: true,
    status: "available",
    workInProgress: false,
    featured: true,
    publishedAt: "2026-03-15T10:00:00.000Z",
  },
  {
    id: 6,
    title: "Miroir soleil en rotin",
    slug: "miroir-soleil-rotin",
    description:
      "<p>Miroir soleil vintage en rotin tressé. Forme ronde avec rayons en éventail. Pièce décorative parfaite pour apporter chaleur et caractère à un intérieur.</p>",
    photos: [
      {
        id: 8,
        url: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=800&h=1000&fit=crop",
        alternativeText: "Miroir soleil en rotin tressé",
        width: 800,
        height: 1000,
        formats: null,
      },
    ],
    category: "antiquite",
    subcategory: mockSubcategories[3],
    period: "Années 1960",
    materials: "Rotin, miroir",
    dimensions: "Ø80 cm",
    provenance: "France",
    price: 380,
    showPrice: true,
    status: "sold",
    workInProgress: false,
    featured: false,
    publishedAt: "2026-03-12T10:00:00.000Z",
  },
  {
    id: 7,
    title: "Vase en céramique émaillée",
    slug: "vase-ceramique-emaillee",
    description:
      "<p>Grand vase en céramique émaillée aux tons bleu-vert. Forme organique, émail craquelé caractéristique des ateliers provençaux. Pièce unique signée.</p>",
    photos: [
      {
        id: 9,
        url: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&h=1000&fit=crop",
        alternativeText: "Vase en céramique émaillée bleu-vert",
        width: 800,
        height: 1000,
        formats: null,
      },
    ],
    category: "antiquite",
    subcategory: mockSubcategories[4],
    period: "Années 1950",
    materials: "Céramique émaillée",
    dimensions: "H.35 × Ø18 cm",
    provenance: "Provence",
    price: 450,
    showPrice: true,
    status: "available",
    workInProgress: false,
    featured: false,
    publishedAt: "2026-03-10T10:00:00.000Z",
  },
  {
    id: 8,
    title: "Lampe de bureau articulée en laiton",
    slug: "lampe-bureau-articulee-laiton",
    description:
      "<p>Lampe de bureau articulée des années 1950 en laiton patiné. Bras articulé, abat-jour orientable. Éclairage directionnel parfait pour un bureau ou une table de chevet.</p>",
    photos: [
      {
        id: 10,
        url: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=800&h=1000&fit=crop",
        alternativeText: "Lampe de bureau articulée en laiton",
        width: 800,
        height: 1000,
        formats: null,
      },
    ],
    category: "antiquite",
    subcategory: mockSubcategories[5],
    period: "Années 1950",
    materials: "Laiton patiné",
    dimensions: "H.45 cm (déplié)",
    provenance: "France",
    price: 320,
    showPrice: true,
    status: "available",
    workInProgress: false,
    featured: false,
    publishedAt: "2026-03-08T10:00:00.000Z",
  },

  // Creations
  {
    id: 9,
    title: "Console contemporaine chêne et acier",
    slug: "console-contemporaine-chene-acier",
    description:
      "<p>Console sur mesure en chêne massif et piétement en acier brossé. Lignes épurées, plateau aux bords adoucis. Réalisée dans notre atelier, cette pièce allie la noblesse du bois à la modernité du métal.</p>",
    photos: [
      {
        id: 11,
        url: "https://images.unsplash.com/photo-1611967164521-abae8fba4668?w=800&h=1000&fit=crop",
        alternativeText: "Console contemporaine en chêne et acier",
        width: 800,
        height: 1000,
        formats: null,
      },
      {
        id: 12,
        url: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=800&h=1000&fit=crop",
        alternativeText: "Détail de l'assemblage chêne-acier",
        width: 800,
        height: 1000,
        formats: null,
      },
    ],
    category: "creation",
    subcategory: mockSubcategories[6],
    period: null,
    materials: "Chêne massif, acier brossé",
    dimensions: "H.85 × L.120 × P.35 cm",
    provenance: null,
    price: 2400,
    showPrice: true,
    status: "available",
    workInProgress: false,
    featured: true,
    publishedAt: "2026-03-26T10:00:00.000Z",
  },
  {
    id: 10,
    title: "Table de repas en noyer",
    slug: "table-repas-noyer",
    description:
      "<p>Table de repas en noyer massif, plateau monoxyle aux bords naturels. Piétement en croix, finition huile dure. Chaque pièce est unique, façonnée à la main dans notre atelier parisien.</p>",
    photos: [
      {
        id: 13,
        url: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=1000&fit=crop",
        alternativeText: "Table de repas en noyer massif",
        width: 800,
        height: 1000,
        formats: null,
      },
    ],
    category: "creation",
    subcategory: mockSubcategories[7],
    period: null,
    materials: "Noyer massif, finition huile dure",
    dimensions: "H.75 × L.220 × P.95 cm",
    provenance: null,
    price: 4800,
    showPrice: true,
    status: "available",
    workInProgress: false,
    featured: false,
    publishedAt: "2026-03-22T10:00:00.000Z",
  },
  {
    id: 11,
    title: "Miroir encadré en chêne brûlé",
    slug: "miroir-encadre-chene-brule",
    description:
      "<p>Miroir mural avec cadre en chêne traité à la technique du bois brûlé (shou sugi ban). Finition contrastée noir et brun, texture unique. Une pièce d'art fonctionnelle.</p>",
    photos: [
      {
        id: 14,
        url: "https://images.unsplash.com/photo-1618220048045-10a6dbdf83e0?w=800&h=1000&fit=crop",
        alternativeText: "Miroir en chêne brûlé technique shou sugi ban",
        width: 800,
        height: 1000,
        formats: null,
      },
    ],
    category: "creation",
    subcategory: mockSubcategories[8],
    period: null,
    materials: "Chêne brûlé (shou sugi ban), miroir",
    dimensions: "H.120 × L.80 cm",
    provenance: null,
    price: 1600,
    showPrice: true,
    status: "available",
    workInProgress: false,
    featured: false,
    publishedAt: "2026-03-16T10:00:00.000Z",
  },
  {
    id: 12,
    title: "Banc d'entrée en frêne olivier",
    slug: "banc-entree-frene-olivier",
    description:
      "<p>Banc d'entrée en frêne olivier aux veinures exceptionnelles. Piétement conique tourné à la main. Pièce en cours de réalisation, disponible sur commande.</p>",
    photos: [
      {
        id: 15,
        url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=1000&fit=crop&q=80",
        alternativeText: "Banc en frêne olivier en cours de réalisation",
        width: 800,
        height: 1000,
        formats: null,
      },
    ],
    category: "creation",
    subcategory: mockSubcategories[6],
    period: null,
    materials: "Frêne olivier",
    dimensions: "H.45 × L.140 × P.40 cm",
    provenance: null,
    price: null,
    showPrice: false,
    status: "available",
    workInProgress: true,
    featured: false,
    publishedAt: "2026-03-05T10:00:00.000Z",
  },
];

// --- Homepage ---

export const mockHomepage: Homepage = {
  heroImage: {
    id: 100,
    url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&h=1080&fit=crop",
    alternativeText: "Intérieur avec mobilier vintage",
    width: 1920,
    height: 1080,
    formats: null,
  },
  heroTitle: "DAGUET ANTIQUE",
  heroSubtitle: "Ébéniste \u00B7 Designer \u00B7 Antiquaire",
  introText:
    "Passionné par le mobilier du XXe siècle et l'ébénisterie d'art, Christophe Daguet chine, restaure et crée des pièces uniques dans son atelier parisien. Chaque meuble raconte une histoire, chaque création est le fruit d'un savoir-faire artisanal transmis de génération en génération.",
  introImage: {
    id: 101,
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=600&fit=crop",
    alternativeText: "Atelier d'ébénisterie",
    width: 800,
    height: 600,
    formats: null,
  },
};

// --- About page ---

export const mockAboutPage: AboutPage = {
  title: "À propos",
  portraitImage: {
    id: 102,
    url: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=600&h=800&fit=crop",
    alternativeText: "Christophe Daguet dans son atelier",
    width: 600,
    height: 800,
    formats: null,
  },
  biography: `<p>Christophe Daguet est ébéniste, designer et antiquaire, installé à Paris depuis plus de vingt ans. Formé dans la tradition des Compagnons du Devoir, il a développé au fil des années un regard unique sur le mobilier, mêlant respect des techniques ancestrales et sensibilité contemporaine.</p>
<p>Son parcours l'a mené des grands ateliers de restauration parisiens aux marchés aux puces de Saint-Ouen, où il a aiguisé son œil pour les pièces d'exception. Spécialisé dans le mobilier du XXe siècle — Art Déco, modernisme, design scandinave —, il sait reconnaître la qualité d'une construction, la noblesse d'un matériau, l'élégance d'une ligne.</p>
<p>Dans son atelier du 11e arrondissement, Christophe restaure avec minutie les pièces qu'il chine et conçoit ses propres créations. Tables, consoles, miroirs : chaque meuble est pensé comme une rencontre entre le bois et la main, entre la tradition et la modernité.</p>
<p>Sa philosophie est simple : un beau meuble est un meuble qui vit. Qui porte les traces du temps sans perdre sa dignité. Qui trouve sa place dans un intérieur contemporain tout en racontant une histoire.</p>`,
  atelierImages: [
    {
      id: 103,
      url: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&h=600&fit=crop",
      alternativeText: "Vue de l'atelier d'ébénisterie",
      width: 800,
      height: 600,
      formats: null,
    },
  ],
  atelierDescription:
    "<p>L'atelier de Christophe se situe au cœur du 11e arrondissement de Paris, dans une ancienne menuiserie reconvertie. Un espace lumineux où cohabitent outils anciens et machines modernes, bois bruts et pièces en cours de restauration.</p>",
};

// --- Contact page ---

export const mockContactPage: ContactPage = {
  address: "12 Rue de l'Atelier, 75011 Paris",
  phone: "01 23 45 67 89",
  email: "contact@antiquedaguet.fr",
  googleMapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2625.4!2d2.38!3d48.86!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDUxJzM2LjAiTiAywrAyMic0OC4wIkU!5e0!3m2!1sfr!2sfr!4v1",
  socialInstagram: "https://instagram.com/daguet_antique",
  socialFacebook: null,
};

// --- Site settings ---

export const mockSiteSettings: SiteSettings = {
  siteName: "Daguet Antique",
  logo: null,
  footerText: "Ébéniste, designer et antiquaire",
};
