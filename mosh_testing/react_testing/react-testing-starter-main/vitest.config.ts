import { defineConfig } from "vitest/config";

const config = defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ["tests/setup.ts"]
  }
});

export default config;