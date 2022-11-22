
const {
  MASTODON_ACCESS_TOKEN,
  MASTODON_DOMAIN,
  MASTODON_MAX_POSTS,
  FIVEOCLOCK_COLD_HOT_THRESHOLD
 } = process.env;

import { login } from 'masto';

import weatherGeo from '../../apis/weather_geo/index.js';
import drinks from '../../apis/drinks/index.js';

import core from './core.js';

const asyncDriver = async () => {
    const masto = await login({
    url: `https://${MASTODON_DOMAIN}`,
    timeout_ms: 60*1000,  // optional HTTP request timeout to apply to all requests.
    accessToken: MASTODON_ACCESS_TOKEN
  });

//  const randomCity = await cityGeo.getRandomCity();
//  console.log('randomCity', randomCity);
  const city5 = await core.findLocation5Oclock();
  console.log('city5', city5);

  if (!city5) {
    console.error('not posting this time, did not find a 5pm city');
    process.exit(-1);
  }

  const {city_ascii: city, country, /*iso2, iso3, timeZone,*/ admin_name, lat, lng, timeThere } = city5;
  const timeDisplay = timeThere.format('h:mma');

  const { data: weather } = await weatherGeo.getWeather(lat, lng);
  const weatherDesc = weather.weather[0].description;
  const temp = Math.round(weather.main.temp);
  const weatherIcon = weatherGeo.getWeatherTypeIcon(weather);

  const googleMapsUrl = `https://maps.google.com?q=${lat},${lng}&z=3`;

  console.log('weather', weather);

  const drink = temp > FIVEOCLOCK_COLD_HOT_THRESHOLD ?
    await drinks.getColdDrink() :
    await drinks.getHotDrink();

    const status = (admin_name ?
    `It's 5 o'clock in ${city}, ${admin_name}, ${country}!` :
    `It's 5 o'clock in ${city}, ${country}!`) + '\n' +
    `${weatherIcon} The weather is ${weatherDesc}, and ${temp}°C` + '\n' +
    (timeDisplay !== '5:00pm' ? `(It's actually ${timeDisplay})` : '') + '\n' +
    `If you're thirsty, try a ${drink}` + '\n' +
    `${googleMapsUrl}`;

  console.log('status', status);
  const postResult = await masto.statuses.create({
    status: status,
    sensitive: false,
    visibility: 'public',
  });
  console.log('postResult.id', postResult.id);

  const { value: timelineHome } = await masto.timelines.fetchHome({local: true});
  console.log('timelineHome.length', timelineHome.length);

  if (timelineHome.length > MASTODON_MAX_POSTS) {
    for (let pIndex = timelineHome.length; pIndex > MASTODON_MAX_POSTS; pIndex--) {
      const oldestPost = timelineHome[pIndex - 1];
      if (oldestPost.id) { // TODO: check this matches this account only
        oldestPost && console.log('oldestPost.id', oldestPost.id);

        const deleteResult = await masto.statuses.remove(`${oldestPost.id}`);
        console.log('deleteResult.id', deleteResult.id);      }
    }
  }
  process.exit(0);
}


asyncDriver();

