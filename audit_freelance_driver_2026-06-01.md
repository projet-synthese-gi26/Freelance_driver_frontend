# Audit Relooking — LetsGo Frontend
**Date :** 2026-06-01  
**Branche :** hussel_relooking  
**Périmètre :** Frontend uniquement (sans toucher aux connexions backend)

---

## Diagnostic — Problèmes identifiés

Le codebase contient **deux ères de design mélangées** :

- **Ancien style** : classes CSS custom (`.text` = 0.83rem, `.title`, `.bigtitle`), couleurs hexadécimales codées en dur (`#2D3A96`, `#FE9261`), tailles inline
- **Nouveau style** : Tailwind propre (`text-4xl`, `text-5xl`), variables CSS, structure de composants clean

Résultat : incohérence visuelle, textes trop petits, Footer vide, page landing inachevée.

---

## Phase 1 — Fondations Design System

**Fichiers concernés :** `tailwind.config.ts`, `src/app/globals.css`

| Tâche | Raison |
|---|---|
| Ajouter les échelles de couleurs complètes dans Tailwind (`primary-50` → `primary-900`, `secondary-*`, `tertiary-*`) | Le code utilise `bg-primary-50`, `text-primary-500` etc. mais ils ne sont pas définis — ils tombent silencieusement à rien |
| Augmenter la taille de base des polices : `.text` → 0.95rem, `.title` → 1.25rem, `.bigtitle` → 1.75rem | Les tailles actuelles (0.83rem / 1.1rem / 1.5rem) sont trop petites et donnent une impression étriquée |
| Nettoyer les classes CSS dupliquées/conflictuelles | `btn-tertiary` est défini deux fois, les styles cookie banner alourdissent le fichier global |

---

## Phase 2 — Pages Landing (priorité haute — visibilité professeur)

**Fichiers concernés :**
- `src/components/landingpage/freelance/NewHero.tsx`
- `src/components/landingpage/Header.tsx`
- `src/components/landingpage/Footer.tsx`
- `src/components/landingpage/WhyChooseLetsgo.tsx`
- `src/components/landingpage/DriverSection.tsx`
- `src/components/landingpage/DownloadAppSection.tsx`

| Tâche | Raison |
|---|---|
| **Header** — ajouter un état actif sur les liens nav, augmenter la taille du logo, nettoyer le spacing | Actuellement aucun retour visuel sur la page courante |
| **NewHero.tsx** — remplacer les classes `.bigtitle`/`.text` par du Tailwind propre, corriger les badges qui se chevauchent en haut, améliorer les proportions de layout | La section hero utilise les vieilles classes custom et les deux badges du haut se superposent sur mobile |
| **Footer** — à construire de zéro (il est littéralement vide : `<div></div>`) | Un site sans footer paraît inachevé |
| **WhyChooseLetsgo / DriverSection / DownloadAppSection** — ajustements mineurs de spacing/typographie | Ces composants sont déjà propres mais utilisent un rythme de spacing légèrement différent du reste |

---

## Phase 3 — Pages Auth

**Fichiers concernés :**
- `src/app/(auth)/login/page.tsx`
- `src/components/auth/LoginForm.tsx`
- `src/components/auth/RegisterForm.tsx`
- `src/components/auth/ForgotPasswordForm.tsx`

| Tâche | Raison |
|---|---|
| Remplacer `bg-indigo-600` sur les boutons toggle de login par `bg-primary` | L'indigo est codé en dur et ne correspond pas à la couleur de marque |
| Améliorer le layout du formulaire Register — regrouper les champs liés, ajouter un indicateur de progression visuel | Le formulaire a beaucoup de champs (nom, email, téléphone, mot de passe, confirmation, organisation) sans regroupement visuel |
| Uniformiser le style des champs input sur tous les formulaires auth | Chaque formulaire utilise des styles de bordure/focus légèrement différents |

---

## Phase 4 — Layout Dashboard (si le temps le permet)

**Fichiers concernés :** `src/app/(dashboard)/`

| Tâche | Raison |
|---|---|
| Unifier les styles du composant sidebar | Les dashboards freelance et customer ont des hauteurs de sidebar et des paddings différents |
| Corriger les composants card/stat pour utiliser les couleurs du design system | Beaucoup de cards utilisent des valeurs hex codées en dur |

---

## Ordre d'exécution recommandé

```
Phase 1 (≈30min)
  → Footer Phase 2 (≈1h)
  → Header Phase 2 (≈1h)
  → NewHero Phase 2 (≈2h)
  → Auth Phase 3 (≈1h30)
  → Dashboard Phase 4 (optionnel)
```

**Commencer par la Phase 1** — corriger les tokens de design prend 30 minutes et facilite chaque changement suivant. Le Footer est la pièce la plus visiblement manquante et doit être fait tôt.

---

## Contraintes importantes

- Ne pas modifier les fichiers de services (`src/service/`) ni les appels API
- Ne pas modifier les fichiers d'environnement (`.env`)
- Ne pas toucher à `src/app/api/`
- Toutes les modifications doivent rester dans : composants, pages, styles CSS, config Tailwind
