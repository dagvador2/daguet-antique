# Daguet Antique — Spécifications Techniques

## 1. Résumé du projet

**Client :** Christophe Daguet — Ébéniste, designer, antiquaire
**Nom du site :** Daguet Antique
**Domaine prévu :** antiquedaguet.fr
**Déploiement :** Vercel (frontend) + Strapi CMS (backend headless)
**Paiement en ligne :** Non — virements et paiements sur place uniquement
**Langues :** Français uniquement (v1)

Le site vitrine/catalogue permet à Christophe de présenter ses antiquités (mobilier XXe siècle principalement) et ses créations personnelles d'ébénisterie/design. Il doit pouvoir gérer son contenu en autonomie via un dashboard admin (Strapi).

---

## 2. Stack technique

### Frontend
- **Framework :** Next.js 14+ (App Router)
- **Styling :** Tailwind CSS
- **Animations :** Framer Motion (transitions de page, hover sur pièces, apparitions au scroll)
- **Déploiement :** Vercel
- **Images :** Next.js Image component avec optimisation automatique (Vercel Image Optimization)

### Backend / CMS
- **CMS :** Strapi v5 (headless)
- **Base de données :** PostgreSQL (recommandé pour production)
- **Upload média :** Strapi Media Library (avec plugin Cloudinary optionnel pour CDN)
- **Hébergement Strapi :** VPS (Hetzner/OVH) ou Railway/Render
- **API :** REST ou GraphQL (Strapi supporte les deux nativement)

### Intégrations
- **Instagram :** Instagram Basic Display API ou embed via oEmbed
- **Google Maps :** Embed iframe sur la page Contact
- **Analytics :** Plausible ou Matomo (RGPD-friendly, pas de bandeau cookie)

---

## 3. Architecture des pages

### 3.1 Header global

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo/Nom: DAGUET ANTIQUE]    Antiquités | Travaux | À propos | Contact  │
└─────────────────────────────────────────────────────────────┘
```

- Logo texte ou image (à fournir par Christophe)
- Navigation fixe en haut (sticky header avec effet de réduction au scroll)
- Menu hamburger sur mobile
- Pas de barre de recherche en v1 (volume de pièces encore limité)

**Données Strapi :** Collection `site-settings` (singleton) avec champs logo, nom du site.

---

### 3.2 Page d'accueil (`/`)

**Structure :**

1. **Hero section** — Image plein écran d'une mise en scène (pièce phare dans un décor). Titre superposé discret. Bouton CTA "Découvrir les collections" ou équivalent.

2. **Dernières pièces** — Grille des 6-8 pièces les plus récentes (toutes catégories confondues). Chaque carte : photo, titre, catégorie (tag). Au hover : léger zoom sur l'image + apparition d'un overlay subtil.

3. **Bloc présentation** — Court texte d'accroche (2-3 lignes) + photo de Christophe ou de l'atelier + lien "En savoir plus" vers la page À propos.

4. **Feed Instagram** — Section avec les 4-6 derniers posts Instagram (grille).

**Données Strapi :**
- `homepage` (singleton) : hero_image, hero_title, hero_subtitle, intro_text, intro_image
- Les "dernières pièces" = query API triée par date de création (desc), limit 8

---

### 3.3 Page Antiquités (`/antiquites`)

**Structure :**

1. **En-tête de page** — Titre "Antiquités" + courte description éditable.

2. **Filtres par sous-catégorie** — Barre horizontale de filtres cliquables (tous, sièges, tables, rangements, miroirs, objets décoratifs, luminaires, etc.). Filtrage côté client sans rechargement de page.

3. **Grille de pièces** — Masonry ou grille régulière. Chaque pièce affiche : photo principale, titre, époque/période, badge "Vendu" si applicable. Au clic → page de détail de la pièce.

4. **Pagination** ou infinite scroll.

**Page de détail d'une pièce** (`/antiquites/[slug]`) :
- Galerie photo (carousel ou lightbox, photos multiples)
- Titre
- Description (texte riche, éditeur WYSIWYG dans Strapi)
- Informations : époque, dimensions (H×L×P), matériaux, provenance (optionnel)
- Statut : Disponible / Vendu
- Prix : affiché ou "Prix sur demande" (champ optionnel)
- Bouton "Contacter pour cette pièce" (lien mailto ou ancre vers formulaire contact avec sujet pré-rempli)
- Pièces similaires (même sous-catégorie, 3-4 suggestions)

**Données Strapi — Collection `pieces` :**

| Champ | Type | Requis | Notes |
|-------|------|--------|-------|
| title | Text | Oui | Nom de la pièce |
| slug | UID (basé sur title) | Oui | Auto-généré |
| description | Rich Text | Non | Description longue |
| photos | Media (multiple) | Oui | Min 1 photo |
| category | Enum | Oui | "antiquite" ou "creation" |
| subcategory | Relation → subcategories | Oui | Lien vers sous-catégorie |
| period | Text | Non | Ex: "Années 1950", "XIXe siècle" |
| materials | Text | Non | Ex: "Chêne massif, laiton" |
| dimensions | Text | Non | Ex: "H.85 × L.120 × P.45 cm" |
| provenance | Text | Non | Origine géographique |
| price | Number | Non | Prix en euros (null = sur demande) |
| show_price | Boolean | Oui | Afficher le prix ou "Sur demande" |
| status | Enum | Oui | "available" / "sold" |
| featured | Boolean | Non | Mise en avant sur la homepage |
| publishedAt | DateTime | Oui | Date de publication (tri) |

**Collection `subcategories` :**

| Champ | Type | Notes |
|-------|------|-------|
| name | Text | Ex: "Sièges", "Tables" |
| slug | UID | Auto-généré |
| category | Enum | "antiquite" ou "creation" |
| order | Number | Ordre d'affichage |

---

### 3.4 Page Travaux / Créations (`/travaux`)

**Structure identique** à la page Antiquités, mais filtrée sur `category = "creation"`.

Les sous-catégories seront différentes (à définir avec Christophe) : Consoles, Tables, Miroirs, Pièces en cours, etc.

**Différence notable :** Les créations peuvent avoir un champ supplémentaire `work_in_progress` (Boolean) pour afficher un badge "En cours de réalisation".

Ajout au modèle `pieces` :

| Champ | Type | Notes |
|-------|------|-------|
| work_in_progress | Boolean | Uniquement pour les créations |

---

### 3.5 Page À propos (`/a-propos`)

**Structure :**

1. **Titre** — "À propos" ou titre personnalisé
2. **Photo portrait** — Christophe posé sur/devant une de ses créations (grande image)
3. **Texte biographique** — Texte riche (le texte rédigé par son ancienne collègue). Éditeur WYSIWYG dans Strapi.
4. **Section Atelier** (optionnel) — Photos de l'atelier, description du lieu de travail.

**Données Strapi — `about-page` (singleton) :**

| Champ | Type | Notes |
|-------|------|-------|
| title | Text | Titre de la page |
| portrait_image | Media | Photo de Christophe |
| biography | Rich Text | Texte biographique complet |
| atelier_images | Media (multiple) | Photos de l'atelier |
| atelier_description | Rich Text | Texte sur l'atelier |

---

### 3.6 Page Contact (`/contact`)

**Structure :**

1. **Coordonnées** — Adresse, téléphone, email
2. **Carte Google Maps** — Embed iframe, localisation de l'atelier
3. **Formulaire de contact** — Nom, email, sujet (dropdown : Renseignement, Pièce spécifique, Commande, Presse), message. Envoi par email via Strapi plugin email ou service tiers (Resend, SendGrid).
4. **Mention** — "Sur rendez-vous uniquement" si applicable
5. **Liens réseaux sociaux** — Instagram principalement

**Données Strapi — `contact-page` (singleton) :**

| Champ | Type | Notes |
|-------|------|-------|
| address | Text | Adresse complète |
| phone | Text | Numéro de téléphone |
| email | Email | Email de contact |
| google_maps_embed | Text | URL embed Google Maps |
| appointment_only | Boolean | Afficher "Sur RDV uniquement" |
| social_instagram | Text | URL profil Instagram |
| social_facebook | Text | URL profil Facebook (optionnel) |

---

### 3.7 Footer global

```
┌─────────────────────────────────────────────────────────────┐
│  DAGUET ANTIQUE                                             │
│  [Adresse] · [Téléphone] · [Email]                         │
│  Antiquités · Travaux · À propos · Contact                  │
│  [Icône Instagram]                                          │
│  © 2026 Daguet Antique — Tous droits réservés               │
│  Mentions légales                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Dashboard Admin (Strapi)

### 4.1 Ce que Strapi fournit nativement

- Interface d'administration complète avec authentification
- CRUD sur toutes les collections (pièces, sous-catégories)
- Éditeur de texte riche (WYSIWYG)
- Gestion des médias (upload, galerie, redimensionnement)
- Gestion des rôles et permissions (Christophe = admin, possibilité d'ajouter son fils)
- API REST/GraphQL auto-générée
- Preview et brouillons (draft/publish)

### 4.2 Workflow utilisateur type

**Ajouter une nouvelle pièce :**
1. Connexion au dashboard Strapi (URL dédiée, ex: admin.antiquedaguet.fr)
2. Menu "Pièces" → "Créer une nouvelle entrée"
3. Remplir : titre, description, photos (drag & drop), catégorie, sous-catégorie, dimensions, prix, statut
4. "Publier" → la pièce apparaît automatiquement sur le site

**Marquer une pièce comme vendue :**
1. Trouver la pièce dans la liste
2. Changer le statut de "Disponible" à "Vendu"
3. Sauvegarder → le badge "Vendu" apparaît sur le site

**Retirer une pièce :**
1. Dépublier (la pièce disparaît du site mais reste en base) ou supprimer définitivement

### 4.3 Personnalisation Strapi

- **Customisation du dashboard** : logo Daguet Antique, couleurs personnalisées
- **Champs conditionnels** : `work_in_progress` visible uniquement quand `category = "creation"`
- **Tri par défaut** : pièces triées par date de publication (plus récentes en premier)
- **Webhook** : Strapi → Vercel (déclencher un rebuild/revalidation ISR à chaque modification de contenu)

---

## 5. Direction artistique & Design

### 5.1 Références visuelles

- **The Peanut Vendor** (thepeanutvendor.co.uk) : structure catalogue, photographie des pièces sur fond neutre, esthétique épurée
- **ObjetVagabond** (objetvagabond.com) : hero image lifestyle, typographie serif élégante, beaucoup de blanc
- **Studio Nacho Carbonell** (nachocarbonell.com) : page contact avec carte, biographie avec portrait

### 5.2 Palette de couleurs

```css
:root {
  /* Fond principal */
  --bg-primary: #FAFAF8;        /* Blanc cassé / crème très léger */
  --bg-secondary: #F2F0EC;      /* Gris chaud clair (sections alternées) */
  
  /* Texte */
  --text-primary: #1A1A1A;      /* Noir profond (titres) */
  --text-secondary: #4A4A4A;    /* Gris foncé (corps de texte) */
  --text-muted: #8A8A8A;        /* Gris moyen (métadonnées, légendes) */
  
  /* Accents */
  --accent: #2C2C2C;            /* Noir mat (boutons, liens actifs) */
  --accent-hover: #555555;      /* Gris pour hover */
  --sold-badge: #C4A77D;        /* Doré/bronze discret pour badge "Vendu" */
  
  /* Bordures */
  --border: #E5E3DF;            /* Bordures très légères */
}
```

### 5.3 Typographie

- **Titres / Navigation :** Serif élégant — `Cormorant Garamond`, `Playfair Display`, ou `EB Garamond` (Google Fonts). Utilisation en poids 400-600, uppercase pour les titres de navigation, mixed case pour les titres de page.
- **Corps de texte :** Sans-serif sobre — `DM Sans`, `Outfit`, ou `Libre Franklin`. Poids 300-400, taille 16-18px.
- **Prix / Métadonnées :** Même sans-serif, poids léger, taille réduite.

### 5.4 Principes de design

- **Photographie-first** : les images des pièces sont les stars. Fond neutre, éclairage soigné. Le site doit mettre en valeur les photos, pas les parasiter.
- **Espacement généreux** : beaucoup de blanc, les pièces respirent.
- **Grille sobre** : colonnes régulières, pas de masonry trop chaotique. 2-3 colonnes desktop, 1-2 mobile.
- **Transitions douces** : fade-in au scroll, zoom subtil au hover, transitions de page fluides.
- **Pas de couleurs vives** : palette neutre/terreuse. Les matériaux (bois, métal, cuir) apportent la couleur.
- **Mobile-first** : le site doit être irréprochable sur téléphone (beaucoup de clients potentiels naviguent sur mobile).

### 5.5 Composants UI clés

**Carte de pièce (grille catalogue) :**
```
┌──────────────────┐
│                  │
│   [Photo]        │
│                  │
├──────────────────┤
│ Titre de la pièce│
│ Années 1950      │
│ [VENDU]          │
└──────────────────┘
```
- Photo : ratio 4:5 ou 1:1, object-fit cover
- Au hover : scale(1.03) sur l'image, ombre portée légère
- Badge "Vendu" en overlay semi-transparent sur la photo

**Hero homepage :**
- Image plein écran (100vw × 80vh minimum)
- Titre en overlay avec fond semi-transparent ou text-shadow
- Parallaxe subtil optionnel

---

## 6. Structure du projet Next.js

```
daguet-antique/
├── public/
│   ├── fonts/                    # Polices locales si besoin
│   └── images/                   # Assets statiques (logo, icônes)
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Layout racine (header + footer)
│   │   ├── page.tsx              # Page d'accueil
│   │   ├── antiquites/
│   │   │   ├── page.tsx          # Catalogue antiquités
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Détail d'une pièce antiquité
│   │   ├── travaux/
│   │   │   ├── page.tsx          # Catalogue créations
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # Détail d'une création
│   │   ├── a-propos/
│   │   │   └── page.tsx          # Page À propos
│   │   ├── contact/
│   │   │   └── page.tsx          # Page Contact
│   │   └── mentions-legales/
│   │       └── page.tsx          # Mentions légales
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx        # Header + navigation
│   │   │   ├── Footer.tsx        # Footer
│   │   │   ├── MobileMenu.tsx    # Menu mobile (hamburger)
│   │   │   └── Navigation.tsx    # Liens de navigation
│   │   ├── pieces/
│   │   │   ├── PieceCard.tsx     # Carte dans la grille
│   │   │   ├── PieceGrid.tsx     # Grille de pièces
│   │   │   ├── PieceGallery.tsx  # Galerie photo (détail)
│   │   │   ├── PieceInfo.tsx     # Infos détaillées
│   │   │   ├── PieceFilters.tsx  # Filtres par sous-catégorie
│   │   │   └── SoldBadge.tsx     # Badge "Vendu"
│   │   ├── home/
│   │   │   ├── Hero.tsx          # Hero section
│   │   │   ├── LatestPieces.tsx  # Dernières pièces
│   │   │   ├── IntroBlock.tsx    # Bloc de présentation
│   │   │   └── InstagramFeed.tsx # Feed Instagram
│   │   ├── contact/
│   │   │   ├── ContactForm.tsx   # Formulaire
│   │   │   └── MapEmbed.tsx      # Carte Google Maps
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Badge.tsx
│   │       ├── Lightbox.tsx      # Lightbox pour galeries photo
│   │       └── ScrollReveal.tsx  # Animation d'apparition au scroll
│   ├── lib/
│   │   ├── strapi.ts             # Client API Strapi (fetch helpers)
│   │   ├── types.ts              # Types TypeScript (Piece, Subcategory, etc.)
│   │   └── utils.ts              # Utilitaires (formatPrice, etc.)
│   └── styles/
│       └── globals.css           # Styles globaux + variables CSS + Tailwind
├── tailwind.config.ts
├── next.config.ts
├── package.json
└── .env.local                    # STRAPI_URL, STRAPI_TOKEN, etc.
```

---

## 7. API Strapi — Endpoints principaux

### Pièces

```
GET /api/pieces?filters[category][$eq]=antiquite&populate=*&sort=publishedAt:desc
GET /api/pieces?filters[category][$eq]=creation&populate=*&sort=publishedAt:desc
GET /api/pieces?filters[slug][$eq]={slug}&populate=*
GET /api/pieces?filters[featured][$eq]=true&populate=*&pagination[limit]=8&sort=publishedAt:desc
```

### Sous-catégories

```
GET /api/subcategories?filters[category][$eq]=antiquite&sort=order:asc
GET /api/subcategories?filters[category][$eq]=creation&sort=order:asc
```

### Pages statiques (singletons)

```
GET /api/homepage?populate=*
GET /api/about-page?populate=*
GET /api/contact-page?populate=*
GET /api/site-setting?populate=*
```

### Formulaire de contact

```
POST /api/contact-submissions
Body: { name, email, subject, message }
```
→ Strapi lifecycle hook envoie un email à Christophe via plugin email (Resend/SendGrid/SMTP).

---

## 8. Stratégie de rendu Next.js

| Page | Stratégie | Justification |
|------|-----------|---------------|
| Accueil | ISR (revalidate: 60) | Contenu semi-dynamique, mise à jour à chaque ajout de pièce |
| Catalogue (Antiquités/Travaux) | ISR (revalidate: 60) | Idem |
| Détail pièce | ISR (revalidate: 60) + on-demand | Chaque pièce a sa page statique |
| À propos | ISR (revalidate: 3600) | Contenu rarement modifié |
| Contact | ISR (revalidate: 3600) | Contenu rarement modifié |

**Webhook Strapi → Vercel :** À chaque publication/modification/suppression d'une pièce, Strapi envoie un webhook qui déclenche la revalidation ISR des pages concernées via `revalidatePath()` ou `revalidateTag()`.

---

## 9. SEO & Performance

### SEO

- **Métadonnées dynamiques** : chaque page de pièce a ses propres title, description, og:image (photo principale)
- **Sitemap XML** : généré automatiquement via `next-sitemap` ou route handler
- **Schema.org** : markup JSON-LD pour les pièces (Product schema sans offre de vente en ligne)
- **URLs propres** : `/antiquites/console-art-deco-1930` plutôt que `/pieces/42`
- **Balises alt** : toutes les images ont un texte alternatif descriptif (champ dans Strapi)

### Performance

- **Images** : Next/Image avec lazy loading, formats WebP/AVIF automatiques via Vercel
- **Fonts** : `next/font` pour charger les Google Fonts avec display:swap
- **Bundle** : Analyse avec `@next/bundle-analyzer`, code splitting automatique
- **Core Web Vitals** : cibler LCP < 2.5s, CLS < 0.1, FID < 100ms

---

## 10. Hébergement & Déploiement

### Frontend (Next.js)
- **Vercel** : déploiement automatique depuis GitHub
- **Domaine** : antiquedaguet.fr configuré dans Vercel (DNS)
- **SSL** : automatique via Vercel

### Backend (Strapi)
- **Option recommandée :** Railway ou Render (PaaS, simple à maintenir)
  - Railway : PostgreSQL inclus, déploiement Git, ~$5-20/mois
  - Render : similaire, free tier pour tester
- **Option alternative :** VPS Hetzner (€4-8/mois) avec Docker
  - Plus de contrôle, mais maintenance manuelle
- **Sous-domaine :** admin.antiquedaguet.fr ou api.antiquedaguet.fr
- **Media :** Strapi Media Library avec provider Cloudinary (gratuit jusqu'à 25 crédits/mois) pour CDN et transformations d'images

### Variables d'environnement

**Frontend (.env.local) :**
```
NEXT_PUBLIC_STRAPI_URL=https://api.antiquedaguet.fr
STRAPI_API_TOKEN=xxx
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL=xxx
REVALIDATION_SECRET=xxx
```

**Strapi (.env) :**
```
DATABASE_URL=postgresql://...
APP_KEYS=xxx
API_TOKEN_SALT=xxx
ADMIN_JWT_SECRET=xxx
JWT_SECRET=xxx
CLOUDINARY_NAME=xxx
CLOUDINARY_KEY=xxx
CLOUDINARY_SECRET=xxx
SMTP_HOST=xxx
SMTP_PORT=xxx
SMTP_USER=xxx
SMTP_PASS=xxx
FRONTEND_URL=https://antiquedaguet.fr
REVALIDATION_SECRET=xxx
```

---

## 11. Plan d'implémentation (phases)

### Phase 1 — Fondations (Semaine 1)
- [ ] Initialiser le projet Next.js + Tailwind + TypeScript
- [ ] Initialiser Strapi v5 + PostgreSQL
- [ ] Définir les content types dans Strapi (pieces, subcategories, singletons)
- [ ] Configurer les rôles/permissions Strapi (Public = lecture seule)
- [ ] Créer le client API Strapi côté Next.js (`lib/strapi.ts`)
- [ ] Mettre en place les types TypeScript

### Phase 2 — Layout & Pages statiques (Semaine 1-2)
- [ ] Header + Navigation (desktop + mobile)
- [ ] Footer
- [ ] Page d'accueil (Hero + Dernières pièces + Bloc intro)
- [ ] Page À propos
- [ ] Page Contact (formulaire + carte)
- [ ] Page Mentions légales
- [ ] Design system : composants UI de base (Button, Badge, etc.)

### Phase 3 — Catalogue (Semaine 2-3)
- [ ] Page catalogue Antiquités (grille + filtres)
- [ ] Page catalogue Travaux/Créations
- [ ] Page de détail d'une pièce (galerie, infos, pièces similaires)
- [ ] Composant PieceCard
- [ ] Système de filtrage par sous-catégorie
- [ ] Badge "Vendu"
- [ ] Lightbox pour galeries photo

### Phase 4 — Intégrations & Polish (Semaine 3-4)
- [ ] Feed Instagram
- [ ] Webhook Strapi → Vercel (revalidation ISR)
- [ ] SEO (métadonnées dynamiques, sitemap, schema.org)
- [ ] Animations (scroll reveal, transitions de page, hover effects)
- [ ] Responsive : tests et ajustements mobile/tablette
- [ ] Optimisation des performances (images, fonts, bundle)
- [ ] Formulaire de contact : envoi email

### Phase 5 — Déploiement & Mise en production (Semaine 4)
- [ ] Déployer Strapi sur Railway/Render
- [ ] Déployer le frontend sur Vercel
- [ ] Configurer le domaine antiquedaguet.fr
- [ ] Configurer Cloudinary pour les médias
- [ ] Peupler le contenu initial (texte À propos, coordonnées, premières pièces)
- [ ] Tests cross-browser et mobile
- [ ] Former Christophe à l'utilisation de Strapi (session + mini-guide)

---

## 12. Points clarifiés et en attente

### Décisions prises
- **Sous-catégories Antiquités :** Sièges, Tables, Rangements, Miroirs, Objets décoratifs, Luminaires (liste initiale, extensible)
- **Sous-catégories Créations :** Consoles, Tables, Miroirs (liste initiale, extensible)
- **Logo :** À créer (sobre et élégant, univers bois/artisanat)
- **Photos :** Fournies progressivement par Christophe
- **Biographie :** Texte à récupérer auprès de Christophe
- **Coordonnées :** Mock data pour le développement, remplacées avant mise en production
- **Instagram :** @daguet_antique
- **Prix :** Affichés (données mock aléatoires pour le dev, vrais prix plus tard)
- **Sur rendez-vous :** Non
- **Mentions légales :** Mock data pour le dev

### Encore à fournir par Christophe (voir guide-christophe.md)
- [ ] Photos des premières pièces (5-10 pour commencer)
- [ ] Infos détaillées de chaque pièce (titre, description, dimensions, prix)
- [ ] Texte biographique
- [ ] Photo portrait
- [ ] Photos de l'atelier (optionnel)
- [ ] Coordonnées réelles (adresse, téléphone, email)
- [ ] Préférences pour le logo
- [ ] Numéro SIRET pour les mentions légales
