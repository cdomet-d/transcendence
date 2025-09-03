import { resolve } from 'node:path'
import viteFastify from '@fastify/vite/plugin'

export default {
  root: resolve(import.meta.dirname, 'static'),
  plugins: [
    viteFastify(),
  ],
}
