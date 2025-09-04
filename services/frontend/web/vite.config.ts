import viteFastify from '@fastify/vite/plugin'

export default {
  root: "./src/client",
  plugins: [
    viteFastify(),
  ],
}
