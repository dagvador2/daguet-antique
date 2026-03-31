# Daguet Antique — Tickets d'implémentation

Chaque ticket est atomique : une seule responsabilité, testable indépendamment. Format : ID, titre, description, critères d'acceptation, tests.

---

## Phase 1 — Fondations

### T1.1 — Initialiser le projet Next.js

**Description :** Créer le projet Next.js avec App Router, TypeScript, Tailwind CSS, ESLint. Configurer la structure de dossiers telle que définie dans CLAUDE.md.

**Actions :**
- `npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir`
- Installer Framer Motion : `npm install framer-motion`
- Créer l'arborescence : `components/layout`, `components/pieces`, `components/home`, `components/contact`, `components/ui`, `lib/`
- Configurer `tailwind.config.ts` avec la palette de couleurs (CSS variables)
- Configurer `globals.css` avec les variables CSS et les polices
- Configurer `next/font/google` pour Cormorant Garamond + DM Sans

**Critères d'acceptation :**
- [ ] `npm run dev` démarre sans erreur sur :3000
- [ ] `npm run build` passe sans erreur
- [ ] `npx tsc --noEmit` passe
- [ ] Les polices Google se chargent correctement
- [ ] Les couleurs Tailwind custom sont disponibles (test avec un `<div className="bg-bg-primary text-text-primary">`)

**Tests :**
- Build : `npm run build` → exit 0
- Types : `npx tsc --noEmit` → exit 0
- Lint : `npm run lint` → exit 0
- Visuel : page par défaut affiche la bonne police et couleur de fond

---

### T1.2 — Initialiser Strapi v5

**Description :** Créer le projet Strapi avec PostgreSQL (SQLite pour dev local). Configurer les permissions publiques.

**Actions :**
- `npx create-strapi@latest cms`
- Configurer la connexion PostgreSQL dans `config/database.ts`
- Créer un utilisateur admin
- Configurer les permissions : rôle Public = `find` et `findOne` sur toutes les collections
- Configurer CORS pour accepter le frontend (`http://localhost:3000`)

**Critères d'acceptation :**
- [ ] `npm run develop` démarre Strapi sur :1337
- [ ] Dashboard admin accessible sur :1337/admin
- [ ] API publique retourne 200 sur les endpoints (même vides)

**Tests :**
- Démarrage : `cd cms && npm run develop` → pas d'erreur
- Admin : naviguer vers `http://localhost:1337/admin` → page de login
- API : `curl http://localhost:1337/api/pieces` → 200 (tableau vide ou erreur 404 attendue avant création des types)

---

### T1.3 — Créer les content types Strapi : `piece` et `subcategory`

**Description :** Définir les collections `piece` et `subcategory` dans Strapi avec tous les champs spécifiés.

**Actions :**
- Créer le content type `subcategory` : name (Text, required), slug (UID basé sur name), category (Enum: antiquite, creation), order (Number, default 0)
- Créer le content type `piece` : tous les champs listés dans les specs (title, slug, description rich text, photos media multiple, category enum, subcategory relation, period, materials, dimensions, provenance, price number, show_price boolean, status enum, work_in_progress boolean, featured boolean)
- Configurer la relation piece → subcategory (many-to-one)
- Mettre à jour les permissions Public : `find`, `findOne` pour les deux collections

**Critères d'acceptation :**
- [ ] Les deux content types apparaissent dans le dashboard Strapi
- [ ] On peut créer une subcategory et une piece via l'admin
- [ ] L'API `GET /api/pieces?populate=*` retourne les pièces avec les photos et la subcategory populée
- [ ] L'API `GET /api/subcategories` retourne les sous-catégories

**Tests :**
- CRUD : créer une subcategory "Sièges" (antiquite) via admin, vérifier en API
- CRUD : créer une piece de test avec 1 photo, vérifier en API avec `?populate=*`
- Relation : vérifier que la piece retournée inclut sa subcategory
- Filtrage : `GET /api/pieces?filters[category][$eq]=antiquite` retourne uniquement les antiquités

---

### T1.4 — Créer les single types Strapi : homepage, about, contact, site-settings

**Description :** Définir les singletons pour le contenu des pages statiques.

**Actions :**
- `homepage` : hero_image (Media), hero_title (Text), hero_subtitle (Text), intro_text (Rich Text), intro_image (Media)
- `about-page` : title (Text), portrait_image (Media), biography (Rich Text), atelier_images (Media multiple), atelier_description (Rich Text)
- `contact-page` : address (Text), phone (Text), email (Email), google_maps_embed (Text), social_instagram (Text), social_facebook (Text)
- `site-setting` : site_name (Text), logo (Media), footer_text (Text)
- Permissions Public : `find` pour tous les singletons

**Critères d'acceptation :**
- [ ] Les 4 singletons apparaissent dans Strapi
- [ ] On peut remplir et sauvegarder chaque singleton
- [ ] L'API retourne les données pour chaque singleton

**Tests :**
- API : `GET /api/homepage?populate=*` → 200 avec données
- API : `GET /api/about-page?populate=*` → 200
- API : `GET /api/contact-page?populate=*` → 200
- API : `GET /api/site-setting?populate=*` → 200

---

### T1.5 — Peupler Strapi avec des données mock

**Description :** Remplir Strapi avec du contenu de test réaliste pour permettre le développement frontend.

**Actions :**
- Créer les sous-catégories : Sièges, Tables, Rangements, Miroirs, Objets décoratifs, Luminaires (antiquite) + Consoles, Tables, Miroirs (creation)
- Créer 10-12 pièces mock (6 antiquités, 4-6 créations) avec photos Unsplash (furniture), descriptions en français, prix aléatoires €200-€5000, quelques-unes marquées "sold", 2-3 marquées "featured"
- Remplir la homepage (hero mock, texte intro)
- Remplir about-page (texte bio placeholder, image portrait placeholder)
- Remplir contact-page (adresse fictive, coordonnées mock)
- Remplir site-setting (nom "Daguet Antique")

**Critères d'acceptation :**
- [ ] Au moins 10 pièces avec photos visibles en API
- [ ] Au moins 2 sous-catégories par type (antiquite/creation) avec des pièces associées
- [ ] Toutes les pages singletons remplies
- [ ] Le filtrage par catégorie et sous-catégorie retourne des résultats

**Tests :**
- `GET /api/pieces?populate=*` → 10+ résultats avec photos
- `GET /api/pieces?filters[status][$eq]=sold` → au moins 1 résultat
- `GET /api/pieces?filters[featured][$eq]=true` → 2-3 résultats
- Singletons : vérifier que chaque champ est rempli

---

### T1.6 — Client API Strapi côté Next.js

**Description :** Créer `lib/strapi.ts` avec les fonctions de fetch typées, et `lib/types.ts` avec les interfaces TypeScript.

**Actions :**
- Créer `lib/types.ts` : interfaces `Piece`, `Subcategory`, `Homepage`, `AboutPage`, `ContactPage`, `SiteSettings`, `StrapiResponse<T>`, `StrapiCollectionResponse<T>`
- Créer `lib/strapi.ts` : 
  - Fonction helper `fetchStrapi(path, params)` avec gestion d'erreurs, headers auth
  - `getPieces(filters?)` → Piece[]
  - `getPieceBySlug(slug)` → Piece | null
  - `getSubcategories(category?)` → Subcategory[]
  - `getHomepage()` → Homepage
  - `getAboutPage()` → AboutPage
  - `getContactPage()` → ContactPage
  - `getSiteSettings()` → SiteSettings
  - `getFeaturedPieces(limit?)` → Piece[]
- Créer `lib/utils.ts` : `formatPrice(price, showPrice)`, `getStrapiMediaUrl(url)`, `cn()` (classnames helper)

**Critères d'acceptation :**
- [ ] `npx tsc --noEmit` passe (types cohérents)
- [ ] Chaque fonction fetch retourne les données correctement typées
- [ ] `getStrapiMediaUrl` gère les URLs relatives et absolues
- [ ] Les erreurs API sont catchées et retournent null/[]

**Tests :**
- Types : `npx tsc --noEmit` → exit 0
- Intégration : créer un fichier de test temporaire qui appelle chaque fonction et log le résultat (vérifier manuellement avec Strapi lancé)
- Edge case : appeler `getPieceBySlug("inexistant")` → retourne null sans crash

---

## Phase 2 — Layout & Pages statiques

### T2.1 — Composant Header + Navigation desktop

**Description :** Header sticky avec logo texte et 4 liens de navigation. Effet de réduction au scroll.

**Actions :**
- Créer `components/layout/Header.tsx` (server component, wrapper)
- Créer `components/layout/Navigation.tsx` (client component pour l'effet scroll)
- Logo : texte "DAGUET ANTIQUE" en Cormorant Garamond, uppercase, espacement large
- 4 liens : Antiquités, Travaux, À propos, Contact
- Sticky header avec backdrop-blur au scroll
- Lien actif souligné (utiliser `usePathname`)

**Critères d'acceptation :**
- [ ] Header visible sur toutes les pages
- [ ] Les 4 liens naviguent correctement
- [ ] Le lien actif est visuellement distingué
- [ ] Le header se réduit / ajoute un fond au scroll
- [ ] `npm run build` passe

**Tests :**
- Visuel desktop (1440px) : header centré, liens espacés
- Visuel mobile (375px) : header ne casse pas (le menu mobile est un ticket séparé)
- Navigation : cliquer chaque lien → bonne URL
- Scroll : scroller → le header change d'apparence

---

### T2.2 — Composant MobileMenu

**Description :** Menu hamburger pour mobile/tablette avec animation slide.

**Actions :**
- Créer `components/layout/MobileMenu.tsx` (client component)
- Icône hamburger (3 barres, animée en X à l'ouverture)
- Menu plein écran ou panneau latéral avec les 4 liens
- Animation Framer Motion (slide depuis la droite)
- Fermeture au clic sur un lien ou sur le backdrop
- Visible uniquement sous le breakpoint `lg` (1024px)

**Critères d'acceptation :**
- [ ] Hamburger visible sur mobile, caché sur desktop
- [ ] L'ouverture/fermeture est animée
- [ ] Les liens naviguent et ferment le menu
- [ ] Le scroll du body est bloqué quand le menu est ouvert
- [ ] `npm run build` passe

**Tests :**
- Visuel mobile (375px) : hamburger visible, menu fonctionne
- Visuel desktop (1440px) : hamburger invisible
- Navigation : cliquer un lien dans le menu → navigation + fermeture
- Accessibilité : `aria-expanded`, `aria-label` sur le bouton

---

### T2.3 — Composant Footer

**Description :** Footer sobre avec coordonnées, liens de navigation, icône Instagram, copyright.

**Actions :**
- Créer `components/layout/Footer.tsx` (server component)
- Données dynamiques depuis `getSiteSettings()` et `getContactPage()`
- Layout : nom du site, adresse/tel/email, liens de nav, icône Instagram, copyright avec année dynamique

**Critères d'acceptation :**
- [ ] Footer visible sur toutes les pages
- [ ] Coordonnées affichées (données mock)
- [ ] Liens de navigation fonctionnels
- [ ] Icône Instagram cliquable
- [ ] Année de copyright dynamique (2026)
- [ ] `npm run build` passe

**Tests :**
- Visuel desktop : layout horizontal, bien espacé
- Visuel mobile : layout empilé, lisible
- Liens : tous les liens fonctionnent
- Build : `npm run build` → exit 0

---

### T2.4 — Layout racine (app/layout.tsx)

**Description :** Assembler Header + Footer dans le layout racine. Configurer les métadonnées globales.

**Actions :**
- Configurer `app/layout.tsx` avec Header, `{children}`, Footer
- Metadata par défaut : title "Daguet Antique — Ébéniste, Designer, Antiquaire", description, og:image placeholder
- Configurer `next/font/google` si pas encore fait
- Fond `bg-bg-primary` sur le body

**Critères d'acceptation :**
- [ ] Toutes les pages ont le header et le footer
- [ ] La balise `<title>` par défaut est correcte
- [ ] Les polices sont chargées et appliquées
- [ ] Le fond est la bonne couleur
- [ ] `npm run build` passe

**Tests :**
- Visuel : naviguer entre les pages → header/footer persistent
- SEO : inspecter `<head>` → title et meta description présents
- Build : `npm run build` → exit 0

---

### T2.5 — Page d'accueil : Hero section

**Description :** Section hero plein écran avec image de fond, titre superposé et CTA.

**Actions :**
- Créer `components/home/Hero.tsx`
- Image plein écran (100vw × 80vh min), `next/image` avec `priority`
- Titre "Daguet Antique" en overlay (texte blanc ou crème, ombre portée ou fond semi-transparent)
- Sous-titre (optionnel, depuis Strapi)
- Bouton CTA "Découvrir les collections" → scrolle vers la section suivante ou lien `/antiquites`
- Données depuis `getHomepage()`

**Critères d'acceptation :**
- [ ] L'image hero occupe au moins 80vh
- [ ] Le titre est lisible sur l'image
- [ ] Le CTA est cliquable et navigue
- [ ] L'image a `priority` (LCP)
- [ ] Responsive : bon rendu mobile (texte ne déborde pas)

**Tests :**
- Visuel desktop (1440px) : image plein écran, texte centré
- Visuel mobile (375px) : texte lisible, pas de débordement
- Performance : vérifier que l'image hero a l'attribut `priority` dans le HTML
- Lighthouse : LCP < 2.5s

---

### T2.6 — Page d'accueil : Dernières pièces

**Description :** Section grille avec les 6-8 pièces les plus récentes.

**Actions :**
- Créer `components/home/LatestPieces.tsx`
- Titre de section "Dernières pièces" ou "Nouveautés"
- Grille de PieceCard (composant créé en Phase 3, utiliser un placeholder pour l'instant)
- Données depuis `getFeaturedPieces(8)` ou tri par date
- Lien "Voir tout" vers `/antiquites`

**Critères d'acceptation :**
- [ ] 6-8 pièces affichées en grille
- [ ] Grille responsive : 3 colonnes desktop, 2 tablette, 1 mobile
- [ ] Lien "Voir tout" fonctionne
- [ ] `npm run build` passe

**Tests :**
- Visuel : vérifier la grille à 3 breakpoints
- Données : les pièces affichées correspondent aux plus récentes de Strapi
- Build : `npm run build` → exit 0

**Dépendance :** T3.1 (PieceCard) — utiliser un placeholder en attendant, puis intégrer.

---

### T2.7 — Page d'accueil : Bloc intro + assemblage

**Description :** Bloc de présentation rapide avec texte + image, et assemblage complet de la homepage.

**Actions :**
- Créer `components/home/IntroBlock.tsx`
- Layout : texte à gauche, image à droite (ou empilé sur mobile)
- Texte court d'accroche + lien "En savoir plus" → `/a-propos`
- Assembler `app/page.tsx` : Hero + LatestPieces + IntroBlock
- ISR : `revalidate: 60`

**Critères d'acceptation :**
- [ ] La homepage complète s'affiche avec les 3 sections
- [ ] Le bloc intro est bien positionné
- [ ] Navigation depuis la homepage fonctionne
- [ ] `npm run build` passe

**Tests :**
- Visuel : page complète aux 3 breakpoints
- Navigation : CTA hero → catalogue, "En savoir plus" → à propos, "Voir tout" → catalogue
- Build : `npm run build` → exit 0

---

### T2.8 — Page À propos

**Description :** Page biographique avec portrait et texte riche.

**Actions :**
- Créer `app/a-propos/page.tsx`
- Layout : grande photo portrait + texte biographique (rich text rendu en HTML)
- Section atelier optionnelle (photos + texte)
- Données depuis `getAboutPage()`
- Metadata dynamique
- ISR : `revalidate: 3600`

**Critères d'acceptation :**
- [ ] Photo portrait affichée en grand format
- [ ] Texte biographique rendu correctement (rich text → HTML)
- [ ] Metadata : title "À propos — Daguet Antique"
- [ ] Responsive : bon rendu mobile
- [ ] `npm run build` passe

**Tests :**
- Visuel : photo + texte bien positionnés aux 3 breakpoints
- Rich text : vérifier que le formatage (gras, italique, paragraphes) est rendu
- SEO : inspecter `<title>` et `<meta description>`
- Build : `npm run build` → exit 0

---

### T2.9 — Page Contact

**Description :** Page avec coordonnées, carte Google Maps et formulaire de contact.

**Actions :**
- Créer `app/contact/page.tsx`
- Créer `components/contact/MapEmbed.tsx` (iframe Google Maps)
- Créer `components/contact/ContactForm.tsx` (client component)
- Layout : coordonnées + carte à gauche, formulaire à droite (ou empilé mobile)
- Formulaire : nom, email, sujet (dropdown), message, bouton envoyer
- Pour l'instant : le submit affiche un toast de confirmation (l'envoi email est T4.7)
- Données depuis `getContactPage()`
- Metadata dynamique

**Critères d'acceptation :**
- [ ] Coordonnées affichées (mock)
- [ ] Carte Google Maps intégrée et fonctionnelle
- [ ] Formulaire avec validation côté client (champs requis, email valide)
- [ ] Submit affiche un message de confirmation
- [ ] Responsive
- [ ] `npm run build` passe

**Tests :**
- Visuel : layout correct aux 3 breakpoints
- Formulaire : soumettre vide → messages d'erreur, soumettre rempli → message de succès
- Carte : carte visible et interactive (zoom, déplacement)
- Build : `npm run build` → exit 0

---

### T2.10 — Page Mentions légales

**Description :** Page statique avec contenu mock pour les mentions légales.

**Actions :**
- Créer `app/mentions-legales/page.tsx`
- Contenu mock : éditeur du site, hébergeur, CNIL, propriété intellectuelle
- Template standard de mentions légales françaises
- Metadata : title "Mentions légales — Daguet Antique"

**Critères d'acceptation :**
- [ ] Page accessible via `/mentions-legales`
- [ ] Contenu mock présent et lisible
- [ ] Lien depuis le footer fonctionne
- [ ] `npm run build` passe

**Tests :**
- Navigation : cliquer le lien dans le footer → bonne page
- Build : `npm run build` → exit 0

---

## Phase 3 — Catalogue

### T3.1 — Composant PieceCard

**Description :** Carte réutilisable pour afficher une pièce dans une grille.

**Actions :**
- Créer `components/pieces/PieceCard.tsx`
- Photo (ratio 4:5, object-fit cover), titre, époque/période, badge "Vendu" si applicable
- Hover : scale(1.03) sur l'image, transition douce
- Lien vers la page de détail (`/antiquites/[slug]` ou `/travaux/[slug]` selon la catégorie)
- Créer `components/pieces/SoldBadge.tsx` : overlay semi-transparent avec texte "Vendu"

**Critères d'acceptation :**
- [ ] La carte affiche photo, titre, période
- [ ] Le badge "Vendu" apparaît uniquement sur les pièces vendues
- [ ] Le hover anime l'image
- [ ] Le lien pointe vers la bonne URL selon la catégorie
- [ ] `npm run build` passe

**Tests :**
- Visuel : carte avec pièce "available" → pas de badge, pièce "sold" → badge
- Hover : effet de zoom visible
- Navigation : clic → bonne page de détail
- Types : `npx tsc --noEmit` → exit 0

---

### T3.2 — Composant PieceGrid

**Description :** Grille responsive de PieceCards.

**Actions :**
- Créer `components/pieces/PieceGrid.tsx`
- Grille CSS Grid : 3 colonnes (lg), 2 colonnes (md), 1 colonne (sm)
- Gap cohérent entre les cartes
- Gestion du cas "aucune pièce" : message informatif
- Animation Framer Motion : staggered fade-in au chargement

**Critères d'acceptation :**
- [ ] Grille responsive correcte aux 3 breakpoints
- [ ] Cas vide : message "Aucune pièce pour le moment"
- [ ] Animation de chargement
- [ ] `npm run build` passe

**Tests :**
- Visuel : 3 breakpoints, vérifier le nombre de colonnes
- Vide : passer un tableau vide → message affiché
- Animation : les cartes apparaissent avec un léger décalage
- Build : `npm run build` → exit 0

---

### T3.3 — Composant PieceFilters

**Description :** Barre de filtres par sous-catégorie, filtrage côté client.

**Actions :**
- Créer `components/pieces/PieceFilters.tsx` (client component)
- Barre horizontale scrollable avec boutons : "Tout" + chaque sous-catégorie
- Filtre actif visuellement distingué (fond sombre, texte clair)
- Filtrage côté client (pas de rechargement de page)
- Props : sous-catégories, callback onChange

**Critères d'acceptation :**
- [ ] Bouton "Tout" + un bouton par sous-catégorie
- [ ] Cliquer un filtre met à jour la grille instantanément
- [ ] Le filtre actif est visuellement marqué
- [ ] Scrollable horizontalement sur mobile si beaucoup de catégories
- [ ] `npm run build` passe

**Tests :**
- Filtrage : cliquer "Sièges" → seules les pièces de type "Sièges" restent
- Cliquer "Tout" → toutes les pièces réapparaissent
- Visuel mobile : barre scrollable si nécessaire
- Build : `npm run build` → exit 0

---

### T3.4 — Page catalogue Antiquités

**Description :** Page `/antiquites` avec filtres et grille de pièces.

**Actions :**
- Créer `app/antiquites/page.tsx`
- Titre "Antiquités" + description courte
- PieceFilters avec les sous-catégories `category=antiquite`
- PieceGrid avec toutes les pièces `category=antiquite`
- ISR : `revalidate: 60`
- Metadata dynamique

**Critères d'acceptation :**
- [ ] La page affiche uniquement les antiquités
- [ ] Les filtres fonctionnent
- [ ] Metadata correcte
- [ ] Responsive
- [ ] `npm run build` passe

**Tests :**
- Données : vérifier qu'aucune "creation" n'apparaît
- Filtres : vérifier le filtrage par sous-catégorie
- SEO : title = "Antiquités — Daguet Antique"
- Build : `npm run build` → exit 0

---

### T3.5 — Page catalogue Travaux / Créations

**Description :** Page `/travaux` — identique à Antiquités mais filtrée sur les créations.

**Actions :**
- Créer `app/travaux/page.tsx`
- Même structure que T3.4 mais avec `category=creation`
- Badge "En cours" pour les pièces `work_in_progress=true`
- Metadata dynamique

**Critères d'acceptation :**
- [ ] Uniquement les créations affichées
- [ ] Badge "En cours" visible sur les pièces concernées
- [ ] Filtres par sous-catégorie fonctionnels
- [ ] `npm run build` passe

**Tests :**
- Données : aucune "antiquite" affichée
- Badge : pièce avec `work_in_progress=true` → badge visible
- Build : `npm run build` → exit 0

---

### T3.6 — Composant PieceGallery (lightbox)

**Description :** Galerie photo pour la page de détail avec lightbox.

**Actions :**
- Créer `components/pieces/PieceGallery.tsx` (client component)
- Photo principale grande + thumbnails en dessous
- Clic sur une photo → ouvre une lightbox plein écran
- Navigation dans la lightbox (flèches, swipe mobile, touches clavier)
- Fermeture : clic backdrop, touche Escape, bouton ×
- Créer `components/ui/Lightbox.tsx`

**Critères d'acceptation :**
- [ ] Photo principale + thumbnails visibles
- [ ] Clic → lightbox plein écran
- [ ] Navigation clavier (flèches, Escape)
- [ ] Swipe sur mobile
- [ ] `npm run build` passe

**Tests :**
- Visuel : galerie avec plusieurs photos
- Lightbox : ouvrir, naviguer, fermer
- Clavier : flèche droite → photo suivante, Escape → fermer
- Mobile : swipe fonctionne
- Build : `npm run build` → exit 0

---

### T3.7 — Page de détail d'une pièce

**Description :** Pages dynamiques `/antiquites/[slug]` et `/travaux/[slug]`.

**Actions :**
- Créer `app/antiquites/[slug]/page.tsx`
- Créer `app/travaux/[slug]/page.tsx`
- Layout : PieceGallery à gauche, infos à droite (ou empilé mobile)
- Infos : titre, description (rich text), époque, matériaux, dimensions, provenance, prix, statut
- Bouton "Contacter pour cette pièce" (mailto avec sujet pré-rempli)
- Section "Pièces similaires" : 3-4 pièces de la même sous-catégorie
- `generateStaticParams` pour le build statique
- `generateMetadata` dynamique (title, description, og:image)
- ISR : `revalidate: 60`

**Critères d'acceptation :**
- [ ] Galerie photo fonctionnelle
- [ ] Toutes les infos affichées correctement
- [ ] Rich text description rendue en HTML
- [ ] Prix affiché ou "Sur demande" selon `show_price`
- [ ] Badge "Vendu" si `status=sold`
- [ ] Bouton contact fonctionne (mailto)
- [ ] Pièces similaires affichées
- [ ] 404 si slug inexistant
- [ ] Metadata dynamique (og:image = photo principale)
- [ ] Responsive
- [ ] `npm run build` passe

**Tests :**
- Navigation : depuis la grille → page de détail → infos correctes
- 404 : `/antiquites/slug-inexistant` → page 404
- Prix : pièce avec prix → montant affiché, pièce sans prix → "Sur demande"
- SEO : og:image correspond à la photo principale
- Build : `npm run build` → exit 0

---

## Phase 4 — Intégrations & Polish

### T4.1 — Feed Instagram

**Description :** Section Instagram sur la homepage avec les derniers posts.

**Actions :**
- Créer `components/home/InstagramFeed.tsx`
- Option 1 : Instagram Basic Display API (nécessite un token, renouvellement tous les 60 jours)
- Option 2 : Embed via oEmbed ou scraping léger
- Option 3 : Fallback statique — lien vers le profil @daguet_antique avec quelques photos uploadées manuellement dans Strapi
- Grille de 4-6 posts, lien "Suivez-nous sur Instagram"

**Critères d'acceptation :**
- [ ] Section visible sur la homepage
- [ ] Au moins un lien fonctionnel vers Instagram
- [ ] Responsive
- [ ] `npm run build` passe

**Tests :**
- Visuel : section Instagram visible
- Lien : clic → profil Instagram (nouvel onglet)
- Fallback : si l'API échoue, la section ne casse pas le site
- Build : `npm run build` → exit 0

---

### T4.2 — Webhook Strapi → Vercel (revalidation ISR)

**Description :** Déclencher la revalidation des pages Next.js quand le contenu Strapi change.

**Actions :**
- Créer `app/api/revalidate/route.ts` : route handler qui reçoit le webhook et appelle `revalidatePath()` ou `revalidateTag()`
- Vérification du secret partagé (`REVALIDATION_SECRET`)
- Configurer le webhook dans Strapi (Settings → Webhooks) pour les événements create/update/delete sur `piece`
- Revalider les paths pertinents : `/`, `/antiquites`, `/travaux`, `/antiquites/[slug]`, `/travaux/[slug]`

**Critères d'acceptation :**
- [ ] Route `/api/revalidate` retourne 200 avec un secret valide
- [ ] Retourne 401 sans secret
- [ ] Après modification d'une pièce dans Strapi, la page se met à jour dans les ~60s
- [ ] `npm run build` passe

**Tests :**
- Auth : `curl -X POST /api/revalidate` sans secret → 401
- Auth : `curl -X POST /api/revalidate -H "x-secret: bon-secret"` → 200
- Intégration : modifier une pièce dans Strapi → vérifier la mise à jour du site
- Build : `npm run build` → exit 0

---

### T4.3 — SEO : métadonnées dynamiques et sitemap

**Description :** Optimiser le SEO sur toutes les pages.

**Actions :**
- `generateMetadata` sur chaque page avec title, description, og:image
- Créer `app/sitemap.ts` : génère dynamiquement le sitemap XML avec toutes les pages et pièces
- Créer `app/robots.ts` : robots.txt standard
- Ajouter le markup JSON-LD (schema.org) sur les pages de détail (type Product, sans Offer)

**Critères d'acceptation :**
- [ ] Chaque page a un `<title>` unique et une `<meta description>`
- [ ] `/sitemap.xml` liste toutes les pages y compris les pièces dynamiques
- [ ] `/robots.txt` autorise le crawling
- [ ] JSON-LD présent sur les pages de détail
- [ ] `npm run build` passe

**Tests :**
- SEO : inspecter `<head>` sur chaque page → title unique
- Sitemap : `/sitemap.xml` → XML valide avec toutes les URLs
- Robots : `/robots.txt` → contenu correct
- JSON-LD : inspecter `<script type="application/ld+json">` sur une page de détail
- Build : `npm run build` → exit 0

---

### T4.4 — Animations et transitions

**Description :** Ajouter les animations Framer Motion pour le polish final.

**Actions :**
- Créer `components/ui/ScrollReveal.tsx` : wrapper qui anime ses enfants au scroll (fade-in + translateY)
- Appliquer ScrollReveal aux sections de la homepage, aux grilles catalogue, aux pages statiques
- Transitions de page (optionnel, complexe avec App Router)
- Hover effects sur les PieceCards (déjà fait en T3.1, vérifier)
- Animation du menu mobile (déjà fait en T2.2, vérifier)

**Critères d'acceptation :**
- [ ] Les sections apparaissent en fade-in au scroll
- [ ] Les animations sont fluides (60fps)
- [ ] `prefers-reduced-motion` respecté (pas d'animation)
- [ ] `npm run build` passe

**Tests :**
- Visuel : scroller la homepage → les sections apparaissent progressivement
- Performance : pas de jank visible
- Accessibilité : activer "reduce motion" dans l'OS → animations désactivées
- Build : `npm run build` → exit 0

---

### T4.5 — Tests responsive complets

**Description :** Passe de vérification et ajustement sur tous les breakpoints.

**Actions :**
- Tester chaque page à 375px, 768px, 1024px, 1440px
- Corriger les débordements, textes tronqués, images mal cadrées
- Vérifier la navigation mobile
- Vérifier les grilles catalogue
- Vérifier les pages de détail (galerie + infos)
- Vérifier le formulaire de contact

**Critères d'acceptation :**
- [ ] Aucun débordement horizontal sur aucune page
- [ ] Textes lisibles à toutes les tailles
- [ ] Grilles adaptées
- [ ] Formulaire utilisable sur mobile
- [ ] Menu mobile fonctionnel
- [ ] `npm run build` passe

**Tests :**
- Tester chaque page dans DevTools à 375px, 768px, 1024px, 1440px
- Vérifier : pas de scroll horizontal, texte lisible, images non coupées
- Build : `npm run build` → exit 0

---

### T4.6 — Optimisation des performances

**Description :** Optimiser pour atteindre Lighthouse 90+.

**Actions :**
- Vérifier que toutes les images utilisent `next/image` avec `sizes` approprié
- Vérifier le lazy loading (toutes sauf hero)
- Analyser le bundle avec `@next/bundle-analyzer`
- Optimiser les imports Framer Motion (tree-shaking)
- Vérifier les polices : `display: swap`, preload
- Ajouter des `loading.tsx` pour les pages dynamiques

**Critères d'acceptation :**
- [ ] Lighthouse Performance ≥ 90 sur la homepage
- [ ] Lighthouse Accessibility ≥ 90
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] Pas de ressources bloquantes dans le rendu

**Tests :**
- Lighthouse : lancer un audit sur homepage, catalogue, détail
- Web Vitals : vérifier LCP, CLS, FID dans les DevTools
- Build : `npm run build` → vérifier la taille du bundle

---

### T4.7 — Envoi email du formulaire de contact

**Description :** Connecter le formulaire de contact à un service d'envoi d'email.

**Actions :**
- Créer `app/api/contact/route.ts` : route handler POST
- Validation serveur : nom requis, email valide, message requis
- Envoi email via Resend (gratuit 100 emails/jour) ou SendGrid
- Email envoyé à l'adresse de contact de Christophe
- Protection anti-spam : rate limiting basique, honeypot field
- Réponse JSON : success/error

**Critères d'acceptation :**
- [ ] Le formulaire envoie un email fonctionnel
- [ ] Validation serveur (retourne 400 si champs invalides)
- [ ] Protection anti-spam basique
- [ ] L'email reçu contient : nom, email, sujet, message
- [ ] `npm run build` passe

**Tests :**
- Happy path : remplir et soumettre → email reçu
- Validation : POST sans email → 400
- Spam : POST avec honeypot rempli → rejeté silencieusement
- Rate limit : 10+ soumissions rapides → rejeté
- Build : `npm run build` → exit 0

---

## Phase 5 — Déploiement & Mise en production

### T5.1 — Déployer Strapi sur Railway/Render

**Description :** Mettre Strapi en production avec PostgreSQL et Cloudinary.

**Actions :**
- Créer un projet Railway (ou Render)
- Configurer PostgreSQL managé
- Configurer toutes les variables d'environnement
- Configurer Cloudinary comme provider de media
- Déployer Strapi depuis le repo Git
- Vérifier le dashboard admin sur l'URL de production
- Configurer le sous-domaine (api.antiquedaguet.fr ou admin.antiquedaguet.fr)

**Critères d'acceptation :**
- [ ] Strapi accessible sur l'URL de production
- [ ] Dashboard admin fonctionnel
- [ ] Upload de media fonctionne (Cloudinary)
- [ ] API publique retourne les données
- [ ] SSL actif (HTTPS)

**Tests :**
- Admin : login → dashboard fonctionnel
- API : `curl https://api.antiquedaguet.fr/api/pieces` → 200
- Media : uploader une image dans l'admin → visible via Cloudinary
- CRUD : créer/modifier/supprimer une pièce via l'admin de production

---

### T5.2 — Déployer le frontend sur Vercel

**Description :** Déployer Next.js sur Vercel avec le domaine personnalisé.

**Actions :**
- Connecter le repo GitHub à Vercel
- Configurer les variables d'environnement (STRAPI_URL de production, tokens, etc.)
- Build et déploiement initial
- Configurer le domaine antiquedaguet.fr (DNS)
- Vérifier le SSL
- Tester le webhook Strapi → Vercel

**Critères d'acceptation :**
- [ ] Site accessible sur antiquedaguet.fr
- [ ] SSL actif
- [ ] Toutes les pages fonctionnent avec les données Strapi de production
- [ ] Les images se chargent correctement depuis Cloudinary
- [ ] Le webhook de revalidation fonctionne

**Tests :**
- Navigation : toutes les pages chargent correctement
- Images : toutes les photos de pièces s'affichent
- Webhook : modifier une pièce dans Strapi → le site se met à jour
- SSL : certificat valide sur antiquedaguet.fr

---

### T5.3 — Peupler le contenu réel

**Description :** Remplacer les données mock par le vrai contenu de Christophe.

**Actions :**
- Uploader les photos de pièces fournies par Christophe
- Créer les fiches de chaque pièce avec les vraies informations
- Remplir la page À propos avec le vrai texte biographique et le portrait
- Remplir les coordonnées de contact réelles
- Mettre à jour les mentions légales avec le vrai SIRET
- Supprimer toutes les données mock

**Critères d'acceptation :**
- [ ] Aucune donnée mock restante sur le site
- [ ] Toutes les pièces ont de vraies photos et descriptions
- [ ] Page À propos avec le vrai contenu
- [ ] Coordonnées réelles sur la page Contact
- [ ] Mentions légales complètes

**Tests :**
- Vérification manuelle page par page
- Vérifier qu'aucun "Lorem ipsum" ou "placeholder" ne reste

---

### T5.4 — Formation Christophe + documentation utilisateur

**Description :** Former Christophe à l'utilisation de Strapi et documenter les procédures.

**Actions :**
- Session de formation (visio ou en personne) : comment se connecter, ajouter une pièce, modifier un texte, uploader des photos
- Rédiger un mini-guide utilisateur (PDF ou page web) avec captures d'écran
- Documenter les cas courants : ajouter une pièce, marquer comme vendu, modifier la page d'accueil

**Critères d'acceptation :**
- [ ] Christophe peut se connecter au dashboard
- [ ] Christophe peut ajouter une pièce seul
- [ ] Christophe peut modifier le statut d'une pièce
- [ ] Un guide écrit est disponible pour référence

**Tests :**
- Christophe effectue les 3 actions de base seul pendant la formation
- Le guide couvre tous les cas courants

---

### T5.5 — Tests finaux et go-live

**Description :** Checklist finale avant la mise en ligne publique.

**Actions :**
- Tests cross-browser : Chrome, Firefox, Safari (desktop + mobile)
- Vérifier la performance Lighthouse en production
- Vérifier le SEO : sitemap soumis à Google Search Console
- Vérifier le formulaire de contact en production
- Vérifier les erreurs 404 (tester des URLs invalides)
- Vérifier les analytics (si configuré)
- Supprimer la protection par mot de passe Vercel (si utilisée pendant le dev)

**Critères d'acceptation :**
- [ ] Pas de bug bloquant sur Chrome, Firefox, Safari
- [ ] Lighthouse 90+ sur toutes les métriques
- [ ] Formulaire de contact fonctionnel en production
- [ ] Sitemap soumis à Google Search Console
- [ ] Pas de donnée mock restante
- [ ] Site accessible publiquement sur antiquedaguet.fr

**Tests :**
- Cross-browser : navigation complète sur 3 navigateurs
- Lighthouse : score ≥ 90 sur homepage et catalogue
- 404 : `/page-inexistante` → page 404 propre
- Contact : soumission test → email reçu par Christophe
