import {BigNumber} from 'ethers';
import {utils} from '@majorfi/web-lib';

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
	apr: number,
	durationPR: number,
	duration: string,
	debtLimit: BigNumber,
	debtPaid: BigNumber,
	debtAdded: BigNumber,
	totalDebt: BigNumber,
	totalLoss: BigNumber,
	totalGain: BigNumber,
	loss: BigNumber,
	gain: BigNumber
}
export type TStrategy = {
	name: string,
	display_name: string,
	description: string,
	activation: string,
	apiVersion: string,
	protocols: string[],
	alertHash: string,
	index?: number,
	apr?: number,
	totalDebtUSDC: number,
	tvlImpact: number,
	isEmergencyExit: boolean,
	isActive: boolean,
	isHidden: boolean,
	shouldDoHealthCheck: boolean,
	address: utils.TAddress,
	addrHealthCheck: utils.TAddress,
	addrKeeper: utils.TAddress,
	addrStrategist: utils.TAddress,
	addrRewards: utils.TAddress,
	performanceFee: BigNumber,
	debtRatio: BigNumber,
	minDebtPerHarvest: BigNumber,
	maxDebtPerHarvest: BigNumber,
	lastReport: BigNumber,
	totalDebt: BigNumber,
	totalGain: BigNumber,
	totalLoss: BigNumber,
	estimatedTotalAssets: BigNumber,
	creditAvailable: BigNumber,
	debtOutstanding: BigNumber,
	expectedReturn: BigNumber,
	reports: TStrategyReport[],
	alerts: TAlert[],
	vault: {
		address: utils.TAddress,
		name: string,
		explorer: string,
		icon: string,
		decimals?: number,
		tokenPriceUSDC?: number,
	},
	details?: {
		debtPaid: string,
		gain: string,
		loss: string,
		timestamp: string,
		totalDebt: string,
		totalGain: string,
		totalLoss: string,
		results: {
			apr: string
		}[],
	}
}

export type TVault = {
	id?: string, //From subgraph = address
	name: string, //From Yearn API or graph (shareToken.name)
	display_name: string, //From Yearn API
	symbol: string, //From Yearn API or graph (shareToken.symbol)
	icon: string, //From Yearn API
	version: string, //From Yearn API == apiVersion
	apiVersion?: string, //Same but from Graph == version
	type?: string, //From Yearn API
	explorer: string, //from chainID (aka computed)
	alertHash: string, //computed from app logic
	tokenPriceUSDC: number, //From multicall
	inception?: number, //From Yearn API == activation
	activation?: number, //From Graph == inception
	decimals: number, //From Yearn API
	emergency_shutdown: boolean, //From Yearn API
	isHidden: boolean,
	address: utils.TAddress, //From Yearn API
	guardian: utils.TAddress, //From multicall
	management: utils.TAddress, //From multicall
	governance: utils.TAddress, //From multicall
	rewards: utils.TAddress, //From multicall
	balanceTokens: BigNumber, //From the GraphQL schema
	tokensDepositLimit: BigNumber, //From the GraphQL schema
	managementFeeBps: BigNumber, //From the GraphQL schema
	performanceFeeBps: BigNumber, //From the GraphQL schema
	totalSupply: BigNumber,
	depositLimit: BigNumber, //From multicall
	availableDepositLimit: BigNumber, //From multicall
	alerts: TAlert[],
	token: {
		id?: string, //From subgraph = address
		name: string //From API & subgraph
		symbol: string //From API & subgraph
		address: utils.TAddress //From API, match subgraph ID
		decimals: number //From API & subgraph
		display_name: string //From API
		icon: string //From API
	},
	shareToken?: { //From Graph
		decimals: number //subgraph
		id: string, //From subgraph = address
		name: string //subgraph
		symbol: string //subgraph
	},
	tvl?: { //From API
		total_assets: number, //From API
		price: number, //From API
		tvl: number, //From API
	},
	apy?: { //From API
		type: string, //From API
		gross_apr: number | null, //From API
		net_apy: number | null, //From API
		fees: { //From API
			performance: number | null, //From API
			withdrawal: number | null, //From API
			management: number | null, //From API
			keep_crv: number | null, //From API
			cvx_keep_crv: number | null //From API
		},
		points: { //From API
			week_ago: number | null, //From API
			month_ago: number | null, //From API
			inception: number | null //From API
		},
		composite: number | null //From API
	},
	strategies: TStrategy[] //From API & subgraph & multicall
}

export type	TNetworkData = {
	status: {
		rpc: number,
		graph: number,
		yearnApi: number,
		yearnMeta: number
	},
	blockNumber: number,
	graphBlockNumber: number,
	hasGraphIndexingErrors: boolean
}

export type	TWatchContext = {
	vaults: TVault[],
	lastUpdate: number,
	isUpdating: boolean,
	network: TNetworkData,
	update: () => void
}
