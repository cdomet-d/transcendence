import { defineConfig } from 'vite'

export default defineConfig({
	server: {
		port: 3000,
		hmr: true,
		watch: {
			usePolling: true,
		},
		proxy: {
			'/api': 'http://localhost:3000',  // Your backend URL
		}
	},
})
