# Audit Pages Authentifiées — LetsGo Frontend
**Date :** 2026-06-02  
**Branche :** hussel_relooking  
**Périmètre :** Pages dashboard (customer + freelance) — UX/UI + nouvelles pages à construire

---

## 1. Layout Dashboard (structure commune)

**Fichiers :** `src/app/(dashboard)/freelance-dashboard/layout.tsx` · `src/app/(dashboard)/customer-dashboard/layout.tsx`

| Problème | Impact | Fix recommandé |
|---|---|---|
| Header `bg-[#E0D9FD]` hardcodé | Hors design system | Remplacer par `bg-primary/10` ou variable CSS |
| Bouton "Upgrade" customer en `bg-blue-500` | Incohérence de marque | Remplacer par `bg-primary` |
| Customer sidebar : `justify-center` sur le `<nav>` | Items centrés verticalement — bizarre sur petits écrans | Retirer `justify-center`, utiliser `py-4` |
| Photo de profil cliquable dans le header pour changer la photo — aucune affordance | L'utilisateur ne sait pas que c'est cliquable | Ajouter overlay au hover + icône crayon |
| `user-contacts` et Personal Info ont le même icône `UserCircleIcon` | Confusion visuelle dans la nav | Remplacer contacts par `UsersIcon` |
| `Pendingorders = 0` hardcodé dans le layout freelance | Badge jamais mis à jour | Brancher sur une API ou retirer l'affichage |
| Pas de breadcrumbs ni de page title | L'utilisateur ne sait pas où il est | Ajouter un composant breadcrumb minimal |

---

## 2. Customer Dashboard — Pages

### `page.tsx` — Personal Info
**Fichier :** `src/app/(dashboard)/customer-dashboard/page.tsx`

| Problème | Fix recommandé |
|---|---|
| Mélange anglais/français : "Photo de profil", "Changer la photo" | Uniformiser en anglais ou utiliser les clés i18n |
| Bouton "Changer la photo" visible même hors mode édition | Montrer uniquement quand `editable === true` |
| Loading state = texte brut, pas de skeleton | Ajouter un skeleton de formulaire |

---

### `user-announce/page.tsx` — Announcements
**Fichier :** `src/app/(dashboard)/customer-dashboard/user-announce/page.tsx`

| Problème | Fix recommandé |
|---|---|
| Modal "Create" : champs texte libres pour departure/arrival | Modal "Edit" utilise les sélecteurs Région/Département/Arrondissement — incohérence majeure. Aligner les deux |
| `confirm()` natif pour la suppression | Remplacer par un modal de confirmation stylé |
| Bouton "+" flottant disparaît au scroll | Passer en `sticky` ou le placer dans le header de section |

---

### `user-booking/page.tsx` — Statistics
**Fichier :** `src/app/(dashboard)/customer-dashboard/user-booking/page.tsx`

| Problème | Fix recommandé |
|---|---|
| Toutes les données sont des mocks statiques (villes camerounaises fictives, chiffres inventés) | Brancher sur une vraie API ou afficher une page "Coming Soon" |
| Route `/user-booking` ne correspond pas au contenu "Statistics" | Renommer la route en `/user-stats` ou le label nav en "Bookings" |

---

### `user-chat/page.tsx` — Chat
**Fichier :** `src/app/(dashboard)/customer-dashboard/user-chat/page.tsx`

| Problème | Fix recommandé |
|---|---|
| Contacts hardcodés (Alice, Bob, Charlie...) | Brancher sur l'API de contacts réels ou marquer "Coming Soon" |
| `mb-[15%]` en bas — valeur arbitraire | Remplacer par `pb-20` |

---

### `user-notification/page.tsx` — Notifications
**Fichier :** `src/app/(dashboard)/customer-dashboard/user-notification/page.tsx`

| Problème | Fix recommandé |
|---|---|
| Redirige vers `/notifications` — route inexistante | Créer une vraie page de notifications (voir Phase 3 ci-dessous) |

---

### `user-wishlist/page.tsx` — Next Ride
**Fichier :** `src/app/(dashboard)/customer-dashboard/user-wishlist/page.tsx`

| Problème | Fix recommandé |
|---|---|
| Affiche uniquement `<SearchForm/>` — pas de liste de rides sauvegardés | Renommer en "Search" dans la nav, ou construire une vraie page de favoris |

---

### `user-address/page.tsx` — Addresses
**Fichier :** `src/app/(dashboard)/customer-dashboard/user-address/page.tsx`

| Problème | Fix recommandé |
|---|---|
| `mb-[20%]` — valeur arbitraire | Remplacer par `pb-20` |
| `confirm()` natif pour la suppression | Modal de confirmation |
| "20.00% VAT" hardcodé | Valeur variable ou masquée si non applicable |

---

### `user-security/page.tsx` — Security
**Fichier :** `src/app/(dashboard)/customer-dashboard/user-security/page.tsx`

| Problème | Fix recommandé |
|---|---|
| Bouton submit `bg-blue-600` | Remplacer par `bg-primary hover:bg-primary/90` |
| Pas de toggle show/hide password | Ajouter icône œil sur chaque champ |

---

## 3. Freelance Dashboard — Pages

### `security/page.tsx` — Security
**Fichier :** `src/app/(dashboard)/freelance-dashboard/security/page.tsx`

| Problème | Fix recommandé |
|---|---|
| Bouton submit `bg-blue-600` | Remplacer par `bg-primary hover:bg-primary/90` |
| Pas de toggle show/hide password | Ajouter icône œil sur chaque champ |

---

### `settings/page.tsx` — Settings
**Fichier :** `src/app/(dashboard)/freelance-dashboard/settings/page.tsx`

| Problème | Fix recommandé |
|---|---|
| `dummySettings` entièrement hardcodé, rien chargé depuis l'API | Brancher sur une API ou retirer du nav jusqu'à ce que ce soit prêt |

---

### `statistic/page.tsx` — Statistics
**Fichier :** `src/app/(dashboard)/freelance-dashboard/statistic/page.tsx`

| Problème | Fix recommandé |
|---|---|
| Données mockées importées depuis `@public/data/recentbookings` | Brancher sur une vraie API ou afficher "Coming Soon" |
| Utilise `var(--bg-1)` — variable CSS de l'ancien système | Remplacer par `bg-gray-50` |

---

### `portofolio/page.tsx` — Portfolio
**Fichier :** `src/app/(dashboard)/freelance-dashboard/portofolio/page.tsx`

| Problème | Fix recommandé |
|---|---|
| Redirige vers `/freelance-dashboard/finance/wallet` — incohérence totale | Corriger la redirection ou construire la vraie page portfolio |

---

### `notifications/page.tsx` — Notifications
**Fichier :** `src/app/(dashboard)/freelance-dashboard/notifications/page.tsx`

| Problème | Fix recommandé |
|---|---|
| Redirige vers `/notifications` — route inexistante | Créer une vraie page de notifications |

---

### `business/page.tsx` — Agency
**Fichier :** `src/app/(dashboard)/freelance-dashboard/business/page.tsx`

| Problème | Fix recommandé |
|---|---|
| Données entièrement mockées depuis `driverDTO` | Brancher sur l'API agence ou retirer du nav |

---

### `chat/page.tsx` — Chat
**Fichier :** `src/app/(dashboard)/freelance-dashboard/chat/page.tsx`

| Problème | Fix recommandé |
|---|---|
| Code identique à `customer-dashboard/user-chat/page.tsx` avec les mêmes contacts hardcodés | Factoriser en composant partagé et brancher sur une vraie API |

---

### `rate_app/page.tsx` — Rate App
**Fichier :** `src/app/(dashboard)/freelance-dashboard/rate_app/page.tsx`

| Problème | Fix recommandé |
|---|---|
| Gradient `from-purple-600 to-indigo-600` hors charte | Remplacer par `from-primary to-primary/80` |
| Bouton submit `bg-green-600` | Remplacer par `bg-primary` |
| Labels des critères en français sans passer par i18n | Utiliser les clés de traduction |

---

### `ratings/page.tsx` — Reviews
**Fichier :** `src/app/(dashboard)/freelance-dashboard/ratings/page.tsx`

| Problème | Fix recommandé |
|---|---|
| Gradient `from-blue-600 to-blue-400` hors design system | Remplacer par `from-primary to-primary/70` |
| Textes en français ("Note Moyenne", "Avis Reçus") sans i18n | Uniformiser ou passer par i18n |

---

## 4. Quick Wins (< 15 min chacun)

Ces corrections ne nécessitent que quelques lignes de code chacune.

- [ ] Remplacer tous les `bg-blue-600` / `bg-green-600` par `bg-primary` sur les boutons submit (security x2, rate_app, ratings)
- [ ] Corriger `portofolio/page.tsx` : redirection wallet → vraie destination
- [ ] Ajouter toggle show/hide password sur les deux pages Security
- [ ] Supprimer `confirm()` natif → remplacer par un modal de confirmation réutilisable
- [ ] Remplacer `mb-[15%]` et `mb-[20%]` par `pb-20` (user-chat, user-address)
- [ ] Remplacer `var(--bg-1)` par `bg-gray-50` dans statistic/page.tsx
- [ ] Aligner les gradients de headers (ratings, rate_app) sur `bg-primary`

---

## 5. Nouvelles Pages à Construire

### Priorité Haute

| Page | Route | Description |
|---|---|---|
| **Notifications — Freelance** | `/freelance-dashboard/notifications` | Liste : nouvelles rides, confirmations paiement, avis reçus, alertes système. Badge lu/non lu + filtre par catégorie |
| **Notifications — Customer** | `/customer-dashboard/user-notification` | Même concept côté client : confirmations de réservation, messages chauffeur, alertes |
| **Historique des courses — Customer** | `/customer-dashboard/user-trips` | Remplace les faux stats de `user-booking`. Liste paginée avec statut, montant, chauffeur, date. Filtres par période |

### Priorité Moyenne

| Page | Route | Description |
|---|---|---|
| **Performance Dashboard — Freelance** | `/freelance-dashboard/performance` | Remplace `statistic/page.tsx` mock. Métriques réelles : km, revenus du mois, taux d'acceptation, note moyenne sur 30 jours |
| **Portfolio / Expérience — Freelance** | `/freelance-dashboard/portofolio` | Formulaire expérience + certifications + zone de service + aperçu de la fiche publique |
| **Onboarding Wizard** | `/onboarding` | Flow post-inscription : compléter profil → ajouter véhicule → vérifier documents → choisir plan |

### Priorité Basse

| Page | Route | Description |
|---|---|---|
| **Chauffeurs Favoris — Customer** | `/customer-dashboard/user-favorites` | Drivers bookmarkés avec note et disponibilité. Remplace la wishlist actuelle qui est juste un SearchForm |
| **Gestion des Documents — Freelance** | `/freelance-dashboard/documents` | Upload permis, assurance, carte grise avec statut de validation (En attente / Validé / Expiré) |
| **Composant "Coming Soon"** | Réutilisable | Pour toutes les pages mockées ou en redirect cassée : illustration + message + date estimée |

---

## 6. Ordre d'exécution recommandé

```
Quick Wins (≈1h)
  ↓
Layout Dashboard — affordances + icônes nav (≈2h)
  ↓
Pages Customer : announce modal cohérence + security + address (≈2h)
  ↓
Pages Freelance : settings + business (données réelles ou Coming Soon) (≈1h)
  ↓
Nouvelles pages priorité haute : Notifications x2 + Historique courses (≈4h)
  ↓
Nouvelles pages priorité moyenne : Performance + Portfolio + Onboarding (≈6h+)
```

---

## Contraintes importantes

- Ne pas modifier les fichiers de services (`src/service/`) ni les appels API
- Ne pas modifier les fichiers d'environnement (`.env`)
- Ne pas toucher à `src/app/api/`
- Toutes les modifications doivent rester dans : composants, pages, styles CSS, config Tailwind
