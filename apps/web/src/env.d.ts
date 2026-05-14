/// <reference types="vite/client" />

interface GridToXianTileLayerConfig {
  url: string;
  subdomains?: string | string[];
  attribution?: string;
  maxZoom: number;
}

interface GridToXianTileProviderConfig {
  layers: GridToXianTileLayerConfig[];
}

declare const __GRID_TO_XIAN_TILE_PROVIDER_CONFIG__: GridToXianTileProviderConfig;
