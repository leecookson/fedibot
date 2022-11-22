import axios from 'axios';

const options = {
  method: 'GET',
  url: 'http://api.population.io/',
  headers: {
  }
};

const api = {
  getCountries: async () => {
    return axios.request(options);
  }
};

export default api;
