
import moment from 'moment-timezone';

import cityGeo from '../../apis/city_geo/index.js';
import timezoneGeo from '../../apis/time_zone_geo/index.js';
import weatherGeo from '../../apis/weather_geo/index.js';

const weatherNames = {
    'CLEAR': 'Sunny/Clear',
    'RAINY': 'Rainy',
    'PARTLY_CLOUDY': 'Partly Cloudy',
    'CLOUDY': 'Cloudy',
    'WINDY': 'Windy',
    'SNOW': 'Snow',
    'FOG': 'Foggy',
    'EXTREME': 'Extreme'
};

const typeNames = {
    'GRASS': 'Grass',
    'FIRE': 'Fire',
    'GROUND': 'Ground',
    'WATER': 'Water',
    'ELECTRIC': 'Electric',
    'BUG': 'Bug',
    'NORMAL': 'Normal',
    'ROCK': 'Rock',
    'FAIRY': 'Fairy',
    'FIGHTING': 'Fighting',
    'POISON': 'Poison',
    'FLYING': 'Flying',
    'DRAGON': 'Dragon',
    'PSYCHIC': 'Psychic',
    'ICE': 'Ice',
    'STEEL': 'Steel',
    'DARK': 'Dark',
    'GHOST': 'Ghost'
};

const core = {
    getCityAndBoosts: async () => {
        const randomCity = await cityGeo.getRandomCity();
        const { lat, lng } = randomCity;
        const timeZones = await timezoneGeo.findTimeZone(lat, lng);
        const now = (moment(new Date()));
        const timeThere = now.tz(timeZones[0]);

        const { data: weather } = await weatherGeo.getWeather(lat, lng);

        const weatherType = core.getWeatherType(weather);
        console.log('weatherType', weatherType);
        const boostedTypes = core.getBoosts(weatherType);
        console.log('boosts', boostedTypes);

        return {
              ...randomCity,
              timeZone: timeZones[0],
              timeThere,
              weather,
              weatherType,
              boostedTypes
            };
    },

    getWeatherType: (weather) => {
      const weatherSummary = weather?.weather[0];
      if (!weatherSummary) return 'ERROR';
      const id = weatherSummary.id
      const wind = weather.wind;

      console.log('getWeatherType id', id);
      if (id === 771 || id === 781) return 'EXTREME'

      // Check wind after Extreme, but before "normal" weather
      if (wind && wind.speed) {
        const windType = weatherGeo.getWindType(wind.speed);
        if (windType === 'windy') return 'WINDY';
      }

      if (id >= 200 && id < 300) return 'EXTREME';
      if ((id >= 300 && id <= 400) || (id >= 500 && id < 600)) return 'RAINY';
      if ((id >= 600 && id <= 700) || (id >= 500 && id < 600)) return 'SNOW';
      if (id === 800) return 'CLEAR';
      if (id === 801 || id === 802) return 'PARTLY_CLOUDY';
      if (id === 803 || id === 804) return 'CLOUDY';
    },
    getBoosts: (type) => {
      switch (type) {
        case 'CLEAR': return ['GRASS', 'FIRE', 'GROUND'];
        case 'RAINY': return ['WATER', 'ELECTRIC', 'BUG'];
        case 'PARTLY_CLOUDY': return ['NORMAL', 'ROCK'];
        case 'CLOUDY': return ['FAIRY', 'FIGHTING', 'POISON'];
        case 'WINDY': return ['FLYING', 'DRAGON', 'PSYCHIC'];
        case 'SNOW': return ['ICE', 'STEEL'];
        case 'FOG': return ['DARK', 'GHOST'];
        default: return ['NONE'];
      }
    },
    getWeatherTypeText: (weatherType) =>  {
        return weatherNames[weatherType] || 'NONE';
    },
    getTypesText: (types) => {
      let result = '';
      const numTypes = types.length;

      types.forEach((type, index) => {
        if (index !== 0) {
          if (index !== (numTypes - 1)) result += ', '
          else result += ' and ';
        }
        result += typeNames[type];
      });

      return result;
    }
};

export default core;
