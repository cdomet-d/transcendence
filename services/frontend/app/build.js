import esbuild from 'esbuild'
const { context } = esbuild;

const args = process.argv.slice(2)
const isWatch = args.includes('--watch')

async function make() {
	const cliCtx = await context({
		entryPoints: ['src/client/main.ts'],
		bundle: true,
		outfile: 'dist/client/bundle.js',
		minify: true,
		sourcemap: true,
		platform: 'browser',
		target: ['esnext'],
		define: {
			'process.env.HOST': process.env.HOST,
		}
	})

	const servCtx = await context({
		entryPoints: ['src/server/server.ts'],
		bundle: true,
		outdir: 'dist/server',
		minify: true,
		sourcemap: true,
		platform: 'node',
		target: ['node20'],
		packages: 'external',
		format: 'esm', 
		define: {
			'process.env.HOST': process.env.HOST,
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