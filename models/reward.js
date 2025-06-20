const mongoose = require('mongoose');

const RewardBreakdownSchema = new mongoose.Schema({
  operatorAddress: String,
  amountStETH: String,
  timestamps: [Number],
});

const RewardSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true, index: true },
  totalRewardsReceivedStETH: { type: String, required: true },
  rewardsBreakdown: [RewardBreakdownSchema],
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Reward', RewardSchema);
