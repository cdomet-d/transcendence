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
		target: ['esnext'],
		loader: {
			'.png': 'file',
			'.gif': 'file',
			'.woff': 'file',
		},
		plugins: [tailwindPlugin()],
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

// "copy:assets": "mkdir -p dist/client/ && cp -r src/client/assets dist/client && npm run copy:html",
// "build:css": "postcss ./src/client/css/tailwind.css -o ./dist/client/css/output.css",
// "build": "node build.js && npm run build:css && npm run copy:assets"
// && npm run build:css && npm run copy:assets