import { readFileSync } from 'fs'
const coldDrinks = JSON.parse(readFileSync(new URL('../../data/cold_drinks.json', import.meta.url)));
const hotDrinks = JSON.parse(readFileSync(new URL('../../data/hot_drinks.json', import.meta.url)));
console.log('drink counts', coldDrinks.length, hotDrinks.length);

const drinks = {
  getColdDrink: async () => {
    return coldDrinks[Math.floor(Math.random() * coldDrinks.length)];
  },
  getHotDrink: async () => {
    return hotDrinks[Math.floor(Math.random() * hotDrinks.length)];
  }
};

export default drinks;