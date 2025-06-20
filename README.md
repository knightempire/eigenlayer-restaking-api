# EigenLayer Restaking Info API

This backend API provides information about EigenLayer restaking including restakers, validators, and rewards.

## Features

- REST API endpoints to query restakers, validators, and rewards.
- Periodic data fetching from EigenLayer's subgraph on The Graph.
- Data stored in MongoDB.

## Setup Instructions

### 1. Create a `.env` File

Create a `.env` file in the root directory and add the following environment variables:
```bash
PORT=
MONGO_URI=
EIGENLAYER_SUBGRAPH_URL=
```


**Clone the repository**

```bash
git clone https://github.com/knightempire/eigenlayer-restaking-api.git
cd eigenlayer-restaking-api
```

**Install dependencies**
```bash
npm install
```

**npm run fetch-data**
```bash
npm run fetch-data
```

**Start the API server**
```bash
npm start
```


## API Endpoints



- `GET /restakers`  
  Returns all restakers with fields:  
  - userAddress  
  - amountRestakedStETH  
  - targetAVSOperatorAddress  

- `GET /validators`  
  Returns all validators with fields:  
  - operatorAddress  
  - totalDelegatedStakeStETH  
  - slashHistory  
  - status  

- `GET /rewards/:address`  
  Returns rewards for a wallet address with fields:  
  - walletAddress  
  - totalRewardsReceivedStETH  
  - rewardsBreakdown  


## Notes

- Adjust fetch queries or schema to match actual subgraph schema if necessary.
- This setup uses Mongoose for MongoDB object modeling.
- The data fetching script can be enhanced to support pagination and incremental updates.
