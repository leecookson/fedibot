
const {
  MASTODON_ACCESS_TOKEN,
  MASTODON_DOMAIN,
  MASTODON_MAX_POSTS
} = process.env;

import { login } from 'masto';

import weatherGeo from '../../apis/weather_geo/index.js';

import core from './core.js';

async function main() {
  const masto = await login({
    url: `https://${MASTODON_DOMAIN}`,
    timeout_ms: 60*1000,  // optional HTTP request timeout to apply to all requests.
    accessToken: MASTODON_ACCESS_TOKEN
  });


  //  const randomCity = await cityGeo.getRandomCity();
  //  console.log('randomCity', randomCity);
  const cityAndBoosts = await core.getCityAndBoosts();
  console.log('cityAndBoosts', cityAndBoosts);

  if (!cityAndBoosts) {
    console.error('not posting this time, did not find a 5pm city');
    process.exit(-1);
  }

  const {city_ascii: city, country, /*iso2, iso3, timeZone,*/ admin_name, lat, lng, timeThere, weather, weatherType, boostedTypes } = cityAndBoosts;
  const timeDisplay = timeThere.format('h:mma');

  // const weatherDesc = weather.weather[0].description;
  // const temp = Math.round(weather.main.temp);
  const weatherIcon = weatherGeo.getWeatherTypeIcon(weather);

  const poekWeather = core.getWeatherTypeText(weatherType);

  const pokeBoostedTypes = core.getTypesText(boostedTypes);

  const googleMapsUrl = `https://maps.google.com?q=${lat},${lng}&z=3`;

  const status = (admin_name ?
    `It's ${timeDisplay} in ${city}, ${admin_name}, ${country}!` :
    `It's 5 o'clock in ${city}, ${country}!`) + '\n' +
    `${weatherIcon} The weather is ${poekWeather}\n` +
    `The types ${pokeBoostedTypes} are currently weather-boosted.\n` +
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
      if (oldestPost.id) {
        oldestPost && console.log('oldestPost.id', oldestPost.id);

        const deleteResult = await masto.statuses.remove(`${oldestPost.id}`);
        console.log('deleteResult.id', deleteResult.id);
      }
    }
  }
}

main();
