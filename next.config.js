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
		WEBSITE_URI: 'https://watch.major.tax/',
		WEBSITE_NAME: 'Yearn Watch',
		WEBSITE_TITLE: 'Yearn Watch',
		WEBSITE_DESCRIPTION: 'All the analytics for your Vaults',
		PROJECT_GITHUB_URL: 'https://github.com/Major-Eth/yearn-watch',
		USE_PRICES: false,
		USE_PRICE_TRI_CRYPTO: false,
		CG_IDS: [],
		TOKENS: [],
		KNOWN_ENS: {
			'0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52': 'ychad.eth',
			'0x846e211e8ba920B353FB717631C015cf04061Cc9': 'dev.ychad.eth'
		},
		ALCHEMY_KEY: process.env.ALCHEMY_KEY,
		GRAPH_URL_PROD: {
			1: `https://gateway.thegraph.com/api/${process.env.GRAPH_API_KEY}/subgraphs/id/5xMSe3wTNLgFQqsAc5SCVVwT4MiRb5AogJCuSN9PjzXF`,
			250: 'https://api.thegraph.com/subgraphs/name/yearn/yearn-vaults-v2-fantom',
			42161: 'https://api.thegraph.com/subgraphs/name/yearn/yearn-vaults-v2-arbitrum'
		},
		GRAPH_URL: {
			1: 'https://api.thegraph.com/subgraphs/name/salazarguille/yearn-vaults-v2-subgraph-mainnet',
			// 250: 'https://api.thegraph.com/subgraphs/name/yearn/yearn-vaults-v2-fantom',
			250: 'https://api.thegraph.com/subgraphs/name/bsamuels453/yearn-fantom-validation-grafted',
			42161: 'https://api.thegraph.com/subgraphs/name/yearn/yearn-vaults-v2-arbitrum'
		},
		RPC_URL: {
			1: process.env.RPC_URL_MAINNET,
			250: 'https://rpc.ftm.tools',
			42161: 'https://arbitrum.public-rpc.com'
		}
	}
});
