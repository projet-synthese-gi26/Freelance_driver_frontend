// app/types/experience.ts

// Représente le permis de conduire
export interface DriverLicense {
  id: string; // L'ID du produit dans le backend
  photoUrl: string; // L'URL de l'image du permis
}

// Représente le CV
export interface CV {
  id: string; // L'ID du produit dans le backend
  fileUrl: string; // L'URL du fichier PDF
  fileName: string; // Le nom du fichier
}

// Représente une seule expérience professionnelle
export interface Experience {
  id: string; // L'ID du produit dans le backend
  company: string;
  referent: string;
  startDate?: string; // Stocké en string "YYYY-MM-DD"
  endDate?: string;
  currentlyWorking: boolean;
}