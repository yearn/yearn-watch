import {BigNumber} from 'ethers';
import {utils} from '@majorfi/web-lib';

export type TAlert = {
	level: 'warning' | 'error' | 'critical',
	message: string
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
    name: string, //From Yearn API
    display_name: string, //From Yearn API
	symbol: string, //From Yearn API
    icon: string, //From Yearn API
    version: string, //From Yearn API
    type: string, //From Yearn API
	explorer: string,
	alertHash: string,
	tokenPriceUSDC: number, //From multicall
	inception: number, //From Yearn API
	decimals: number, //From Yearn API
	updated: number, //From Yearn API
	endorsed: boolean, //From Yearn API
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
        name: string
        symbol: string
        address: utils.TAddress
        decimals: number
        display_name: string
        icon: string
    },
	tvl: {
		total_assets: number,
		price: number,
		tvl: number,
	},
	apy: {
		type: string,
        gross_apr: number | null,
        net_apy: number | null,
        fees: {
            performance: number | null,
            withdrawal: number | null,
            management: number | null,
            keep_crv: number | null,
            cvx_keep_crv: number | null
        },
        points: {
            week_ago: number | null,
            month_ago: number | null,
            inception: number | null
        },
        composite: number | null
	},
	strategies: TStrategy[]
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