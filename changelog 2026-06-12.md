# Changelog — 2026-06-12

Branch: `hussel_relooking`

## UI/UX Audit Fixes (main_fca.tex)

### Privacy & Security
- **Search card** (`SearchCardClientAnnouncement.jsx`): removed raw phone number from card list view; replaced contact details in the detail modal with *"Coordonnées disponibles après confirmation de réservation"*
- **Booking page** (`client-booking/page.jsx`): phone number is now masked until the booking request is confirmed (`bookingSent` state); only revealed after `handleProceed` succeeds

### Internationalisation & Copy
- **messages/en.json**: fixed three typos — `Flexibity` → `Flexibility`, `Car Pooling` → `Carpooling`, `Adminstration` → `Administration`
- **Booking page**: title `"Booking resume Informations"` → `"Récapitulatif de la réservation"`; button `"Proceed Booking"` → `"Confirmer et envoyer la demande"`
- **Search filter** (`client-search/page.jsx`): label `"Has car"` → `"Avec véhicule"`
- **Search card**: badge `"Has car"` → `"Avec véhicule"`; `"Voir plus"` button changed from filled dark to secondary outline style

### Dashboard
- **Personal info page** (`freelance-dashboard/page.tsx`): avatar moved from large centered block to compact left-aligned header row; empty fields now show `"+ Ajouter"` inline button instead of static `"Non renseigné"`
- **Dashboard sidebar layout** (`freelance-dashboard/layout.tsx`): `"Basic Plan"` button replaced by a styled pill badge; nav items now grouped by category (Compte, Organisation, Finance, Communauté, Système) with visible section labels

### Landing Page
- **Testimonials** (`Testimonial.tsx` + `Structure.ts`): replaced French placeholder text with realistic English testimonials; added star ratings (★★★★★) and company context; quote-first layout with smaller avatar
- **Partners section** (`Sponsor.tsx`): detects when all partner logos are placeholder images and falls back to displaying partner names as text badges instead of broken images

### Pricing
- **PaySwitch labels** (`pricing-plan/[profile]/page.tsx`): normalised capitalisation — `"monthly"` → `"Monthly"`, `"quarterly"` → `"Quarterly"`, `"annually"` → `"Annually"`

### Autocomplete
- **Geo-bias** (`scripts/autocomplete.js`): Photon API call now includes `countrycodes=cm&limit=10` — results are restricted to Cameroon at the API level; client-side pipeline adds country filter, expands settlement types (`city`, `town`, `village`), and deduplicates results by name
