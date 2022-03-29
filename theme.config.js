/* eslint-disable @typescript-eslint/naming-convention */
const {ThemeManager, Theme} = require('tailwindcss-theming/api');

const base = new Theme()
	.setName('light')
	.targetable()
	.addColors({
		background: '#F4F7FB',
		backgroundVariant: '#E0EAFF',
		surface: '#FFFFFF',
		surfaceVariant: '#F9FBFD',
		primary: '#0657F9',
		primaryVariant: '#004ADF',
		secondary: '#E0EAFF',
		secondaryVariant: '#C6D7F9',
		disabled: '#CED5E3',
		dark: '#141414',
		alert: {
			warning: {
				primary: '#FF8A00',
				secondary: '#FFF9D9',
				secondaryVariant: '#FFF7CD'
			},
			error: {
				primary: '#E7007D',
				secondary: '#FFDCEF'
			},	
			critical: {
				primary: '#FF0000',
				secondary: '#FFDFDF'
			}
		},
		icons: {
			primary: '#CED5E3',
			variant: '#475570'
		},
		logo: {
			background: '#0657F9',
			fill: '#FFFFFF'
		},
		typo: {
			primary: '#001746',
			primaryVariant: '#0657F9',
			secondary: '#7F8DA9',
			secondaryVariant: '#475570',
			off: '#CED5E3'
		},
		button: {
			filled: {
				primary: '#0657F9',
				variant: '#004ADF',
				text: '#FFFFFF'
			},
			outlined: {
				primary: '#FFFFFF',
				variant: '#E0EAFF',
				text: '#0657F9'
			},
			disabled: {
				primary: '#F4F7FB',
				text: '#CED5E3'
			}
		}
	});

const dark = new Theme()
	.setName('dark')
	.targetable()
	.addColors({
		background: '#141414',
		backgroundVariant: '#272727',
		surface: '#000000',
		surfaceVariant: '#191919',
		primary: '#FFFFFF',
		primaryVariant: '#FFFFFF',
		secondary: '#272727',
		secondaryVariant: '#202020',
		disabled: '#A8A8A8',
		dark: '#141414',
		icons: {
			primary: '#A8A8A8',
			variant: '#FFFFFF'
		},
		logo: {
			background: '#FFFFFF',
			fill: '#000000'
		},
		typo: {
			primary: '#FFFFFF',
			primaryVariant: '#FFFFFF',
			secondary: '#A8A8A8',
			secondaryVariant: '#A8A8A8',
			off: '#A8A8A8'
		},
		button: {
			filled: {
				primary: '#0657F9',
				variant: '#004ADF',
				text: '#FFFFFF'
			},
			outlined: {
				primary: '#FFFFFF',
				variant: '#272727',
				text: '#FFFFFF'
			},
			disabled: {
				primary: '#141414',
				text: '#A8A8A8'
			}
		}
	});

module.exports = new ThemeManager()
	.setDefaultTheme(base)          // Sets the `base` theme as the default theme.
	.addTheme(dark);     // Sets the `dark` theme as the default theme for users that prefer the `dark` scheme.