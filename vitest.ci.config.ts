import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const dirname = import.meta.dirname;

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'#types/theme': path.resolve(dirname, 'src/types/theme.ts'),
		},
	},
	test: {
		include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.ts'],
		environment: 'happy-dom',
		globals: true,
		setupFiles: ['./vitest.setup.ci.ts'],
	},
});
