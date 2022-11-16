const { writeFileSync } = require('fs');
const timezoneGeo = require('./apis/time_zone_geo'); 

const data = require('./data/worldcities.json');

const asyncDriver = async () => {

    const dd = await  data.forEach(async (city) => {
        const { lat, lng } = city;
        const tz = await timezoneGeo.findTimeZone(lat, lng);
        city.timeZone = tz[0]
    });
    console.log('writing', dd);
    writeFileSync('data/world.json', JSON.stringify(data));
};
asyncDriver();