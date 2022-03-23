const DOTENV = require('dotenv-webpack');

module.exports = ({
	i18n: {
		locales: ['en', 'fr', 'es', 'de', 'pt', 'el', 'tr', 'vi', 'zh', 'hi', 'ja'],
		defaultLocale: 'en',
		localeDetection: false
	},
	experimental: {
		concurrentFeatures: true
	},
	plugins: [new DOTENV()],
	images: {
		domains: [
			'rawcdn.githack.com'
		]
	},
	env: {
		WEBSITE_URI: 'https://yearn-ui.major.tax/',
		WEBSITE_NAME: 'Watch',
		WEBSITE_TITLE: 'Watch',
		WEBSITE_DESCRIPTION: 'Template used for some Yearn\'s project',
		PROJECT_GITHUB_URL: 'https://github.com/Major-Eth/yUITemplate',
		USE_PRICES: true,
		USE_PRICE_TRI_CRYPTO: false,
		CG_IDS: ['ethereum', 'yearn-finance', 'dai', 'usd-coin', 'tether', 'wrapped-bitcoin', 'chainlink', 'uniswap', 'nusd', 'rai', 'havven'],
		TOKENS: [
			//underlying Tokens
			['0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e', 18, 1],
			['0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 1],
			['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 1],
			['0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 1],
			['0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 1],
			['0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 1],
			['0x57Ab1ec28D129707052df4dF418D58a2D46d5f51', 18, 1],
			['0x514910771AF9Ca656af840dff83E8264EcF986CA', 18, 1],
			['0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F', 18, 1],
			['0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', 18, 1],
			['0x03ab458634910aad20ef5f1c8ee96f1d6ac54919', 18, 1],

			//aToken V1
			['0xfC1E690f61EFd961294b3e1Ce3313fBD8aa4f85d', 18, 1],
			['0x9bA00D6856a4eDF4665BcA2C2309936572473B7E', 6, 1],
			['0x71fc860F7D3A592A4a98740e39dB31d25db65ae8', 6, 1],
			['0x3a3A65aAb0dd2A17E3F1947bA16138cd37d08c04', 18, 1],
			['0xFC4B8ED459e00e5400be803A9BB3954234FD50e3', 8, 1],
			['0x625aE63000f46200499120B906716420bd059240', 18, 1],
			['0xA64BD6C70Cb9051F6A9ba1F163Fdc07E0DfB5F84', 18, 1],
			['0x328C4c80BC7aCa0834Db37e6600A6c49E12Da4DE', 18, 1],
			['0xB124541127A0A657f056D9Dd06188c4F1b0e5aab', 18, 1],
			['0x12e51E77DAAA58aA0E9247db7510Ea4B46F9bEAd', 18, 1],

			//aToken V2
			['0x028171bca77440897b824ca71d1c56cac55b68a3', 18, 1],
			['0xBcca60bB61934080951369a648Fb03DF4F96263C', 6, 1],
			['0x3Ed3B47Dd13EC9a98b44e6204A523E766B225811', 6, 1],
			['0x030bA81f1c18d280636F32af80b9AAd02Cf0854e', 18, 1],
			['0x9ff58f4fFB29fA2266Ab25e75e2A8b3503311656', 8, 1],
			['0x6C5024Cd4F8A59110119C56f8933403A539555EB', 18, 1],
			['0xa06bC25B5805d5F8d82847D191Cb4Af5A3e873E0', 18, 1],
			['0xc9BC48c72154ef3e5425641a3c747242112a46AF', 18, 1],
			['0x35f6B052C598d933D69A4EEC4D04c73A191fE6c2', 18, 1],
			['0xB9D7CB55f463405CDfBe4E90a6D2Df01C2B92BF1', 18, 1],
			['0x5165d24277cD063F5ac44Efd447B27025e888f37', 18, 1],

			//compound
			['0x5d3a536e4d6dbd6114cc1ead35777bab948e3643', 18, 1],
			['0x39aa39c021dfbae8fac545936693ac917d5e7563', 0, 1],
			['0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9', 6, 1],
			['0xc11b1268c1a384e55c48c2391d8d480264a3a7f4', 8, 1],
			['0xccf4429db6322d5c611ee964527d42e5d685dd6a', 8, 1],
			['0xface851a4921ce59e912d19329929ce6da6eb0c7', 18, 1],
			['0x35a18000230da775cac24873d00ff85bccded550', 18, 1],
			['0x80a2ae356fc9ef4305676f7a3e2ed04e12c33946', 18, 1]
			
		],
		KNOWN_ENS: {
			'0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52': 'ychad.eth',
			'0x846e211e8ba920B353FB717631C015cf04061Cc9': 'dev.ychad.eth'
		},
		ALCHEMY_KEY: process.env.ALCHEMY_KEY
	}
});
