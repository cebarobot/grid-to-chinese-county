/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TILE_URLS?: string;
  readonly VITE_TILE_ATTRIBUTION?: string;
  readonly VITE_TILE_SUBDOMAINS?: string;
  readonly VITE_TILE_MAX_ZOOM?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
