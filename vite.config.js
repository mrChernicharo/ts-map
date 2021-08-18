import { resolve } from 'path';
import { defineConfig } from 'vite';

module.exports = defineConfig({
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				src: resolve(__dirname, 'src/index.html'),
			},
		},
	},
});
