require('dotenv-safe').config();
const {
  MASTODON_ACCESS_TOKEN,
  MASTODON_DOMAIN,
  MASTODON_MAX_POSTS
 } = process.env;

const Masto = require('mastodon');
//const moment = require('moment-timezone');

//const cityGeo = require('./apis/city_geo');
const weatherGeo = require('./apis/weather_geo');
//const timezoneGeo = require('./apis/time_zone_geo');
const city5oclock = require('./5oclock');

//const OAuth2 = require('oauth').OAuth2;

// const oauth = new OAuth2('your_client_id', 'your_client_secret', 'https://mastodon.social', null, '/oauth/token');
// const url = oauth.getAuthorizeUrl({ redirect_uri: 'urn:ietf:wg:oauth:2.0:oob', response_type: 'code', scope: 'read write follow' });
// // Get the user to open up the url in their browser and get the code

// oauth.getOAuthAccessToken('code from the authorization page that user should paste into your app', { grant_type: 'authorization_code', redirect_uri: 'urn:ietf:wg:oauth:2.0:oob' }, function(err, accessToken, refreshToken, res) { console.log(accessToken); })

const M = new Masto({
  access_token: MASTODON_ACCESS_TOKEN,
  timeout_ms: 60*1000,  // optional HTTP request timeout to apply to all requests.
  api_url: `https://${MASTODON_DOMAIN}/api/v1/`, // optional, defaults to https://mastodon.social/api/v1/
})

const asyncDriver = async () => {
//  const randomCity = await cityGeo.getRandomCity();
//  console.log('randomCity', randomCity);
  const city5 = await city5oclock.findLocation5Oclock();
  console.log('city5', city5);

  if (!city5) {
    console.error('not posting this time, did not find a 5pm city');
    process.exit(-1);
  }

  const {city_ascii: city, country, iso2, iso3, admin_name, lat, lng, timeZone, timeThere } = city5;
  const timeDisplay = timeThere.format('h:mma');

  const { data: weather } = await weatherGeo.getWeather(lat, lng);
  const weatherDesc = weather.weather[0].description;
  const temp = Math.round(weather.main.temp);
  const weatherIcon = weatherGeo.getWeatherTypeIcon(weather);

  console.log('weather', weather);

  //   const timeZones = await timezoneGeo.findTimeZone(lat, lng);
//   console.log('timeZones', timeZones);

//   const now = (moment(new Date()));
//   const timeThere = now.tz(timeZones[0]);
//   const is5oclock = timeThere.format('ha') === '5pm';
//   console.log('time there', now.tz(timeZones[0]).format('ha'), is5oclock);

  const status = (admin_name ?
    `It's 5 o'clock in ${city}, ${admin_name}, ${iso3}!` :
    `It's 5 o'clock in ${city}, ${country}!`) + '\n' +
    `${weatherIcon} The weather is ${weatherDesc}, and ${temp}°C` + '\n' +
    (timeDisplay !== '5:00pm' && `(It's actually ${timeDisplay})`);

    console.log('status', status);
  const postResult = await M.post('statuses', {
    status: status,
    sensitive: false,
    visibilty: 'public'
  });
 console.log('postResult.data.id', postResult.data.id);

  const { data: timelineHome } = await M.get('timelines/home', {});
  console.log('timelineHome.length', timelineHome.length);

  if (timelineHome.length > MASTODON_MAX_POSTS) {
    for (let pIndex = timelineHome.length; pIndex > MASTODON_MAX_POSTS; pIndex--) {
      const oldestPost = timelineHome[pIndex - 1];
      if (oldestPost.id) {
        oldestPost && console.log('oldestPost.id', oldestPost.id);

        const deleteResult = await M.delete(`statuses/${oldestPost.id}`, {});
        console.log('deleteResult.resp.statusCode', deleteResult.resp.statusCode)}
      }
    }
  }

asyncDriver();

