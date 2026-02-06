// src/components/navigoo/NavigooMap.tsx
// Composant principal de carte Navigoo utilisant Leaflet

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { 
  NavigooPoi, 
  RouteInfo, 
  DEFAULT_MAP_CENTER, 
  DEFAULT_MAP_ZOOM,
  DEFAULT_TILE_SERVER,
  TILE_ATTRIBUTION,
  POI_COLORS,
  MapViewType
} from '@/type/navigoo';
import { navigooService, getDistance, findClosestPoi } from '@/service/navigooService';

// Import dynamique pour éviter les erreurs SSR avec Leaflet
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
);
const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
);

interface NavigooMapProps {
  viewType: MapViewType;
  center?: [number, number];
  zoom?: number;
  pois?: NavigooPoi[];
  route?: RouteInfo | null;
  highlightedPosition?: [number, number] | null;
  tileServerUrl?: string;
  onPoiClick?: (poi: NavigooPoi) => void;
  onMapReady?: () => void;
  showUserPosition?: boolean;
  enableRouting?: boolean;
  className?: string;
  useMockData?: boolean;
}

const NavigooMap: React.FC<NavigooMapProps> = ({
  viewType,
  center = DEFAULT_MAP_CENTER,
  zoom = DEFAULT_MAP_ZOOM,
  pois: externalPois,
  route,
  highlightedPosition,
  tileServerUrl = DEFAULT_TILE_SERVER,
  onPoiClick,
  onMapReady,
  showUserPosition = true,
  enableRouting = true,
  className = '',
  useMockData = true // Par défaut true pour développement
}) => {
  const [isClient, setIsClient] = useState(false);
  const [pois, setPois] = useState<NavigooPoi[]>(externalPois || []);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPoi, setSelectedPoi] = useState<NavigooPoi | null>(null);
  const [L, setL] = useState<any>(null);
  const mapRef = useRef<any>(null);

  // S'assurer qu'on est côté client
  useEffect(() => {
    setIsClient(true);
    // Charger Leaflet dynamiquement
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
      // Fix pour les icônes Leaflet
      delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl;
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });
    });
  }, []);

  // Charger les POI
  useEffect(() => {
    const loadPois = async () => {
      if (externalPois && externalPois.length > 0) {
        setPois(externalPois);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        let loadedPois: NavigooPoi[];
        
        if (useMockData) {
          // Utiliser les données mock pour le développement
          loadedPois = viewType === 'client' 
            ? navigooService.getMockDriversPoi()
            : navigooService.getMockClientsPoi();
        } else {
          // Charger depuis l'API
          loadedPois = await navigooService.getPoisByViewType(viewType);
        }
        
        setPois(loadedPois);
      } catch (error) {
        console.error('Erreur chargement POI:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isClient) {
      loadPois();
    }
  }, [viewType, externalPois, isClient, useMockData]);

  // Récupérer la position de l'utilisateur
  useEffect(() => {
    if (showUserPosition && isClient) {
      navigooService.getUserPosition().then(setUserPosition);
    }
  }, [showUserPosition, isClient]);

  // Calculer l'itinéraire si route est fournie
  useEffect(() => {
    const calculateRoute = async () => {
      if (route && enableRouting) {
        const coords = await navigooService.calculateRoute(route.start, route.end);
        setRouteCoords(coords);
      } else {
        setRouteCoords(null);
      }
    };

    if (isClient) {
      calculateRoute();
    }
  }, [route, enableRouting, isClient]);

  // Callback quand la carte est prête
  useEffect(() => {
    if (!isLoading && isClient && onMapReady) {
      onMapReady();
    }
  }, [isLoading, isClient, onMapReady]);

  // Créer une icône personnalisée
  const createCustomIcon = useCallback((poiType: string) => {
    if (!L) return undefined;

    const color = POI_COLORS[poiType as keyof typeof POI_COLORS] || '#6b7280';
    
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        ">
          <div style="
            transform: rotate(45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            color: white;
            font-size: 14px;
          ">
            ${poiType === 'driver_available' ? '🚗' : poiType === 'client_with_announce' ? '👤' : '📍'}
          </div>
        </div>
      `,
      iconSize: [32, 42],
      iconAnchor: [16, 42],
      popupAnchor: [0, -42]
    });
  }, [L]);

  // Créer une icône pour la position utilisateur
  const createUserIcon = useCallback(() => {
    if (!L) return undefined;

    return L.divIcon({
      className: 'user-marker',
      html: `
        <div style="
          background-color: #ef4444;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
          animation: pulse 2s infinite;
        "></div>
        <style>
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
            70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
            100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
          }
        </style>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  }, [L]);

  // Gérer le clic sur un POI
  const handlePoiClick = (poi: NavigooPoi) => {
    setSelectedPoi(poi);
    if (onPoiClick) {
      onPoiClick(poi);
    }
  };

  // Trouver le POI le plus proche
  const handleFindClosest = () => {
    if (userPosition && pois.length > 0) {
      const closest = findClosestPoi(userPosition, pois);
      if (closest) {
        setSelectedPoi(closest);
        if (onPoiClick) {
          onPoiClick(closest);
        }
      }
    }
  };

  // Calculer l'itinéraire vers un POI
  const handleRouteToPoI = async (poi: NavigooPoi) => {
    if (userPosition) {
      const coords = await navigooService.calculateRoute(userPosition, poi.coords);
      setRouteCoords(coords);
    }
  };

  if (!isClient) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-xl ${className}`} style={{ height: '500px' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Barre d'outils */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
        <button
          onClick={handleFindClosest}
          className="bg-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition flex items-center gap-2 text-sm font-medium"
          title="Trouver le plus proche"
        >
          <span>📍</span>
          <span className="hidden md:inline">Plus proche</span>
        </button>
        
        {selectedPoi && (
          <button
            onClick={() => handleRouteToPoI(selectedPoi)}
            className="bg-primary text-white px-4 py-2 rounded-lg shadow-md hover:bg-primary/90 transition flex items-center gap-2 text-sm font-medium"
            title="Itinéraire"
          >
            <span>🗺️</span>
            <span className="hidden md:inline">Itinéraire</span>
          </button>
        )}
      </div>

      {/* Indicateur de chargement */}
      {isLoading && (
        <div className="absolute inset-0 z-[999] bg-white/80 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Chargement des points...</p>
          </div>
        </div>
      )}

      {/* Légende */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-lg shadow-md p-3">
        <p className="text-xs font-semibold text-gray-700 mb-2">Légende</p>
        <div className="flex flex-col gap-1">
          {viewType === 'client' ? (
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: POI_COLORS.driver_available }}></div>
              <span>Chauffeurs disponibles</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: POI_COLORS.client_with_announce }}></div>
              <span>Clients avec annonce</span>
            </div>
          )}
          {userPosition && (
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: POI_COLORS.user_position }}></div>
              <span>Votre position</span>
            </div>
          )}
        </div>
      </div>

      {/* Compteur de POI */}
      <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-md px-3 py-2">
        <p className="text-sm font-medium text-gray-700">
          {pois.length} {viewType === 'client' ? 'chauffeur(s)' : 'client(s)'}
        </p>
      </div>

      {/* Carte Leaflet */}
      <MapContainer
        center={userPosition || center}
        zoom={zoom}
        style={{ height: '500px', width: '100%', borderRadius: '0.75rem' }}
        ref={mapRef}
      >
        <TileLayer
          attribution={TILE_ATTRIBUTION}
          url={tileServerUrl}
        />

        {/* Marqueurs POI */}
        {pois.map((poi) => (
          <Marker
            key={poi.id}
            position={poi.coords}
            icon={createCustomIcon(poi.poiType)}
            eventHandlers={{
              click: () => handlePoiClick(poi)
            }}
          >
            <Popup>
              <div className="min-w-[200px]">
                <div className="flex items-center gap-3 mb-2">
                  {poi.profileImageUrl && (
                    <img 
                      src={poi.profileImageUrl} 
                      alt={poi.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-800">{poi.name}</h3>
                    <p className="text-xs text-gray-500">{poi.category}</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{poi.description}</p>
                
                {poi.averageRating && (
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm font-medium">{poi.averageRating.toFixed(1)}</span>
                  </div>
                )}
                
                {poi.cost && (
                  <p className="text-sm font-semibold text-primary mb-2">
                    {poi.cost} FCFA
                    {poi.negotiable && <span className="text-xs text-gray-500 ml-1">(négociable)</span>}
                  </p>
                )}
                
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleRouteToPoI(poi)}
                    className="flex-1 bg-primary text-white text-xs py-1.5 px-3 rounded-md hover:bg-primary/90"
                  >
                    Itinéraire
                  </button>
                  <button
                    onClick={() => onPoiClick && onPoiClick(poi)}
                    className="flex-1 bg-gray-100 text-gray-700 text-xs py-1.5 px-3 rounded-md hover:bg-gray-200"
                  >
                    Voir profil
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Position utilisateur */}
        {userPosition && showUserPosition && (
          <>
            <Marker
              position={userPosition}
              icon={createUserIcon()}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-semibold">📍 Votre position</p>
                </div>
              </Popup>
            </Marker>
            <Circle
              center={userPosition}
              radius={100}
              pathOptions={{
                color: '#ef4444',
                fillColor: '#ef4444',
                fillOpacity: 0.1
              }}
            />
          </>
        )}

        {/* Position mise en évidence */}
        {highlightedPosition && (
          <Marker
            position={highlightedPosition}
            icon={createCustomIcon('destination')}
          >
            <Popup>
              <p className="font-semibold">Position sélectionnée</p>
            </Popup>
          </Marker>
        )}

        {/* Itinéraire */}
        {routeCoords && routeCoords.length > 0 && (
          <Polyline
            positions={routeCoords}
            pathOptions={{
              color: '#3b82f6',
              weight: 5,
              opacity: 0.8
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default NavigooMap;
