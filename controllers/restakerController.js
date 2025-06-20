const Restaker = require('../models/restaker');

exports.getRestakers = async (req, res) => {
  try {
    const restakers = await Restaker.find({});
    res.json(restakers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
