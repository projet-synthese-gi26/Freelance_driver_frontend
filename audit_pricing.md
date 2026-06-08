# Audit UI/UX — Yowyob Pricing Pages
**Évaluation complète | Juin 2026**

---

## 1. Présentation générale

La page de tarification de Yowyob constitue la première étape du parcours d'onboarding des chauffeurs. Elle présente deux profils distincts — « Driver With Vehicle » et « Driver Only » — et guide l'utilisateur à travers un processus en 3 étapes : sélection du profil, choix du plan, et démarrage de la recherche. L'analyse porte sur la clarté décisionnelle, la hiérarchie visuelle, l'UX de navigation et la qualité du contenu affiché.

---

## 2. Page 1 — Sélection du profil (`/pricing-plan`)

### Scores

| Critère | Note |
|---|---|
| Clarté du message principal | 7/10 |
| Qualité de l'information affichée | 3/10 |
| Hiérarchie visuelle | 6/10 |
| Aide à la décision | 2/10 |
| Accessibilité & contraste | 5/10 |
| Navigation & stepper | 4/10 |
| Utilisation de l'espace | 4/10 |
| Design & cohérence visuelle | 7/10 |
| **NOTE GLOBALE** | **4.8/10** |

### 2.1 — Stepper de navigation

| ✓ Points positifs | ✗ Points faibles | → Suggestions |
|---|---|---|
| Présence d'un indicateur d'étapes = bonne pratique d'onboarding | Stepper purement décoratif : aucune étape n'est mise en surbrillance comme active | Marquer l'étape courante avec une couleur ou un indicateur visuel |
| 3 étapes claires et compréhensibles en un coup d'œil | Non cliquable : impossible de revenir à une étape précédente via le stepper | Rendre les étapes précédentes cliquables |
| | Absence de description sous chaque étape | Ajouter une courte description sous chaque label d'étape |

### 2.2 — Sélection du profil

| ✓ Points positifs | ✗ Points faibles | → Suggestions |
|---|---|---|
| Deux profils clairement distincts visuellement avec des icônes distinctives | Descriptions génériques : 'description of a driver with a vehicle' = placeholder non remplacé | Remplacer par 2-3 bullet points concrets |
| Badge 'Profile 1 / Profile 2' = identification rapide | Impossible de différencier les profils sans cliquer : aucune information sur les avantages | Afficher les différences clés directement sur la carte |
| Bouton CTA bien visible avec style cohérent | Aucun plan ou fourchette de prix visible avant la sélection = décision à l'aveugle | Afficher le prix de départ de chaque plan (ex. 'À partir de 0 FCFA') |
| | L'indicateur 'Pricing plans available' avec un simple point bleu n'apporte rien | Remplacer par le nombre de plans disponibles (ex. '3 plans disponibles') |

### 2.3 — Accessibilité & contraste

| ✓ Points positifs | ✗ Points faibles | → Suggestions |
|---|---|---|
| Fond général neutre (bleu très pâle) agréable visuellement | Texte gris clair sur fond blanc dans les sous-titres : contraste potentiellement < 4.5:1 WCAG AA | Renforcer la valeur de contraste des textes secondaires (min. #666666) |
| Cartes bien délimitées avec des bordures visibles | Aucun état focus visible sur les boutons pour les utilisateurs clavier | Ajouter un outline de focus explicite sur les éléments interactifs |
| | Icônes sans texte alternatif apparent (accessibilité lecteur d'écran) | Ajouter des attributs aria-label sur les icônes |

### 2.4 — Aide à la décision

| ✓ Points positifs | ✗ Points faibles | → Suggestions |
|---|---|---|
| Le texte d'introduction guide l'utilisateur sur le processus global | Aucun élément pour aider un utilisateur hésitant à choisir | Ajouter un lien 'Je ne sais pas lequel choisir' menant à une explication comparative |
| | Pas de FAQ, tooltip, ou comparatif entre les deux profils | Intégrer un tableau comparatif accessible depuis la page |
| | Aucun indicateur de popularité (ex. 'Le plus choisi') | Mettre en avant le profil le plus sélectionné |

### 2.5 — Utilisation de l'espace

| ✓ Points positifs | ✗ Points faibles | → Suggestions |
|---|---|---|
| Mise en page propre, pas surchargée | La moitié inférieure de la page est entièrement vide — espace non utilisé | Utiliser cet espace pour un aperçu des plans, une FAQ rapide ou un témoignage |
| Deux cartes côte à côte bien équilibrées sur desktop | Sur mobile, les deux cartes empilées peuvent paraître monotones | Tester un affichage vertical différencié sur mobile |
| | Aucune information complémentaire visible sans interaction | Appliquer le principe de progressive disclosure |

---

## 3. Page 2 — Choix du plan (`/pricing-plan/[profile]`)

### Scores

| Critère | Note |
|---|---|
| Clarté de la proposition de valeur | 5/10 |
| Différenciation entre les plans | 4/10 |
| Qualité du copywriting | 3/10 |
| Hiérarchie visuelle des plans | 6/10 |
| Toggle de fréquence (mensuel/annuel) | 4/10 |
| Pertinence des avantages listés | 5/10 |
| Confiance & crédibilité du prix | 4/10 |
| Design & cohérence visuelle | 7/10 |
| **NOTE GLOBALE** | **4.75/10** |

### 3.1 — En-tête & titre de la page

| ✓ Points positifs | ✗ Points faibles | → Suggestions |
|---|---|---|
| Titre court et direct | Titre 'GENERIC PLANS FOR...' : le mot 'GENERIC' est contre-productif | Remplacer par un titre valorisant : 'Plans designed for {profile}' |
| Sous-titre présent pour guider l'utilisateur | Faute d'orthographe : 'differents' au lieu de 'different' | Corriger les fautes et réviser le copywriting |
| | Texte du sous-titre trop informel et flou ('Feel free and explore the terms') | Reformuler en bénéfice utilisateur |

### 3.2 — Toggle de fréquence de paiement

| ✓ Points positifs | ✗ Points faibles | → Suggestions |
|---|---|---|
| Présence du toggle = bonne pratique | Aucune indication de réduction pour les plans trimestriel ou annuel | Afficher explicitement la remise : ex. '-15% avec le plan annuel' |
| 3 options clairement distinctes avec état actif visible | La casse est incohérente : 'monthly' vs 'Quarterly' vs 'annually' | Uniformiser la casse : tout en minuscule |
| | Aucun feedback visuel sur le prix quand on change la fréquence | Animer le changement de prix au clic |

### 3.3 — Carte Basic (0 FCFA)

| ✓ Points positifs | ✗ Points faibles | → Suggestions |
|---|---|---|
| Prix de 0 FCFA = bon point d'entrée sans friction financière | Le plan gratuit n'est pas nommé 'Gratuit' ou 'Free' | Ajouter un badge 'Free' ou 'Gratuit' |
| 3 avantages listés de façon concise | Accès limité à 5h/jour : contrainte non expliquée | Contextualiser la limite : 'Pour débuter sans engagement — jusqu'à 5h/jour' |
| | Pas de CTA différencié : le bouton 'Choose Plan' est identique au premium visuellement | Sur le plan gratuit, utiliser un style de bouton secondaire (outline) |

### 3.4 — Carte Standard (5 000 FCFA)

| ✓ Points positifs | ✗ Points faibles | → Suggestions |
|---|---|---|
| Plan visuellement mis en avant avec fond sombre | Seulement 3 avantages dont le premier est 'All benefits of Basic included' — peu différenciant | Lister au moins 4-5 avantages exclusifs concrets |
| Prix clairement affiché et lisible sur le fond foncé | 'Legal support increasing as earning fidelity points' : formulation très floue | Simplifier : 'Support juridique inclus + programme de fidélité' |
| CTA blanc sur fond bleu = bon contraste | 'Work hours set at 12 hours' : présenté comme un avantage mais c'est une limite fixe | Reformuler : 'Jusqu'à 12h de travail quotidien sur la plateforme' |
| | Aucun badge 'Le plus populaire' malgré sa mise en avant visuelle | Ajouter un badge textuel 'Most popular' |

### 3.5 — Carte Premium (10 000 FCFA)

| ✓ Points positifs | ✗ Points faibles | → Suggestions |
|---|---|---|
| Prix clairement affiché | Seulement 3 avantages — un plan premium devrait en avoir davantage | Enrichir avec des avantages exclusifs : priorité dans les résultats, badge VIP, support dédié |
| 'Unlimited and flexible work hours' = avantage fort et bien formulé | 'A high-quality VIP service vehicle is made available' : ambiguïté sur le véhicule | Clarifier la nature du véhicule VIP |
| 'All benefits of both basic and standard packages are included' = rassurant | Aucun élément de différenciation émotionnelle ou de prestige | Ajouter des éléments de statut : badge profil Premium visible, accès anticipé |
| | Le rapport qualité/prix Standard vs Premium n'est pas évident | Ajouter un encart 'Pourquoi choisir Premium ?' |

### 3.6 — Hiérarchie & comparaison des plans

| ✓ Points positifs | ✗ Points faibles | → Suggestions |
|---|---|---|
| Trois plans = structure classique et rassurante | Aucun tableau comparatif : impossible de comparer les plans côte à côte | Ajouter un tableau récapitulatif en bas de page |
| Mise en avant du plan Standard = guide bien la décision | Le plan Basic à 0 FCFA peut cannibaliser l'adoption du Standard | Renforcer la frontière Basic/Standard avec des avantages vraiment exclusifs |
| | Aucune FAQ sur les plans (remboursement, résiliation, période d'essai) | Ajouter une section FAQ minimale sous les cartes |

---

## 4. Priorités d'action

| # | Action | Impact | Effort |
|---|---|---|---|
| 1 | Remplacer 'GENERIC PLANS' par un titre valorisant | Élevé | Très faible |
| 2 | Corriger les fautes ('differents') et réviser le copywriting | Élevé | Faible |
| 3 | Uniformiser la casse du toggle (monthly/quarterly/annually) | Moyen | Très faible |
| 4 | Remplacer les descriptions placeholder des profils | Élevé | Faible |
| 5 | Afficher les remises pour les plans trimestriel et annuel dans le toggle | Élevé | Faible |
| 6 | Clarifier l'ambiguïté sur le 'véhicule mis à disposition' | Élevé | Faible |
| 7 | Ajouter un badge 'Most popular' sur le plan Standard | Faible | Très faible |
| 8 | Ajouter un badge 'Free' sur le plan Basic | Faible | Très faible |
| 9 | Ajouter un tableau comparatif des fonctionnalités en bas de page | Moyen | Moyen |
| 10 | Intégrer une mini-FAQ sur la résiliation, les remboursements | Moyen | Moyen |

---

## Note finale

Les deux pages analysées forment un tunnel d'onboarding dont la structure est bien pensée mais dont le contenu est encore au stade de prototype. Les problèmes sont systémiques : textes placeholder non remplacés, copywriting générique, différenciation insuffisante et absence d'aide à la décision. Le design et la charte graphique sont cohérents et soignés — c'est un atout réel. Mais sans contenu de qualité, ils ne suffiront pas à convaincre un chauffeur d'entrer sa carte bancaire.

*Rapport généré — Juin 2026*
