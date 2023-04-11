import preprocess from 'svelte-preprocess';
//import adapter from '@sveltejs/adapter-auto';
import node_adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: node_adapter({
			out: 'dist',
		})
	},

	preprocess: [
		preprocess({
			postcss: true
		})
	]
};

export default config;
