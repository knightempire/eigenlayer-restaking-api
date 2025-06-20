const Reward = require('../models/reward');

exports.getRewardsByAddress = async (req, res) => {
  try {
    const address = req.params.address.toLowerCase();
    const rewards = await Reward.findOne({ walletAddress: address });

    if (!rewards) {
      return res.status(404).json({ error: 'No rewards found for this address' });
    }

    res.json(rewards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
