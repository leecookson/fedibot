
const moment = require('moment-timezone');

const cityGeo = require('../../apis/city_geo');
const timezoneGeo = require('../../apis/time_zone_geo');

module.exports = {
    getCityAndBoosts: async () => {
        const randomCity = await cityGeo.getRandomCity();
        const { lat, lng } = randomCity;
        const timeZones = await timezoneGeo.findTimeZone(lat, lng);
        const now = (moment(new Date()));
        const timeThere = now.tz(timeZones[0]);
        return {
              ...randomCity,
              timeZone: timeZones[0],
              timeThere
            };
    }   
};