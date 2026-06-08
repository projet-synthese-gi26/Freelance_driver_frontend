# Changelog

All notable changes to this project are documented here.
Based on the UI/UX audits: [audit_letsgo.md](./audit_letsgo.md), [audit_pricing.md](./audit_pricing.md), [audit_combined.md](./audit_combined.md).

---

## [Unreleased] — 2026-06-08

### Fixed

- **Pricing — page titre** : Remplacé `"GENERIC PLANS FOR {PROFILE}"` par `"Plans designed for {profile}"` — le mot "GENERIC" nuisait à la perception de valeur (`src/app/(pricing)/pricing-plan/[profile]/page.tsx`)
- **Pricing — sous-titre** : Corrigé la faute `"differents"` → `"different"` et remplacé le sous-titre flou `"Feel free and explore the terms"` par `"Select the plan that matches your working rhythm."` (`src/app/(pricing)/pricing-plan/[profile]/page.tsx`)
- **Pricing — toggle** : Uniformisé la casse du toggle de fréquence : `"Quarterly"` → `"quarterly"` (cohérence avec `"monthly"` et `"annually"`) (`src/app/(pricing)/pricing-plan/[profile]/page.tsx`)
- **Profiles — descriptions placeholder** : Remplacé `"description of a driver with a vehicle"` et `"description of a driver without a vehicle"` par de vraies descriptions explicatives (`src/app/(pricing)/components/datas/profiles.tsx`)
- **Pricing — profil info** : Remplacé l'indicateur vague `"Pricing plans available"` par `"3 plans available · from 0 FCFA"` sur la page de sélection de profil (`src/app/(pricing)/pricing-plan/page.tsx`)

### Added

- **PlanCard — badge "Free"** : Ajouté un badge `"Free"` sur le plan Basic pour identifier immédiatement qu'il est gratuit, sans avoir à lire le prix (`src/app/(pricing)/components/PlanCard.tsx`)
- **PlanCard — badge "Most popular"** : Ajouté un badge `"Most popular"` sur le plan Standard pour guider la décision vers le milieu de gamme (`src/app/(pricing)/pricing-plan/[profile]/page.tsx`)
- **PlanCard — props `badge` et `isFree`** : Ajouté les props `badge` (texte de badge optionnel) et `isFree` (style de bouton outline pour le plan gratuit) au composant `PlanCard` (`src/app/(pricing)/components/PlanCard.tsx`)
- **PlanCard — bouton différencié pour Basic** : Le plan Basic affiche désormais un bouton style `outline` (transparent avec bordure) pour le différencier visuellement du bouton plein du Standard/Premium (`src/app/(pricing)/components/PlanCard.tsx`)
- **PlanCard — CTA Basic** : Changé le libellé du bouton Basic de `"Choose Plan"` à `"Get started free"` pour un message plus incitatif (`src/app/(pricing)/pricing-plan/[profile]/page.tsx`)
- **RegisterForm — champs pro conditionnels** : Les champs `Organisation Name`, `Title` et `Organisation Description` sont maintenant masqués pour les utilisateurs avec le rôle `client` (Passenger). Seuls les drivers les voient (`src/components/auth/RegisterForm.tsx`)
- **RegisterForm — message de bienvenue** : Ajouté un message de bienvenue contextuel selon le rôle sélectionné (driver vs passager) au-dessus du formulaire (`src/components/auth/RegisterForm.tsx`)
- **RegisterForm — champs obligatoires** : Ajouté un astérisque `*` dans les placeholders des champs obligatoires (Prénom, Nom, Email) et une légende explicative (`src/components/auth/RegisterForm.tsx`)

### Audit documents added

- `audit_letsgo.md` — Rapport d'audit UI/UX de la landing page LetsGo
- `audit_pricing.md` — Rapport d'audit UI/UX des pages de tarification Yowyob
- `audit_combined.md` — Synthèse combinée et plan d'action unifié

---

## Backlog — À implémenter (non bloquant)

- Afficher les remises explicites pour les plans trimestriel et annuel dans le toggle (ex. `-15% annuel`)
- Ajouter un tableau comparatif des fonctionnalités sous les cartes tarifaires
- Intégrer une mini-FAQ sur la résiliation et les remboursements
- Remplacer les images placeholder de la section témoignages (LetsGo)
- Remplacer les logos partenaires placeholder (LetsGo)
- Audit d'accessibilité WCAG AA complet (focus states, aria-labels, contrastes)
