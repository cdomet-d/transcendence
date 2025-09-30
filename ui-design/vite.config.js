import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  server: {
    port: 3000, // Or any port you prefer
    cors: true, // Enable CORS for all origins (for development only)
    open: true, // Automatically open browser on start (optional)
  }
});
