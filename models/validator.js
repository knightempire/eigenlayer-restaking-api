const mongoose = require('mongoose');

const SlashHistorySchema = new mongoose.Schema({
  timestamp: Number,
  amountStETH: String,
  reason: String,
});

const ValidatorSchema = new mongoose.Schema({
  operatorAddress: { type: String, required: true, unique: true, index: true },
  totalDelegatedStakeStETH: { type: String, required: true },
  slashHistory: [SlashHistorySchema],
  status: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Validator', ValidatorSchema);
