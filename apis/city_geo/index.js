import { readFileSync } from 'fs'
const cities = readFileSync(new URL('../../data/worldcities.json', import.meta.url));

console.log('city count', cities.length);

const api = {
  getCities: async () => {
    return cities;
  },
  getRandomCity: async () => {
    var city = cities[Math.floor(Math.random() * cities.length)];
    return city;
  }
};

export default api;