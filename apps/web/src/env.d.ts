/// <reference types="vite/client" />

interface GridToChineseCountyTileLayerConfig {
  url: string;
  subdomains?: string | string[];
  attribution?: string;
  maxZoom: number;
}

interface GridToChineseCountyTileProviderConfig {
  layers: GridToChineseCountyTileLayerConfig[];
}

declare const __GRID_TO_CHINESE_COUNTY_TILE_PROVIDER_CONFIG__: GridToChineseCountyTileProviderConfig;
