/** @type {import('tailwindcss').Config} */
export default {
	content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {},
	},
	plugins: [
		require('@tailwindcss/forms')({
			strategy: 'class',
		}),
		require('@tailwindcss/typography'),
	],
}
