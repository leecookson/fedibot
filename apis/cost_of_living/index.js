
const { RAPID_API_KEY, RAPID_API_HOST } = process.env;

const axios = require('axios');

const options = {
  method: 'GET',
  url: `https://${RAPID_API_HOST}/get-countries-list`,
  headers: {
    'X-RapidAPI-Key': RAPID_API_KEY,
    'X-RapidAPI-Host': RAPID_API_HOST
  }
};

module.exports = {
  getCountries: async () => {
    return axios.request(options);
  }
}
