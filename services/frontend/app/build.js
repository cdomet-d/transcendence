import esbuild from 'esbuild'
import tailwindPlugin from 'esbuild-plugin-tailwindcss';

const { context } = esbuild;

const args = process.argv.slice(2)
const isWatch = args.includes('--watch')

async function make() {
	const cliCtx = await context({
		entryPoints: ['src/client/main.ts'],
		bundle: true,
		outfile: 'dist/client/bundle.js',
		minify: true,
		platform: 'browser',
		assetNames: 'assets/[name]-[hash]',
		target: ['esnext'],
		loader: {
			'.png': 'dataurl',
			'.gif': 'dataurl',
			'.woff': 'file',
		},
		plugins: [
			tailwindPlugin()],
		define: {
			'API_URL': JSON.stringify(process.env.HOST),
		}
	})

	const servCtx = await context({
		entryPoints: ['src/server/server.ts'],
		bundle: true,
		outdir: 'dist/server',
		minify: true,
		platform: 'node',
		target: ['node20'],
		packages: 'external',
		format: 'esm',
		define: {
			'API_URL': JSON.stringify(process.env.HOST),
		}
	})
	if (isWatch) {
		console.log('Watching for changes...')
		Promise.all([cliCtx.watch(), servCtx.watch()])
	} else {
		cliCtx.rebuild();
		cliCtx.dispose();
		servCtx.rebuild();
		servCtx.dispose();
		console.log('Done!')
	}
}

make().catch(() => process.exit(1));