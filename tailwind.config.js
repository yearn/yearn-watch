/* eslint-disable @typescript-eslint/explicit-function-return-type */
module.exports = {
	presets: [
		require('@majorfi/web-lib/tailwind.config')
	],
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
		'./node_modules/@majorfi/web-lib/dist/**/*.js'
	],
	themes: {
		extend: {}
	},
	plugins: []
};