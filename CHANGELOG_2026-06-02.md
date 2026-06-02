# Changelog — Pages Authentifiées LetsGo Frontend
> Branche : `hussel_relooking`  
> Date : 2026-06-02  
> Toutes les modifications sont frontend uniquement (aucun fichier backend/service touché)

---

## Fichiers de documentation

| Fichier | Action |
|---|---|
| `CHANGELOG.md` | Renommé → `CHANGELOG_2026-06-01.md` |
| `audit_authenticated_pages_2026-06-02.md` | Créé — audit complet des pages authentifiées |
| `CHANGELOG_2026-06-02.md` | Ce fichier |

---

## Quick Wins — Corrections de couleurs (design system)

### Boutons submit hors charte → `bg-primary`

#### `src/app/(dashboard)/freelance-dashboard/security/page.tsx`
- `bg-blue-600 hover:bg-blue-700` → `bg-primary hover:bg-primary/90`
- `focus:ring-blue-500` → `focus:ring-primary/20 focus:border-primary` sur les 3 champs password

#### `src/app/(dashboard)/customer-dashboard/user-security/page.tsx`
- `bg-blue-600 hover:bg-blue-700` → `bg-primary hover:bg-primary/90`
- `focus:ring-blue-500` → `focus:ring-primary/20 focus:border-primary` sur les 3 champs password

#### `src/app/(dashboard)/freelance-dashboard/rate_app/page.tsx`
- Header gradient `from-purple-600 to-indigo-600` → `from-primary to-primary/80`
- Bouton submit `bg-green-600 hover:bg-green-700` → `bg-primary hover:bg-primary/90`

#### `src/app/(dashboard)/freelance-dashboard/ratings/page.tsx`
- Header gradient `from-blue-600 to-blue-400` → `from-primary to-primary/70`

---

## Quick Wins — Toggle show/hide password

#### `src/app/(dashboard)/freelance-dashboard/security/page.tsx`
- Import ajouté : `EyeIcon`, `EyeSlashIcon` depuis `@heroicons/react/24/outline`
- États ajoutés : `showCurrent`, `showNew`, `showConfirm`
- Les 3 inputs `type="password"` sont maintenant des `<div className="relative">` avec bouton œil
- Le type bascule entre `"password"` et `"text"` au clic

#### `src/app/(dashboard)/customer-dashboard/user-security/page.tsx`
- Mêmes modifications que ci-dessus

---

## Quick Wins — Redirections et CSS legacy

#### `src/app/(dashboard)/freelance-dashboard/portofolio/page.tsx`
- **Avant** : `router.replace('/freelance-dashboard/finance/wallet')` (incohérent)
- **Après** : `router.replace('/freelance-dashboard/business')` (logique métier)

#### `src/app/(dashboard)/freelance-dashboard/statistic/page.tsx`
- `bg-[var(--bg-1)]` → `bg-gray-50` (variable CSS de l'ancien système supprimée)

---

## Quick Wins — Spacings arbitraires

#### `src/app/(dashboard)/customer-dashboard/user-chat/page.tsx`
- `mb-[15%]` → supprimé (le `pb-20` existant suffit)

#### `src/app/(dashboard)/customer-dashboard/user-address/page.tsx`
- `mb-[20%]` → `mb-20`

---

## Layout Dashboard

#### `src/app/(dashboard)/freelance-dashboard/layout.tsx`
- Header `bg-[#E0D9FD]` → `bg-primary/10` (design system)
- Photo de profil dans le header : ajout d'une overlay hover avec icône crayon + `title="Change profile photo"` — l'affordance est maintenant visible

#### `src/app/(dashboard)/customer-dashboard/layout.tsx`
- Header `bg-[#E0D9FD]` → `bg-primary/10` (design system)
- Bouton "Upgrade" : `bg-blue-500` → `bg-primary`
- Navigation : icône `user-contacts` changée de `UserCircleIcon` → `UsersIcon` (import ajouté)
- Photo de profil dans le header : même traitement que le dashboard freelance (overlay crayon)

---

## Customer Dashboard — Pages

#### `src/app/(dashboard)/customer-dashboard/page.tsx` — Personal Info
- "Photo de profil" → "Profile photo" (uniformisation anglais)
- "Changer la photo" → "Change photo" (uniformisation anglais)
- Toast "Photo de profil mise à jour !" → "Profile photo updated!"
- Bouton "Change photo" : conditionné à `editable === true` (plus affiché en permanence)

#### `src/app/(dashboard)/customer-dashboard/user-announce/page.tsx` — Announcements
- **Modal Create** : les champs texte libres pour departure/arrival ont été remplacés par les mêmes sélecteurs cascadants Région → Département → Arrondissement que le modal Edit
- Reset des sélecteurs de localisation au submit du formulaire Create

#### `src/app/(dashboard)/customer-dashboard/user-notification/page.tsx` — Notifications
- **Avant** : redirection vers `/notifications` (route inexistante)
- **Après** : vraie page de notifications avec :
  - Liste de notifications catégorisées (Bookings, Messages, Reviews, System)
  - Filtres par catégorie (pill buttons)
  - Badge "unread" (point bleu + fond `bg-primary/5`)
  - Action "Mark all as read"
  - Clic sur une notification → marque comme lue
  - État vide avec illustration

---

## Freelance Dashboard — Pages

#### `src/app/(dashboard)/freelance-dashboard/notifications/page.tsx` — Notifications
- **Avant** : redirection vers `/notifications` (route inexistante)
- **Après** : vraie page de notifications avec :
  - Liste catégorisée (Rides, Payments, Reviews, System)
  - Filtres par catégorie
  - Badge "unread" + fond `bg-primary/5` pour les non lues
  - Action "Mark all as read"
  - Clic pour marquer comme lue
  - État vide

---

## Contraintes respectées

- Aucun fichier dans `src/service/` modifié
- Aucun fichier `.env` modifié
- Aucun fichier dans `src/app/api/` modifié
- Toutes les connexions backend laissées intactes
