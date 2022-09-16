/** @type {import('tailwindcss').Config} */

import typography from '@tailwindcss/typography';
import lineClamp from '@tailwindcss/line-clamp';

export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		container: {
			padding: {
				DEFAULT: '1rem',
			},
			center: true
		},
	},
	plugins: [typography(), lineClamp],
}
