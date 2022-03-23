/* eslint-disable @typescript-eslint/explicit-function-return-type */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	corePlugins: {
		ringColor: false
	},
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
		'./lib/**/*.{js,ts,jsx,tsx}'
	],
	variants: {
		textColor: ['hover', 'dark', 'light'],
		backgroundColor: ['hover', 'dark', 'light']
	},
	theme: {
		extend: {
			fontFamily: {
				roboto: ['Roboto', ...defaultTheme.fontFamily.sans],
				mono: ['Roboto Mono', ...defaultTheme.fontFamily.mono]
			},
			width: {
				30: '7.5rem',
				33: '8.25rem',
				38: '9.5rem',
				42: '10.5rem',
				50: '12.5rem',
				55: '13.75rem'
			},
			height: {
				22: '5.5rem',
				30: '7.5rem'
			},
			maxWidth: {
				'xl': '552px',
				'4xl': '904px',
				'6xl': '1200px'
			},
			fontSize: {
				'xs': ['12px', '16px'],
				'sm': ['14px', '20px'],
				'base': ['16px', '24px'],
				'lg': ['20px', '32px'],
				'xl': ['24px', '32px'],
				'4xl': ['40px', '56px']
			},
			colors: {
				'white': '#FFFFFF',
				'transparent': 'transparent',
				'inherit': 'inherit'
			}
		}
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('@tailwindcss/forms'),
		require('@tailwindcss/line-clamp'),
		require('tailwindcss-theming')
	]
};