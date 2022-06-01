const	STRATEGY_ABI = [
	//apiVersion - emergencyExit
	{'constant':true, 'inputs':[], 'name':'apiVersion', 'outputs':[{'name':'version', 'type':'string'}], 'payable':false, 'stateMutability':'view', 'type':'function'},
	{'constant':true, 'inputs':[], 'name':'emergencyExit', 'outputs':[{'name':'emergencyExit', 'type':'bool'}], 'payable':false, 'stateMutability':'view', 'type':'function'},

	//estimatedTotalAssets
	{'constant':true, 'inputs':[], 'name':'estimatedTotalAssets', 'outputs':[{'name':'amount', 'type':'uint256'}], 'payable':false, 'stateMutability':'view', 'type':'function'},

	//isActive
	{'constant':true, 'inputs':[], 'name':'isActive', 'outputs':[{'name':'active', 'type':'bool'}], 'payable':false, 'stateMutability':'view', 'type':'function'},

	//guardian - management - governance
	{'constant':true, 'inputs':[], 'name':'keeper', 'outputs':[{'name':'_keeper', 'type':'address'}], 'payable':false, 'stateMutability':'view', 'type':'function'},
	{'constant':true, 'inputs':[], 'name':'strategist', 'outputs':[{'name':'_strategist', 'type':'address'}], 'payable':false, 'stateMutability':'view', 'type':'function'},
	{'constant':true, 'inputs':[], 'name':'rewards', 'outputs':[{'name':'_rewards', 'type':'address'}], 'payable':false, 'stateMutability':'view', 'type':'function'},
	
	//keepCRV
	{constant: true, inputs: [], name: "keepCRV", outputs: [{ internalType: "uint256", name: "", type: "uint256" }], stateMutability: "view", type: "function", },
];

export default STRATEGY_ABI;