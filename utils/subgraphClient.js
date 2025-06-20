const axios = require('axios');
require('dotenv').config();

const SUBGRAPH_URL = process.env.EIGENLAYER_SUBGRAPH_URL;

async function querySubgraph(query, variables = {}) {
  try {
    const response = await axios.post(
      SUBGRAPH_URL,
      {
        query,
        variables,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Subgraph query error:', error.message);
    throw error;
  }
}

module.exports = { querySubgraph };
