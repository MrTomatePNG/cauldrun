import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    hmr: {
      clientPort: 8080,
    },
  },
  appType: "custom",
  plugins: [sveltekit()],
  ssr: {
    external: [
      "fluent-ffmpeg",
      "sharp",
      "pino",
      "bullmq",
      "ioredis",
      "@prisma/client",
    ],
  },
  optimizeDeps: {
    exclude: ["fluent-ffmpeg", "sharp"],
  },
  build: {
    sourcemap: false,
    reportCompressedSize: false,
  },
});
