
const { OPEN_API_KEY  } = process.env;

import axios from 'axios';

const api = {
  getWeather: async (lat, lng) => {
    const options = {
      method: 'GET',
      url: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${OPEN_API_KEY}`,
    };

    return axios.request(options);
  },
  getWeatherTypeIcon: (weather) => {
    if (!weather || !weather.weather || !weather.weather[0].main) return '';
    const weatherData = weather.weather[0];
    const mainWeather = weatherData.main;
    const windType = api.getWindType(weather.wind.speed);
    console.log('windType', windType, weather.wind.speed);
    const windIcon = api.getWindIcon(windType);

    switch (mainWeather) {
      case 'Clear':
        return windIcon + '☀';
      case 'Rain':
        return windIcon + api.getRainIcon(weather.rain);
      case 'Thunderstorm':
        return '⛈';
      case 'Drizzle':
        return windIcon + '🌧';
      case 'Clouds':
        return windIcon + api.getCloudyIcon(weather.clouds);
      case 'Snow':
        return windIcon + api.getSnowIcon(weather.snow);
      case 'Tornado':
        return '🌪';
      case 'Mist':
      case 'Smoke':
      case 'Haze':
      case 'Fog':
      case 'Sand':
      case 'Dust':
      case 'Ash':
        return windIcon + '🌫';
      default:
        return '';
    }
  },
  getCloudyIcon: (clouds) => {
    //console.log('CLOUDS', clouds);
    if (!clouds) return '☀';
    if (clouds.all >= 50) return '☁';
    if (clouds.all > 20) return '🌤';
    return '☀';
  },
  getRainIcon: (rain) => {
    //console.log('RAIN', rain);
    if (!rain) return '';
    if (rain['1h'] > 1.0) return '🌧';
    return '☁';
  },
  getSnowIcon: (snow) => {
    //console.log('SNOW', snow);
    if (!snow) return '';
    if (snow['1h'] > 2.0) return '❄';
    return '☁';
  },
  getWindType: (windSpeed) => {
    if (windSpeed < 1.5) return 'calm';
    if (windSpeed < 8.0) return 'breezy';
    if (windSpeed < 17) return 'windy';
    if (windSpeed < 28) return 'gale';
    if (windSpeed < 32) return 'storm';
    return "hurricane"
  },
  getWindIcon: (windType) => {
    switch (windType) {
      case 'calm': return '';
      case 'breezy': return '';
      case 'windy': return '💨';
      case 'gale': return '🌬';
      case 'storm': return '⛈';
      case 'hurricane': return '🌪';
    }
  }
};

export default api;