const data = require('../../data/worldcities.json');
console.log('city count', data.length);

module.exports = {
  getCities: async () => {
    return data;
  },
  getRandomCity: async () => {
    var city = data[Math.floor(Math.random()*data.length)];
    return city;
  }
};