# Yearn Watch
![](./.github/og.jpeg)

Yearn Watch is a dashboard used to track information about Yearn's Vaults and strategies.  
It is used to hightlight some potential issues (warning, error, critical) and be able to fix them.

The data sources used are:  
- The data from the Yearn API: https://api.yearn.finance/v1/chains/1/vaults/all
- The data from the Yearn Meta: https://meta.yearn.finance/api/1/vaults/all
- The data from the Yearn Graph: https://api.thegraph.com/subgraphs/name/0xkofee/yearn-vaults-v2
- The data from the Risk Framework: https://raw.githubusercontent.com/yearn/yearn-data-analytics/master/src/risk_framework/risks.json

## How to run the project  
1. Clone the repository  
2. Run `yarn`  
3. Run `yarn run dev`  
4. Access `http://localhost:3000`  
