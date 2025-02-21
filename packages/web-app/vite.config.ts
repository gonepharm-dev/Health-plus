import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	server: {
		fs: {
		  allow: [
			';Health-plus/packages/web-app',
			'/Users/Mikemax/dev/Health-plus/node_modules',
		  ],
		},
	  },
});
