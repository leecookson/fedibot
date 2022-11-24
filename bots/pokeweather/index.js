// eslint-disable-next-line no-unused-vars
import dotenv from 'dotenv-safe/config.js';

const {
  MASTODON_ACCESS_TOKEN,
  MASTODON_DOMAIN,
  MASTODON_MAX_POSTS
} = process.env;

import Mastodon from 'mastodon';

import weatherGeo from '../../apis/weather_geo/index.js';

import core from './core.js';

const M = new Mastodon({
  access_token: MASTODON_ACCESS_TOKEN,
  timeout_ms: 60*1000,  // optional HTTP request timeout to apply to all requests.
  api_url: `https://${MASTODON_DOMAIN}/api/v1/`, // optional, defaults to https://mastodon.social/api/v1/
})

async function main() {

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
  const { data: postResult } = await M.post('statuses', {
    status: status,
    sensitive: false,
    visibilty: 'public'
  });
  console.log('postResult.id', postResult.id);

  const { data: timelineHome } = await M.get('timelines/home', {});
  console.log('timelineHome.length', timelineHome.length);
  
  if (timelineHome.length > MASTODON_MAX_POSTS) {
    for (let pIndex = timelineHome.length; pIndex > MASTODON_MAX_POSTS; pIndex--) {
      const oldestPost = timelineHome[pIndex - 1];
      if (oldestPost.id) {
        oldestPost && console.log('oldestPost.id', oldestPost.id);

        const deleteResult = await M.delete(`statuses/${oldestPost.id}`, {});
        console.log('deleteResult.resp.statusCode', deleteResult.resp.statusCode);
      }
    }
  }
}

main();
