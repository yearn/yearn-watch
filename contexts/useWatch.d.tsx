import {BigNumber} from 'ethers';
import {utils} from '@yearn-finance/web-lib';

export type TRowHead = {
	sortBy: string,
	set_sortBy: React.Dispatch<React.SetStateAction<string>>
};

export type	TAlertLevels = 'none' | 'info' | 'warning' | 'error' | 'critical';
export type TAlert = {
	level: TAlertLevels,
	message: string
}

export type TVaultWithRiskGroup = {
	address: string
	symbol: string
	display_symbol: string
	formated_symbol: string
	name: string
	display_name: string
	formated_name: string
	icon: string
	version: string
	type: string
	inception: number
	decimals: number
	updated: number
	endorsed: boolean
	emergency_shutdown: boolean
	token: {
		address: string
		name: string
		display_name: string
		symbol: string
		description: string
		decimals: number
		icon: string
	}
	tvl: {
		total_assets: string
		total_delegated_assets: string
		tvl_deposited: number
		tvl_delegated: number
		tvl: number
		price: number
	}
	apy: {
		type: string
		gross_apr: number
		net_apy: number
		fees: {
			performance: number
			withdrawal: number
			management: number
			keep_crv: number
			cvx_keep_crv: number
		}
		points: {
			week_ago: number
			month_ago: number
			inception: number
		}
		composite: {
			boost: number
			pool_apy: number
			boosted_apr: number
			base_apr: number
			cvx_apr: number
			rewards_apr: number
		}
	}
	strategies: {
		address: string
		name: string
		description: string
		risk: {
			riskGroup: string
			TVLImpact: number
			auditScore: number
			codeReviewScore: number
			complexityScore: number
			longevityImpact: number
			protocolSafetyScore: number
			teamKnowledgeScore: number
			testingScore: number
			allocation: {
				currentTVL: string
				availableTVL: string
				currentAmount: string
				availableAmount: string
			}
		}
	}[]
	migration: {
		available: boolean
		address: string
	},
	details: {
		management: string
		governance: string
		guardian: string
		rewards: string
		depositLimit: string
		comment: string
		apyTypeOverride: string
		apyOverride: number
		performanceFee: number
		managementFee: number
		depositsDisabled: boolean
		withdrawalsDisabled: boolean
		allowZapIn: boolean
		allowZapOut: boolean
		retired: boolean
	}
}

export type TRiskGroup = {
	id: string,
	network: number,
	label: string,
	urlParams: string,
	totalDebtRatio: number,
	tvl: number, //TVL Impact
	tvlImpact: number, //TVL Score
	auditScore: number, //Audit Score
	codeReviewScore: number, //Code Review Score
	testingScore: number, //Testing Score
	protocolSafetyScore: number, //Protocol Safety Score
	complexityScore: number, //Complexity Score
	teamKnowledgeScore: number, //Team Knowledge Score
	longevityScore: number, //Longevity Score
	oldestActivation: number,
	medianScore: number,
	impactScore: number,
	strategiesCount: number,
	criteria: {
		strategies: string[],
		exclude: string[]
	},
	strategies: TStrategy[]
}

export type TStrategyReport = {
	id: string;
	timestamp: string,
	debtLimit: string,
	debtPaid: string,
	debtAdded: string,
	totalDebt: string,
	totalLoss: string,
	totalGain: string,
	loss: string,
	gain: string,
	results: {
		APR: string,
		durationPR: string,
		duration: string,
	}[]
}

export type TStrategy = {
	address: utils.TAddress,
	name: string,
	description: string,
	details: {
		version: string
		keeper: string
		strategist: string
		rewards: string
		healthCheck: string
		totalDebt: string
		totalLoss: string
		totalGain: string
		rateLimit: string
		minDebtPerHarvest: string
		maxDebtPerHarvest: string
		estimatedTotalAssets: string
		creditAvailable: string
		debtOutstanding: string
		expectedReturn: string
		apr: number
		performanceFee: number
		lastReport: number
		activation: number
		keepCRV: number
		debtRatio: number
		debtLimit: number
		doHealthCheck: boolean
		inQueue: boolean
		emergencyExit: boolean
		isActive: boolean
		protocols: string[],
		//computed
		totalDebtUSDC: number,
		tvlImpact: number,
		withdrawalQueuePosition: number,
	}
	vault: {
		address: utils.TAddress,
		name: string,
		icon: string,
		underlyingTokenSymbol: string,
		decimals?: number,
		tokenPriceUSDC?: number,
	},
	alerts: TAlert[],
	alertHash: string,
}

export type TVault = {
	name: string, //From Yearn API or graph (shareToken.name)
	symbol: string, //From Yearn API or graph (shareToken.symbol)
	icon: string, //From Yearn API
	version: string, //From Yearn API == apiVersion
	type?: string, //From Yearn API
	alertHash: string, //computed from app logic
	inception: number, //From Yearn API == activation
	decimals: number, //From Yearn API
	emergency_shutdown: boolean, //From Yearn API
	isHidden: boolean,
	display_name: string,
	isEndorsed: boolean,
	address: utils.TAddress, //From Yearn API
	balanceTokens: BigNumber, //From the GraphQL schema
	totalSupply: BigNumber,
	alerts: TAlert[],
	tvl: {
		total_assets: string
		tvl: number,
		price: number,
	},
	migration: {
		available: boolean,
		address: utils.TAddress,
	},
	token: {
		name: string //From API
		symbol: string //From API & subgraph
		address: utils.TAddress //From API, match subgraph ID
		decimals: number //From API & subgraph
		icon: string //From API
	},
	details: {
		guardian: utils.TAddress,
		management: utils.TAddress,
		governance: utils.TAddress,
		rewards: utils.TAddress,
		depositLimit: string,
		availableDepositLimit: string,
		managementFee: number,
		performanceFee: number,
	},
	strategies: TStrategy[] //From API & subgraph & multicall
}

export type TVaultByChain = {
	vaults: TVault[],
	chainId: number,
	chainName: string
}


export type	TWatchContext = {
	vaults: TVault[],
	vaultsByChain: TVaultByChain[],
	lastUpdate: number,
	isUpdating: boolean,
	hasError: boolean,
}
