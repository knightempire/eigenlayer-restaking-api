const mongoose = require('mongoose');
const Restaker = require('../models/restaker');
const Validator = require('../models/validator');
const Reward = require('../models/reward');
const { querySubgraph } = require('../utils/subgraphClient');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

async function main() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  // Fetch and save restakers
  await fetchAndSaveRestakers();

  // Fetch and save validators
  await fetchAndSaveValidators();

  // Fetch and save rewards
  await fetchAndSaveRewards();

  console.log('Data fetching completed');
  mongoose.disconnect();
}

// === Fetch restakers from subgraph ===
async function fetchAndSaveRestakers() {
  console.log('Fetching restakers...');

  // GraphQL query to fetch user restaking info (example)
  const restakersQuery = `
    query {
      delegations(first: 1000) {
        id
        delegator {
          id
        }
        operator {
          id
        }
        amount
      }
    }
  `;

  const data = await querySubgraph(restakersQuery);

  if (!data || !data.delegations) {
    console.error('No restaker data found');
    return;
  }

  for (const delegation of data.delegations) {
    const userAddress = delegation.delegator.id.toLowerCase();
    const targetAVSOperatorAddress = delegation.operator.id.toLowerCase();
    const amountRestakedStETH = delegation.amount;

    // Upsert restaker data
    await Restaker.findOneAndUpdate(
      { userAddress },
      {
        userAddress,
        amountRestakedStETH,
        targetAVSOperatorAddress,
        lastUpdated: new Date(),
      },
      { upsert: true, new: true }
    );
  }

  console.log(`Saved ${data.delegations.length} restakers.`);
}

// === Fetch validators from subgraph ===
async function fetchAndSaveValidators() {
  console.log('Fetching validators...');

  const validatorsQuery = `
    query {
      operators(first: 1000) {
        id
        totalDelegated
        status
        slashEvents {
          timestamp
          amount
          reason
        }
      }
    }
  `;

  const data = await querySubgraph(validatorsQuery);

  if (!data || !data.operators) {
    console.error('No validator data found');
    return;
  }

  for (const op of data.operators) {
    const operatorAddress = op.id.toLowerCase();
    const totalDelegatedStakeStETH = op.totalDelegated;
    const status = op.status;
    const slashHistory = (op.slashEvents || []).map(event => ({
      timestamp: Number(event.timestamp),
      amountStETH: event.amount,
      reason: event.reason || 'N/A',
    }));

    await Validator.findOneAndUpdate(
      { operatorAddress },
      {
        operatorAddress,
        totalDelegatedStakeStETH,
        status,
        slashHistory,
        lastUpdated: new Date(),
      },
      { upsert: true, new: true }
    );
  }

  console.log(`Saved ${data.operators.length} validators.`);
}

// === Fetch rewards from subgraph ===
async function fetchAndSaveRewards() {
  console.log('Fetching rewards...');

  const rewardsQuery = `
    query {
      rewards(first: 1000) {
        id
        wallet {
          id
        }
        totalRewards
        breakdowns {
          operator {
            id
          }
          amount
          timestamps
        }
      }
    }
  `;

  const data = await querySubgraph(rewardsQuery);

  if (!data || !data.rewards) {
    console.error('No rewards data found');
    return;
  }

  for (const reward of data.rewards) {
    const walletAddress = reward.wallet.id.toLowerCase();
    const totalRewardsReceivedStETH = reward.totalRewards;
    const rewardsBreakdown = (reward.breakdowns || []).map(b => ({
      operatorAddress: b.operator.id.toLowerCase(),
      amountStETH: b.amount,
      timestamps: b.timestamps.map(ts => Number(ts)),
    }));

    await Reward.findOneAndUpdate(
      { walletAddress },
      {
        walletAddress,
        totalRewardsReceivedStETH,
        rewardsBreakdown,
        lastUpdated: new Date(),
      },
      { upsert: true, new: true }
    );
  }

  console.log(`Saved ${data.rewards.length} reward entries.`);
}

main().catch(console.error);
