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
		nameLike: string[],
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
		//TODO: missing
		index: number,
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

export type	TWatchContext = {
	vaults: TVault[],
	lastUpdate: number,
	isUpdating: boolean,
	hasError: boolean,
}
