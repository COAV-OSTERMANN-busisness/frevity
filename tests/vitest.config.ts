import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['unit/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@/lib/calculation': '../web/lib/calculation',
      '@/types': '../web/types',
    },
  },
});
