import { readFileSync } from 'fs'
const cities = JSON.parse(readFileSync(new URL('../../data/worldcities.json', import.meta.url)));

console.log('city count', cities.length);

const api = {
  getCities: () => {
    return cities;
  },
  getRandomCity: () => {
    const cityNum = Math.floor(Math.random() * cities.length);
    return cities[cityNum];
  }
};

export default api;