const withPWA = require('next-pwa');

module.exports = withPWA({
	images: {
		domains: [
			'rawcdn.githack.com',
			'raw.githubusercontent.com'
		]
	},
	pwa: {
		dest: 'public',
		register: true,
		skipWaiting: true,
		disable: process.env.NODE_ENV === 'development'
	},
	env: {				
		/* 🔵 - Yearn Finance **************************************************
		** Config over the RPC
		**********************************************************************/
		WEB_SOCKET_URL: {
			1: process.env.WS_URL_MAINNET,
			250: process.env.WS_URL_FANTOM,
			42161: process.env.WS_URL_ARBITRUM
		},
		JSON_RPC_URL: {
			1: process.env.RPC_URL_MAINNET,
			250: process.env.RPC_URL_FANTOM,
			42161: process.env.RPC_URL_ARBITRUM
		},
		ALCHEMY_KEY: process.env.ALCHEMY_KEY,
		INFURA_KEY: process.env.INFURA_KEY,

		/* 🔵 - Yearn Finance **************************************************
		** Yearn Watch specific config
		**********************************************************************/
		KNOWN_ENS: {
			'0xFEB4acf3df3cDEA7399794D0869ef76A6EfAff52': 'ychad.eth',
			'0x846e211e8ba920B353FB717631C015cf04061Cc9': 'dev.ychad.eth'
		},
		RISK_GH_URL: 'https://raw.githubusercontent.com/yearn/yearn-data-analytics/master/src/risk_framework/risks.json',
		RISK_API_URL: 'https://d3971bp2359cnv.cloudfront.net/api',
		GRAPH_URL: {
			1: 'https://api.thegraph.com/subgraphs/name/rareweasel/yearn-vaults-v2-subgraph-mainnet',
			250: 'https://api.thegraph.com/subgraphs/name/bsamuels453/yearn-fantom-validation-grafted',
			42161: 'https://api.thegraph.com/subgraphs/name/yearn/yearn-vaults-v2-arbitrum'
		}
	}
});
