import { fileURLToPath } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? 'grid-to-xian';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? `/${repositoryName}/` : '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@grid-to-xian/core/browser': fileURLToPath(new URL('../../packages/core/src/browser.ts', import.meta.url)),
      '@grid-to-xian/shared-types': fileURLToPath(
        new URL('../../packages/shared-types/src/index.ts', import.meta.url)
      )
    }
  }
});
