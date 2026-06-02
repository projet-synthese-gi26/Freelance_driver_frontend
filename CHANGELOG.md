# Changelog — Relooking LetsGo Frontend
> Branche : `hussel_relooking`  
> Toutes les modifications sont frontend uniquement (aucun fichier backend/service touché)

---

## 2026-06-01

### Phase 1 — Design System Foundation

#### `tailwind.config.ts`
- Ajout des échelles de couleurs complètes (`primary-50` → `primary-900`, `secondary-50` → `secondary-900`, `tertiary-50` → `tertiary-900`)
- Avant : seule `primary: "var(--primary)"` était définie — les classes `bg-primary-50`, `text-primary-500` etc. ne rendaient rien

#### `src/app/globals.css`
- Augmentation des tailles de police des classes custom :
  - `.text` : `0.83rem` → `0.95rem`
  - `.title` : `1.1rem` → `1.25rem`
  - `.bigtitle` : `1.5rem` → `1.875rem`
- Suppression de la définition dupliquée de `.btn-tertiary` (définie deux fois)

---

### Phase 2 — Landing Pages

#### `src/components/landingpage/Footer.tsx`
- Fichier reconstruit de zéro (était un `<div></div>` vide)
- Nouveau contenu : colonnes de navigation (Produit, Entreprise, Légal), boutons App Store / Google Play, copyright dynamique
- ⚠️ Note : ce composant n'est pas utilisé par le root layout (voir `NewFooter.tsx` ci-dessous)

#### `src/components/landingpage/Header.tsx`
- Passage en `sticky top-0`
- Indicateur visuel de page active (underline sous le lien courant)
- Boutons Login/Register : remplacement de `bg-[#243757]` par `bg-primary`, ajout de `text-sm font-medium`
- Correction du HTML invalide dans le menu mobile (`<li>` dans `<li>`)
- ⚠️ Note : ce composant n'est pas utilisé par le root layout (voir `NewHeader.tsx` ci-dessous)

#### `src/components/landingpage/freelance/NewHero.tsx`
- Remplacement de toutes les classes custom (`.bigtitle`, `.title`, `.text`) par du Tailwind propre
- Correction des deux badges du haut qui se chevauchaient sur mobile → passage en `flex-wrap gap-3`
- Titre enrichi : `text-3xl md:text-4xl lg:text-5xl` (palier tablette ajouté)
- Section bénéfices : layout en grille (`grid-cols-1 md:grid-cols-3`) avec cards blanches
- Section options : grille responsive (`grid-cols-1 md:grid-cols-2`)
- Section download : fond `bg-primary-500`, padding responsive (`px-6 sm:px-10`)

#### `src/components/landingpage/Newsletter.tsx`
- Correction du padding vertical excessif : `py-36` → `py-16 md:py-24 lg:py-36`

---

### Phase 3 — Pages Auth

#### `src/components/auth/LoginForm.tsx`
- Toggle Email / Téléphone redesigné en pill avec fond gris (`bg-gray-100`)
- Option active : `bg-white text-primary-500 shadow-sm` (suppression du `bg-indigo-600` hardcodé)

#### `src/components/auth/RegisterForm.tsx`
- Sélecteur de rôle (Conducteur / Passager) : même design pill que LoginForm
- Bouton de soumission : `bg-blue-600/bg-green-600` → `bg-primary-500 hover:bg-primary-600`
- Lien "Se connecter" : `text-blue-600` → `text-primary-500`
- Style des inputs : `focus:ring-blue-500/20` → `focus:ring-primary-500/20`

---

### Phase 4 — Header global réel (`NewHeader.tsx`)

#### `src/components/general/NewHeader.tsx`
- Passage en `sticky top-0 z-50` avec transition de shadow au scroll
- Indicateur de page active : underline `bg-primary` sous le lien courant
- Dropdowns arrondis (`rounded-xl`), hover `hover:bg-primary-50 hover:text-primary`
- Gestion correcte des liens externes vs internes vs actions dans les submenus
- Boutons Login/Register : `bg-[#243757]` → `bg-primary`, `text-sm font-semibold`
- Menu mobile : correction du HTML invalide (`<li>` dans `<li>` → `<div>`)
- **Sous-menu "À propos"** : liens mis à jour
  - Conducteur : `"#"` → `/driver`
  - Passager : `"#"` → `/passenger`
  - Agence : `"#"` → `/agency`
  - Institutions : ajouté (manquait) → `/institution`

---

### Phase 5 — Pages vides construites

#### `src/app/(landingpage)/driver/page.tsx`
- **Avant** : `redirect("/")` — clicker sur "Conducteur" renvoyait vers la homepage
- **Après** : vraie page avec Hero, DriverSection, grille d'avantages (6 cards), WhyChooseLetsgo, CTA, DownloadApp, Newsletter

#### `src/app/(landingpage)/passenger/page.tsx`
- **Avant** : `<div></div>` — page complètement vide
- **Après** : Hero, section bénéfices (6 cards : sécurité, suivi, paiement, notes, 24/7, support), section "4 étapes", DownloadApp, Newsletter

#### `src/app/(landingpage)/agency/page.tsx`
- **Avant** : `<div></div>` — page complètement vide
- **Après** : Hero avec stats (agences, chauffeurs, trajets, satisfaction), AgencySection existante, grille fonctionnalités (6 cards), DownloadApp, Newsletter

#### `src/app/(landingpage)/institution/page.tsx`
- **Avant** : juste le texte "Institutions"
- **Après** : Hero dark avec stats (institutions, employés, ponctualité, support), InstitutionSection existante, grille fonctionnalités (6 cards), DownloadApp, Newsletter

---

### Phase 6 — Dashboard

#### `src/app/(dashboard)/freelance-dashboard/page.tsx`
- Remplacement des couleurs hardcodées :
  - `bg-blue-600/10 text-blue-600` → `bg-primary-50 text-primary-500`
  - `bg-blue-600 hover:bg-blue-700` → `bg-primary-500 hover:bg-primary-600`
  - `focus:ring-blue-500/20` → `focus:ring-primary-500/20`

---

### Fichiers de documentation créés

| Fichier | Description |
|---|---|
| `audit_freelance_driver_2026-06-01.md` | Audit initial : diagnostic, phases, contraintes |
| `CHANGELOG.md` | Ce fichier — historique de toutes les modifications |

---

## Contraintes respectées tout au long

- Aucun fichier dans `src/service/` modifié
- Aucun fichier `.env` modifié
- Aucun fichier dans `src/app/api/` modifié
- Toutes les connexions backend laissées intactes
