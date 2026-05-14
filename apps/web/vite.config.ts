import { fileURLToPath } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite';

const webRoot = fileURLToPath(new URL('.', import.meta.url));

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'grid-to-chinese-county';

const DEFAULT_TILE_URLS = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const DEFAULT_TILE_SUBDOMAINS = 'abc';
const DEFAULT_TILE_ATTRIBUTION = '&copy; OpenStreetMap contributors';
const DEFAULT_MAX_ZOOM = '19';

interface TileLayerBuildConfig {
  url: string;
  subdomains?: string | string[];
  attribution?: string;
  maxZoom: number;
}

interface TileProviderBuildConfig {
  layers: TileLayerBuildConfig[];
}

function readEnvValue(value: string | undefined): string | null {
  const trimmed = value?.trim();

  return trimmed === undefined || trimmed.length === 0 ? null : trimmed;
}

function parseTileUrls(value: string | undefined): string[] {
  return (readEnvValue(value) ?? DEFAULT_TILE_URLS)
    .split(/\r?\n|;/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function parseTileSubdomains(value: string | undefined): string | string[] {
  return readEnvValue(value) ?? DEFAULT_TILE_SUBDOMAINS;
}

function parseTileAttribution(value: string | undefined): string {
  return readEnvValue(value) ?? DEFAULT_TILE_ATTRIBUTION;
}

function parseTileMaxZoom(value: string | undefined): number {
  return Number.parseInt(readEnvValue(value) ?? DEFAULT_MAX_ZOOM, 10);
}

function buildTileProviderConfig(env: Record<string, string | undefined>): TileProviderBuildConfig {
  const tileUrls = parseTileUrls(env.VITE_TILE_URLS);
  const subdomains = parseTileSubdomains(env.VITE_TILE_SUBDOMAINS);
  const attribution = parseTileAttribution(env.VITE_TILE_ATTRIBUTION);
  const maxZoom = parseTileMaxZoom(env.VITE_TILE_MAX_ZOOM);

  return {
    layers: tileUrls.map((url, index) => ({
      url,
      ...({ subdomains }),
      ...(index === 0 ? { attribution } : {}),
      maxZoom
    }))
  };
}

export default defineConfig(({ mode }) => {
  const env = {
    ...loadEnv(mode, webRoot, ''),
    ...process.env
  };

  return {
    base: process.env.GITHUB_ACTIONS ? `/${repositoryName}/` : '/',
    define: {
      __GRID_TO_XIAN_TILE_PROVIDER_CONFIG__: JSON.stringify(buildTileProviderConfig(env))
    },
    plugins: [vue()],
    resolve: {
      alias: {
        '@grid-to-chinese-county/core/browser': fileURLToPath(new URL('../../packages/core/src/browser.ts', import.meta.url)),
        '@grid-to-chinese-county/shared-types': fileURLToPath(
          new URL('../../packages/shared-types/src/index.ts', import.meta.url)
        )
      }
    }
  };
});
