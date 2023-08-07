/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import manifest from "./manifest.json";
import { crx } from "@crxjs/vite-plugin";




// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
  test: {
    browser: {
      enabled: true,
      name: 'chrome',
    },
  },
  define: {
    global: {},
  },
});
