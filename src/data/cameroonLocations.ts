export type CameroonDepartment = {
  name: string;
  arrondissements: string[];
};

export type CameroonRegion = {
  name: string;
  departments: CameroonDepartment[];
};

export const CAMEROON_REGIONS: CameroonRegion[] = [
  {
    name: 'Adamawa',
    departments: [
      { name: 'Djerem', arrondissements: [] },
      { name: 'Faro-et-Deo', arrondissements: [] },
      { name: 'Mayo-Banyo', arrondissements: [] },
      { name: 'Mbere', arrondissements: [] },
      { name: 'Vina', arrondissements: [] },
    ],
  },
  {
    name: 'Centre',
    departments: [
      { name: 'Haute-Sanaga', arrondissements: [] },
      { name: 'Lekie', arrondissements: [] },
      { name: 'Mbam-et-Inoubou', arrondissements: [] },
      { name: 'Mbam-et-Kim', arrondissements: [] },
      { name: 'Mefou-et-Afamba', arrondissements: [] },
      { name: 'Mefou-et-Akono', arrondissements: [] },
      { name: 'Mfoundi', arrondissements: [] },
      { name: 'Nyong-et-Kelle', arrondissements: [] },
      { name: 'Nyong-et-Mfoumou', arrondissements: [] },
      { name: 'Nyong-et-Soo', arrondissements: [] },
    ],
  },
  {
    name: 'East',
    departments: [
      { name: 'Boumba-et-Ngoko', arrondissements: [] },
      { name: 'Haut-Nyong', arrondissements: [] },
      { name: 'Kadey', arrondissements: [] },
      { name: 'Lom-et-Djerem', arrondissements: [] },
    ],
  },
  {
    name: 'Far North',
    departments: [
      { name: 'Diamare', arrondissements: [] },
      { name: 'Logone-et-Chari', arrondissements: [] },
      { name: 'Mayo-Danay', arrondissements: [] },
      { name: 'Mayo-Kani', arrondissements: [] },
      { name: 'Mayo-Sava', arrondissements: [] },
      { name: 'Mayo-Tsanaga', arrondissements: [] },
    ],
  },
  {
    name: 'Littoral',
    departments: [
      { name: 'Moungo', arrondissements: [] },
      { name: 'Nkam', arrondissements: [] },
      { name: 'Sanaga-Maritime', arrondissements: [] },
      { name: 'Wouri', arrondissements: [] },
    ],
  },
  {
    name: 'North',
    departments: [
      { name: 'Benoue', arrondissements: [] },
      { name: 'Faro', arrondissements: [] },
      { name: 'Mayo-Louti', arrondissements: [] },
      { name: 'Mayo-Rey', arrondissements: [] },
    ],
  },
  {
    name: 'Northwest',
    departments: [
      { name: 'Boyo', arrondissements: [] },
      { name: 'Bui', arrondissements: [] },
      { name: 'Donga-Mantung', arrondissements: [] },
      { name: 'Menchum', arrondissements: [] },
      { name: 'Mezam', arrondissements: [] },
      { name: 'Momo', arrondissements: [] },
      { name: 'Ngo-Ketunjia', arrondissements: [] },
    ],
  },
  {
    name: 'South',
    departments: [
      { name: 'Dja-et-Lobo', arrondissements: [] },
      { name: 'Mvila', arrondissements: [] },
      { name: 'Ocean', arrondissements: [] },
      { name: 'Vallee-du-Ntem', arrondissements: [] },
    ],
  },
  {
    name: 'Southwest',
    departments: [
      { name: 'Fako', arrondissements: [] },
      { name: 'Kupe-Manenguba', arrondissements: [] },
      { name: 'Lebialem', arrondissements: [] },
      { name: 'Manyu', arrondissements: [] },
      { name: 'Meme', arrondissements: [] },
      { name: 'Ndian', arrondissements: [] },
    ],
  },
  {
    name: 'West',
    departments: [
      { name: 'Bamboutos', arrondissements: [] },
      { name: 'Haut-Nkam', arrondissements: [] },
      { name: 'Hauts-Plateaux', arrondissements: [] },
      { name: 'Koung-Khi', arrondissements: [] },
      { name: 'Menoua', arrondissements: [] },
      { name: 'Mifi', arrondissements: [] },
      { name: 'Nde', arrondissements: [] },
      { name: 'Noun', arrondissements: [] },
    ],
  },
];
