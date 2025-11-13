import viteFastify from '@fastify/vite/plugin'
import tailwindcss from '@tailwindcss/vite'

export default {
  root: "./src/client",
  plugins: [
    viteFastify(),
    tailwindcss(),
  ],
}
