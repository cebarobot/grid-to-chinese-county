import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@grid-to-xian/core': fileURLToPath(new URL('./packages/core/src/index.ts', import.meta.url)),
      '@grid-to-xian/shared-types': fileURLToPath(new URL('./packages/shared-types/src/index.ts', import.meta.url))
    }
  },
  test: {
    include: ['tests/**/*.spec.ts']
  }
});
