import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { ParsedLocator } from '@grid-to-xian/core/browser';
import { onBeforeUnmount, type Ref } from 'vue';
import type { MatchedCountyFeature } from '../services/countyData';
import { createTiandituLayers } from '../services/tileProvider';

const DEFAULT_CENTER: L.LatLngExpression = [35.8617, 104.1954];
const DEFAULT_ZOOM = 4;

function toLatLngPairs(coordinates: [number, number][]): L.LatLngExpression[] {
  return coordinates.map(([lon, lat]) => [lat, lon]);
}

export function useLeafletMap(containerRef: Ref<HTMLElement | null>) {
  let map: L.Map | null = null;
  let overlayGroup: L.FeatureGroup | null = null;

  function ensureMap(): void {
    if (map !== null || containerRef.value === null) {
      return;
    }

    map = L.map(containerRef.value, {
      zoomControl: true,
      attributionControl: true
    });
    map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    map.attributionControl.setPrefix('');

    for (const tileLayer of createTiandituLayers()) {
      tileLayer.addTo(map);
    }

    overlayGroup = L.featureGroup().addTo(map);
  }

  function renderOverlays(parsedLocator: ParsedLocator | null, matchedFeatures: MatchedCountyFeature[]): void {
    ensureMap();

    if (map === null || overlayGroup === null) {
      return;
    }

    overlayGroup.clearLayers();

    if (parsedLocator !== null) {
      overlayGroup.addLayer(
        L.polygon(toLatLngPairs(parsedLocator.polygon.coordinates), {
          color: '#e85d04',
          weight: 2,
          dashArray: '8 6',
          fillColor: '#ffba08',
          fillOpacity: 0.08
        })
      );
    }

    for (const feature of matchedFeatures) {
      overlayGroup.addLayer(
        L.geoJSON(feature, {
          style: {
            color: '#0f766e',
            weight: 2,
            fillColor: '#2dd4bf',
            fillOpacity: 0.18
          }
        })
      );
    }

    if (overlayGroup.getLayers().length > 0) {
      map.fitBounds(overlayGroup.getBounds().pad(0.12), {
        maxZoom: 11
      });
    }
  }

  onBeforeUnmount(() => {
    if (map !== null) {
      map.remove();
    }
  });

  return {
    renderOverlays
  };
}
