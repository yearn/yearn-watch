const	VAULT_ABI_V02X = [
	//creditAvailable
	{'constant':true, 'inputs':[{'name':'_strategy', 'type':'address'}], 'name':'creditAvailable', 'outputs':[{'name':'amount', 'type':'uint256'}], 'payable':false, 'stateMutability':'view', 'type':'function'},
	
	//strategies
	{'name':'strategies', 'outputs':[{'type':'uint256', 'name':'performanceFee'}, {'type':'uint256', 'name':'activation'}, {'type':'uint256', 'name':'debtRatio'}, {'type':'uint256', 'name':'rateLimit'}, {'type':'uint256', 'name':'lastReport'}, {'type':'uint256', 'name':'totalDebt'}, {'type':'uint256', 'name':'totalGain'}, {'type':'uint256', 'name':'totalLoss'}], 'inputs':[{'type':'address', 'name':'arg0'}], 'stateMutability':'view', 'type':'function'},

	//withdrawalQueue - expectedReturn
	{'constant':true, 'inputs':[{'name':'index', 'type':'uint256'}], 'name':'withdrawalQueue', 'outputs':[{'name':'_strategy', 'type':'address'}], 'payable':false, 'stateMutability':'view', 'type':'function'},
	{'constant':true, 'inputs':[{'name':'strategy', 'type':'address'}], 'name':'expectedReturn', 'outputs':[{'name':'amount', 'type':'uint256'}], 'payable':false, 'stateMutability':'view', 'type':'function'},

	//guardian - management - governance
	{'constant':true, 'inputs':[], 'name':'guardian', 'outputs':[{'name':'_guardian', 'type':'address'}], 'payable':false, 'stateMutability':'view', 'type':'function'},
	{'constant':true, 'inputs':[], 'name':'management', 'outputs':[{'name':'_management', 'type':'address'}], 'payable':false, 'stateMutability':'view', 'type':'function'},
	{'constant':true, 'inputs':[], 'name':'governance', 'outputs':[{'name':'_governance', 'type':'address'}], 'payable':false, 'stateMutability':'view', 'type':'function'},
	{'constant':true, 'inputs':[], 'name':'rewards', 'outputs':[{'name':'_rewards', 'type':'address'}], 'payable':false, 'stateMutability':'view', 'type':'function'},

	//availableDepositLimit - depositLimit - debtOutstanding
	{'constant':true, 'inputs':[], 'name':'availableDepositLimit', 'outputs':[{'name':'_limit', 'type':'uint256'}], 'payable':false, 'stateMutability':'view', 'type':'function'},
	{'constant':true, 'inputs':[], 'name':'depositLimit', 'outputs':[{'name':'_limit', 'type':'uint256'}], 'payable':false, 'stateMutability':'view', 'type':'function'},
	{'stateMutability':'view', 'type':'function', 'name':'debtOutstanding', 'inputs':[{'name':'strategy', 'type':'address'}], 'outputs':[{'name':'', 'type':'uint256'}]}
];

const	VAULT_ABI = [
	//creditAvailable
	{'constant':true, 'inputs':[{'name':'_strategy', 'type':'address'}], 'name':'creditAvailable', 'outputs':[{'name':'amount', 'type':'uint256'}], 'payable':false, 'stateMutability':'view', 'type':'function'},
	
	//strategies
	{'stateMutability':'view', 'type':'function', 'name':'strategies', 'inputs':[{'name':'arg0', 'type':'address'}], 'outputs':[{'name':'performanceFee', 'type':'uint256'}, {'name':'activation', 'type':'uint256'}, {'name':'debtRatio', 'type':'uint256'}, {'name':'minDebtPerHarvest', 'type':'uint256'}, {'name':'maxDebtPerHarvest', 'type':'uint256'}, {'name':'lastReport', 'type':'uint256'}, {'name':'totalDebt', 'type':'uint256'}, {'name':'totalGain', 'type':'uint256'}, {'name':'totalLoss', 'type':'uint256'}]},
	
	//withdrawalQueue - expectedReturn
	{'constant':true, 'inputs':[{'name':'index', 'type':'uint256'}], 'name':'withdrawalQueue', 'outputs':[{'name':'_strategy', 'type':'address'}], 'payable':false, 'stateMutability':'view', 'type':'function'},
	{'constant':true, 'inputs':[{'name':'strategy', 'type':'address'}], 'name':'expectedReturn', 'outputs':[{'name':'amount', 'type':'uint256'}], 'payable':false, 'stateMutability':'view', 'type':'function'},

	//guardian - management - governance
	{'constant':true, 'inputs':[], 'name':'guardian', 'outputs':[{'name':'_guardian', 'type':'address'}], 'payable':false, 'stateMutability':'view', 'type':'function'},
	{'constant':true, 'inputs':[], 'name':'management', 'outputs':[{'name':'_management', 'type':'address'}], 'payable':false, 'stateMutability':'view', 'type':'function'},
	{'constant':true, 'inputs':[], 'name':'governance', 'outputs':[{'name':'_governance', 'type':'address'}], 'payable':false, 'stateMutability':'view', 'type':'function'},
	{'constant':true, 'inputs':[], 'name':'rewards', 'outputs':[{'name':'_rewards', 'type':'address'}], 'payable':false, 'stateMutability':'view', 'type':'function'},

	//availableDepositLimit - depositLimit - debtOutstanding
	{'constant':true, 'inputs':[], 'name':'availableDepositLimit', 'outputs':[{'name':'_limit', 'type':'uint256'}], 'payable':false, 'stateMutability':'view', 'type':'function'},
	{'constant':true, 'inputs':[], 'name':'depositLimit', 'outputs':[{'name':'_limit', 'type':'uint256'}], 'payable':false, 'stateMutability':'view', 'type':'function'},
	{'stateMutability':'view', 'type':'function', 'name':'debtOutstanding', 'inputs':[{'name':'strategy', 'type':'address'}], 'outputs':[{'name':'', 'type':'uint256'}]}
];

export default Object.assign(VAULT_ABI, {'v0.2.x': VAULT_ABI_V02X, 'v0.4.x': VAULT_ABI});
