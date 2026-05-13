import L from 'leaflet';

const DEFAULT_TILE_URLS = ['https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'];
const OSM_ATTRIBUTION = '&copy; OpenStreetMap contributors';
const DEFAULT_MAX_ZOOM = 19;

export interface TileProviderState {
  warning: string | null;
  layers: L.TileLayer[];
}

function readEnvValue(value: string | undefined): string | null {
  const trimmed = value?.trim();

  return trimmed === undefined || trimmed.length === 0 ? null : trimmed;
}

function getTileUrls(): string[] {
  const rawUrls = readEnvValue(import.meta.env.VITE_TILE_URLS);

  if (rawUrls === null) {
    return DEFAULT_TILE_URLS;
  }

  const urls = rawUrls
    .split(/\r?\n|;/)
    .map((value) => value.trim())
    .filter((value) => value.length > 0);

  return urls.length === 0 ? DEFAULT_TILE_URLS : urls;
}

function getTileAttribution(): string {
  return readEnvValue(import.meta.env.VITE_TILE_ATTRIBUTION) ?? OSM_ATTRIBUTION;
}

function getTileSubdomains(): string[] | undefined {
  const subdomains = readEnvValue(import.meta.env.VITE_TILE_SUBDOMAINS)
    ?.split(',')
    .map((value) => value.trim())
    .filter((value) => value.length > 0);

  return subdomains === undefined || subdomains.length === 0 ? undefined : subdomains;
}

function getTileMaxZoom(): number {
  const rawMaxZoom = readEnvValue(import.meta.env.VITE_TILE_MAX_ZOOM);

  if (rawMaxZoom === null) {
    return DEFAULT_MAX_ZOOM;
  }

  const maxZoom = Number.parseInt(rawMaxZoom, 10);

  return Number.isNaN(maxZoom) ? DEFAULT_MAX_ZOOM : maxZoom;
}

export function getTileProviderState(): TileProviderState {
  const tileUrls = getTileUrls();
  const attribution = getTileAttribution();
  const subdomains = getTileSubdomains();
  const maxZoom = getTileMaxZoom();

  return {
    warning: null,
    layers: tileUrls.map((url, index) =>
      L.tileLayer(url, {
        maxZoom,
        subdomains,
        attribution: index === 0 ? attribution : undefined
      })
    )
  };
}

export function getTileProviderWarning(): string | null {
  return getTileProviderState().warning;
}

export function createTileLayers(): L.TileLayer[] {
  return getTileProviderState().layers;
}
