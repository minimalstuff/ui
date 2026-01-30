import react from '@vitejs/plugin-react-swc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const dirname =
	typeof __dirname !== 'undefined'
		? __dirname
		: path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'#types/theme': path.resolve(dirname, 'src/types/theme.ts'),
		},
	},
	test: {
		include: ['src/**/*.test.{ts,tsx}'],
		environment: 'happy-dom',
		globals: true,
		setupFiles: ['./vitest.setup.ci.ts'],
	},
});
