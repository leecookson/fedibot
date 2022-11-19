const coldDrinks = require('../../data/cold_drinks.json');
const hotDrinks = require('../../data/hot_drinks.json');
console.log('drink counts', coldDrinks.length, hotDrinks.length);

module.exports = {
  getColdDrink: async () => {
    return coldDrinks[Math.floor(Math.random() * coldDrinks.length)];
  },
  getHotDrink: async () => {
    return hotDrinks[Math.floor(Math.random() * hotDrinks.length)];
  }
};