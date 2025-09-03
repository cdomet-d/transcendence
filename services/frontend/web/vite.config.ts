import viteFastify from '@fastify/vite/plugin'

export default {
  root: "/app/static",
  plugins: [
    viteFastify(),
  ],
  build: {
    rollupOptions: {
      input: {
        main: "/app/static/index.html",
        nested: "/app/src/client/main.ts"
      }
    },
    outDir: '/app/dist/client',
  },
}
