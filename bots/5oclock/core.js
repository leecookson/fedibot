const { RETRY_FOR_5OCLOCK } = process.env;

const moment = require('moment-timezone');

const cityGeo = require('../../apis/city_geo');
const timezoneGeo = require('../../apis/time_zone_geo');

module.exports = {
  findLocation5Oclock: async () => {
    let maxTries = RETRY_FOR_5OCLOCK;
    let result;

    while ( maxTries > 0 ) {
        const randomCity = await cityGeo.getRandomCity();
        //console.log('randomCity', randomCity);
        const {lat, lng } = randomCity;
        const timeZones = await timezoneGeo.findTimeZone(lat, lng);
        //console.log('timeZones', timeZones);

        const now = (moment(new Date()));
        const timeThere = now.tz(timeZones[0]);
        const is5oclock = timeThere.format('ha') === '5pm';
        //console.log('time there', now.tz(timeZones[0]).format('ha'), is5oclock, randomCity.city);

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