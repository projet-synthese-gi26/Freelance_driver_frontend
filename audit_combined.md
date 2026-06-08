# Audit UI/UX — Synthèse combinée LetsGo + Yowyob Pricing
**Rapport de synthèse | Juin 2026**

> Ce document synthétise les conclusions des deux audits individuels ([audit_letsgo.md](./audit_letsgo.md) et [audit_pricing.md](./audit_pricing.md)) en un plan d'action unifié, classé par priorité globale.

---

## 1. Vue d'ensemble des scores

| Page | Note globale |
|---|---|
| LetsGo — Landing Page | 5.3/10 |
| Yowyob — Sélection du profil (`/pricing-plan`) | 4.8/10 |
| Yowyob — Choix du plan (`/pricing-plan/[profile]`) | 4.75/10 |
| **Moyenne globale** | **4.95/10** |

**Diagnostic global :** Le design système est solide (charte graphique cohérente, structure claire). Le problème principal est le contenu — textes placeholder non remplacés, copywriting générique, absence d'aide à la décision. Les corrections de contenu sont toutes à faible effort et fort impact.

---

## 2. Plan d'action unifié — Top 15 priorités

### 🔴 Critique — À corriger immédiatement

| # | Action | Page concernée | Impact | Effort |
|---|---|---|---|---|
| 1 | Remplacer les descriptions placeholder des profils (`"description of a driver with a vehicle"`) | Pricing — profils | Élevé | Très faible |
| 2 | Remplacer le titre `"GENERIC PLANS FOR..."` par un titre valorisant | Pricing — plan | Élevé | Très faible |
| 3 | Corriger la faute `"differents"` → `"different"` et réviser le sous-titre | Pricing — plan | Élevé | Très faible |
| 4 | Uniformiser la casse du toggle : `monthly / quarterly / annually` | Pricing — plan | Moyen | Très faible |
| 5 | Masquer les champs Organisation/Title/Description pour les passagers dans le formulaire d'inscription | LetsGo — register | Élevé | Faible |
| 6 | Remplacer les faux témoignages et photos placeholder | LetsGo — landing | Élevé | Moyen |

### 🟠 Important — À corriger dans le sprint suivant

| # | Action | Page concernée | Impact | Effort |
|---|---|---|---|---|
| 7 | Ajouter un badge `"Most popular"` sur le plan Standard | Pricing — plan | Moyen | Très faible |
| 8 | Ajouter un badge `"Free"` sur le plan Basic (0 FCFA) | Pricing — plan | Moyen | Très faible |
| 9 | Différencier le bouton CTA du plan Basic (style outline vs. plein pour Premium) | Pricing — plan | Moyen | Faible |
| 10 | Afficher les remises pour les plans trimestriel et annuel dans le toggle | Pricing — plan | Élevé | Faible |
| 11 | Réduire les CTA du hero à 2 max (un par audience) | LetsGo — hero | Élevé | Faible |
| 12 | Marquer les champs obligatoires avec un astérisque (*) dans les formulaires | LetsGo — register | Faible | Très faible |

### 🟡 À planifier — Améliorations moyen terme

| # | Action | Page concernée | Impact | Effort |
|---|---|---|---|---|
| 13 | Ajouter un tableau comparatif des fonctionnalités sous les cartes tarifaires | Pricing — plan | Moyen | Moyen |
| 14 | Intégrer une mini-FAQ sur la résiliation, les remboursements et l'essai gratuit | Pricing — plan | Moyen | Moyen |
| 15 | Remplacer les logos partenaires placeholder par de vraies images | LetsGo — landing | Élevé | Moyen |

---

## 3. Problèmes transversaux (communs aux deux produits)

### Contenu placeholder non remplacé
Les deux produits contiennent du contenu de développement non remplacé avant mise en ligne :
- Descriptions de profils génériques
- Photos de témoignages incorrectes
- Textes de plans copié-collé sans adaptation

**Action :** Instaurer une checklist pré-déploiement qui vérifie l'absence de contenu placeholder.

### Copywriting insuffisant
Le texte ne vend pas le produit — il le décrit de façon neutre. Les avantages sont listés sans bénéfice utilisateur clair.

**Action :** Reformuler tous les textes marketing avec la structure "avantage + bénéfice concret" (ex. "Jusqu'à 12h/jour sur la plateforme — maximisez vos revenus").

### Accessibilité partielle
Absence d'états de focus visibles, contrastes insuffisants sur textes secondaires, icônes sans aria-label.

**Action :** Audit d'accessibilité WCAG AA complet sur les pages prioritaires (login, register, pricing).

---

## 4. Ce qui fonctionne bien (à conserver)

- **Charte graphique cohérente** : couleurs, typographie, icônes cohérents entre les deux produits
- **Structure des pages bien pensée** : stepper d'onboarding, toggle driver/passenger, 3 niveaux de plan
- **Indicatif téléphonique intégré** dans le formulaire d'inscription
- **Mise en avant du plan Standard** par fond foncé = bonne pratique de pricing
- **Toggle Email/Phone** sur la page de connexion = bonne ergonomie

---

*Synthèse générée — Juin 2026*
