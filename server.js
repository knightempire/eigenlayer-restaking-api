const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Import routes
const restakersRoute = require('./routes/restakers');
const validatorsRoute = require('./routes/validators');
const rewardsRoute = require('./routes/rewards');

// Use routes
app.use('/restakers', restakersRoute);
app.use('/validators', validatorsRoute);
app.use('/rewards', rewardsRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`EigenLayer Restaking API running on port ${PORT}`);
});
