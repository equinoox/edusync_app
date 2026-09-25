import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    // Testovi su integracioni - rade nad pravom bazom podataka navedenom u
    // DATABASE_URL (isto okruženje koje koristi `pnpm dev`), pa im je
    // potrebno malo više vremena nego čisto memorijskim jedinicnim testovima.
    testTimeout: 15000,
    hookTimeout: 15000,
  },
});
