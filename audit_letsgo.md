# Audit UI/UX — LetsGo Landing Page
**Évaluation complète | Juin 2026**

---

## 1. Présentation générale

LetsGo est une plateforme de mise en relation entre chauffeurs et passagers, ciblant deux audiences distinctes : les clients cherchant un trajet et les chauffeurs souhaitant trouver des clients. L'analyse porte sur l'ensemble de la landing page, incluant le hero, la section des avantages drivers, les témoignages, les partenaires et le footer.

---

## 2. Scores par critère

| Critère | Note |
|---|---|
| Clarté du message | 8/10 |
| Hiérarchie visuelle | 6/10 |
| Cohérence des CTA | 4/10 |
| Authenticité des contenus | 3/10 |
| Design et cohérence visuelle | 6/10 |
| Qualité de la copie (texte) | 5/10 |
| Crédibilité & social proof | 3/10 |
| Footer & navigation | 7/10 |
| **NOTE GLOBALE** | **5.3/10** |

---

## 3. Analyse détaillée par section

### 3.1 — Hero (section principale)

| ✓ Points positifs | ✗ Points faibles | → Suggestions |
|---|---|---|
| Proposition de valeur claire et accrocheuse | Surcharge de CTA : 4 actions sur un seul hero (confusion) | Réduire à 1 CTA principal par audience (client vs chauffeur) |
| Photo d'un chauffeur souriant = identification immédiate | Boutons de styles incohérents : noir, vert arrondi, bleu marine | Uniformiser le design des boutons : 1 couleur primaire, 1 secondaire |
| Deux parcours utilisateurs distingués (client / chauffeur) | Champ de localisation sans contexte d'utilisation claire | Ajouter un placeholder explicatif dans le champ de localisation |
| Logo distinctif et mémorable | Badge 'Freelance Driver' non expliqué | Expliquer ou retirer le badge non contextuel |

### 3.2 — Driver Benefits

| ✓ Points positifs | ✗ Points faibles | → Suggestions |
|---|---|---|
| Structure en 3 colonnes claire et aérée | Faute de frappe : 'Flexibity' au lieu de 'Flexibility' | Corriger les fautes de frappe |
| Icônes lisibles et cohérentes entre elles | Textes trop longs pour une section avantages (dense) | Réduire le texte à 2-3 phrases max par avantage |
| Contenu pertinent pour la cible chauffeur | Icône '24/7 Support' représente des personnes, pas un support | Utiliser une icône casque/téléphone pour le support |

### 3.3 — Témoignages (Testimonials)

| ✓ Points positifs | ✗ Points faibles | → Suggestions |
|---|---|---|
| Section testimonials présente = bonne pratique | Photo de profil = un immeuble la nuit (clairement fausse/placeholder) | Utiliser de vraies photos de profil (ou avatars générés) |
| Mise en page propre avec navigation gauche/droite | Témoignage en français alors que la page est en anglais | Cohérence linguistique : tout en anglais OU toggle FR/EN |
| | Un seul témoignage visible = manque de volume de preuves | Afficher 3 témoignages min. avec nom + poste + entreprise |
| | Titre 'Manager' trop générique, sans entreprise ni contexte | Ajouter note étoiles (★★★★★) pour crédibiliser |

### 3.4 — Partenaires (Our Partners)

| ✓ Points positifs | ✗ Points faibles | → Suggestions |
|---|---|---|
| La présence d'une section partenaires est rassurante | 4 images de buildings/villes sans aucun logo ni nom de partenaire | Afficher les logos officiels des entreprises partenaires |
| Grille à 4 colonnes bien structurée | Impossible d'identifier les partenaires réels | Si pas encore de partenaires, retirer temporairement cette section |
| | Images génériques = section semble vide de sens / abandonnée | Lier chaque partenaire à son site (témoigne de confiance) |

### 3.5 — App mobile & Footer

| ✓ Points positifs | ✗ Points faibles | → Suggestions |
|---|---|---|
| Footer bien structuré avec 4 colonnes logiques | Copyright '2026 Lets Go' — espace manquant : '© 2026 Lets Go' | Corriger le copyright avec le symbole © |
| Présence des liens légaux (ToS, Privacy Policy, Cookies) | Section Marketplace dans le footer trop descriptive (pas des liens) | Le footer Marketplace doit lister des liens cliquables, pas du texte |
| Réseaux sociaux bien visibles en bas de page | Boutons App Store dupliqués (dans le body ET dans le footer) | Conserver les badges app uniquement dans le footer ou le body |
| Section app mobile avec badges App Store / Google Play | | |

### 3.6 — Navigation dropdown (menu déroulant)

| ✓ Points positifs | ✗ Points faibles | → Suggestions |
|---|---|---|
| Structure propre, fond blanc lisible | Highlight sur "Travel Agency" sans raison = confusion état actif/hover | Réserver le highlight uniquement à l'item survolé ou à la page active |
| Items courts et directs | Aucune icône = scan visuel lent, lecture mot à mot obligatoire | Ajouter une icône à gauche de chaque item (avion, clé, voiture...) |
| | Pas d'ombre ni de bordure : le menu flotte sans profondeur visible | Ajouter une ombre portée légère et une bordure fine |
| | "Car Pooling" en deux mots — devrait être "Carpooling" | Corriger en "Carpooling" |
| | Aucun indicateur d'item actif (page courante non marquée) | Marquer la page active en gras ou avec un point coloré |

### 3.7 — Page de connexion (Sign In)

| ✓ Points positifs | ✗ Points faibles | → Suggestions |
|---|---|---|
| Design épuré et aéré, bien centré | 'Yowyob' comme SSO tiers non reconnu — manque de crédibilité | Remplacer Yowyob par un SSO connu ou expliquer ce que c'est |
| Options SSO cohérentes (Google, Apple) | Bouton 'Close' en bas redondant avec le X en haut | Supprimer le bouton Close — le X suffit |
| Toggle Email/Phone pratique | Aucun message d'erreur visible ni feedback de validation | Prévoir des états d'erreur (champ rouge + message) |
| | Contraste faible du placeholder (Email, Password) | Renforcer le contraste des placeholders pour l'accessibilité |

### 3.8 — Page d'inscription Driver

| ✓ Points positifs | ✗ Points faibles | → Suggestions |
|---|---|---|
| Indicatif pays (+237 CM) intégré = bonne pratique | Formulaire trop long sans aucun regroupement visuel (flat list) | Regrouper les champs par blocs (Infos perso / Contact / Organisation) |
| Toggle Driver/Passenger bien visible en haut | Organisation Name et Title = champs pro non expliqués pour un chauffeur | Clarifier ou masquer conditionnellement Organisation Name selon le profil |
| Champ Password avec toggle visibilité | Aucun label flottant ni bordure active — champs difficiles à distinguer | Ajouter des bordures de focus colorées sur les champs actifs |
| | Aucun indicateur de champs obligatoires vs optionnels | Marquer les champs requis avec un astérisque (*) |

### 3.9 — Page d'inscription Passenger

| ✓ Points positifs | ✗ Points faibles | → Suggestions |
|---|---|---|
| Même structure que Driver = cohérence entre les deux onglets | Exactement le même formulaire que Driver — champs pro inutiles pour un passager | Adapter le formulaire au profil : retirer les champs pro pour les passagers |
| Toggle clair pour switcher entre Driver et Passenger | Organisation Name, Title, Organisation Description n'ont aucun sens pour un passager | Pour Passenger : garder uniquement Nom, Email, Téléphone, Password |
| | Formulaire identique = aucune personnalisation selon le profil choisi | Utiliser le toggle comme vrai conditionnel qui change les champs affichés |
| | Risque de confusion : le passager se demande pourquoi renseigner une organisation | Ajouter une courte phrase de bienvenue selon le profil sélectionné |

### 3.10 — Sélecteur de langue

| ✓ Points positifs | ✗ Points faibles | → Suggestions |
|---|---|---|
| Drapeaux = identification visuelle instantanée des langues | Aucun indicateur de langue active (pas de coche, bold ou highlight) | Marquer la langue active avec une coche ou du texte en gras |
| Liste courte et lisible, pas surchargée | Allemand et Espagnol proposés sans certitude de traduction disponible | Ne lister que les langues réellement disponibles et traduites |
| Ambition internationale cohérente pour la plateforme | Drapeau UK pour l'anglais = restrictif pour une audience africaine anglophone | Utiliser un drapeau neutre ou international pour l'anglais |
| | Aucune langue africaine locale malgré un marché cible africain clair | Envisager d'ajouter des langues africaines prioritaires (arabe, swahili...) |
| | Incohérence de casse : «EN» majuscules dans la navbar vs «English» dans le dropdown | Uniformiser la casse entre la navbar et le dropdown |

---

## 4. Priorités d'action

| # | Action | Impact | Effort |
|---|---|---|---|
| 1 | Remplacer les faux témoignages et photos placeholder | Élevé | Moyen |
| 2 | Réduire les CTA du hero à 2 max (un par audience) | Élevé | Faible |
| 3 | Corriger les fautes de frappe (Flexibity → Flexibility) | Moyen | Très faible |
| 4 | Remplacer les logos partenaires par de vraies images | Élevé | Moyen |
| 5 | Uniformiser le système de boutons (couleurs + styles) | Moyen | Moyen |
| 6 | Masquer les champs pro pour les passagers dans le formulaire d'inscription | Élevé | Faible |
| 7 | Ajouter indicateurs de champs obligatoires (*) | Faible | Très faible |

---

## Note finale

Le produit LetsGo montre une bonne vision produit et une compréhension des audiences cibles. Cependant, plusieurs signaux trahissent un prototype ou MVP encore en cours de construction : faux témoignages, images placeholder, fautes non corrigées. Ces éléments nuisent à la crédibilité bien plus qu'un design perfectible. La priorité absolue est la qualité et l'authenticité du contenu avant tout polissage visuel.

*Rapport généré — Juin 2026*
