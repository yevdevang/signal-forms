import { defineConfig } from 'vitest/config';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Custom Vitest configuration for Angular project.
 * 
 * NOTE: Angular CLI will override certain properties (test.projects, test.include)
 * to ensure proper operation. This config only adds custom settings.
 * 
 * Reference: https://angular.dev/guide/testing/migrating-to-vitest#
 */
export default defineConfig({
  test: {
    // setupFiles is handled by Angular CLI automatically
    // include is overridden by Angular CLI
    // environment defaults to 'jsdom' (or 'happy-dom' if installed)
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/**/*.spec.ts',
        'src/**/*.config.ts',
        'src/main.ts',
        'src/test.setup.ts'
      ]
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
});

