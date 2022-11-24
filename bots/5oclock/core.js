const { RETRY_FOR_5OCLOCK } = process.env;

import moment from 'moment-timezone';

import cityGeo from '../../apis/city_geo/index.js';
import timezoneGeo from '../../apis/time_zone_geo/index.js';

const core  = {
  findLocation5Oclock: () => {
    let maxTries = RETRY_FOR_5OCLOCK;
    let result;
      console.log('maxTries', maxTries);

    while ( maxTries > 0 ) {
      const randomCity = cityGeo.getRandomCity();
      // console.log('randomCity', randomCity);
      const { lat, lng } = randomCity;
      const timeZones = timezoneGeo.findTimeZone(lat, lng);
      // console.log('timeZones', timeZones);

      const now = (moment(new Date()));
      const timeThere = now.tz(timeZones[0]);
      const is5oclock = timeThere.format('ha') === '5pm';
      // console.log('time there', now.tz(timeZones[0]).format('ha'), is5oclock, randomCity.city);

      if (!result && is5oclock) {
        result = {
          ...randomCity,
          timeZone: timeZones[0],
          timeThere
        };
      }

      maxTries --;
    }

    if (maxTries === 0) {
      console.error('didn\'t find 5pm within', RETRY_FOR_5OCLOCK);
    }
    return result;
  }
}

export default core;