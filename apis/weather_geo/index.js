
const { OPEN_API_KEY, WINDY_MINIMUM } = process.env;

const axios = require('axios');

const api = module.exports = {
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
    let wind = '';

    if (weather.wind && weather.wind.speed && weather.wind.speed > WINDY_MINIMUM) {
      wind = '🌬';
    }

    switch (mainWeather) {
      case 'Clear':
        return wind + '☀';
      case 'Rain':
        return wind + api.getRainIcon(weather.rain);
      case 'Thunderstorm':
        return '⛈';
      case 'Drizzle':
        return wind + '🌧';
      case 'Clouds':
        return wind + api.getCloudyIcon(weather.clouds);
      case 'Snow':
        return wind + api.getSnowIcon(weather.snow);
      case 'Tornado':
        return '🌪';
      case 'Mist':
      case 'Smoke':
      case 'Haze':
      case 'Fog':
      case 'Sand':
      case 'Dust':
      case 'Ash':
        return wind + '🌫';
      default:
        return '';
    }
  },
  getCloudyIcon: (clouds) => {
    //console.log('CLOUDS', clouds);
    if (!clouds) return '☀';
    if (clouds.all > 80) return '☁';
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
  }
};