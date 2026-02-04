// src/components/navigoo/index.ts
// Exports centralisés des composants Navigoo

export { default as NavigooMap } from './NavigooMap';
export { default as PoiInfoCard } from './PoiInfoCard';
export { default as NavigooSidebar } from './NavigooSidebar';

// Re-export des types utiles
export type { 
  NavigooPoi, 
  RouteInfo, 
  PointOfInterestData,
  MapViewType,
  PoiCategory,
  NavigooMapOptions,
  NavigooProfileData
} from '@/type/navigoo';

// Re-export des constantes
export { 
  POI_COLORS, 
  DEFAULT_MAP_CENTER, 
  DEFAULT_MAP_ZOOM,
  DEFAULT_TILE_SERVER
} from '@/type/navigoo';

// Re-export des fonctions utilitaires
export { 
  getDistance, 
  findClosestPoi,
  navigooService 
} from '@/service/navigooService';
