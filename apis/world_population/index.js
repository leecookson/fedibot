const axios = require('axios');

const options = {
  method: 'GET',
  url: 'http://api.population.io/',
  headers: {
  }
};

module.exports = {
  getCountries: async () => {
    return axios.request(options);
  }
}
