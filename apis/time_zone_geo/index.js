const { find } = require('geo-tz');

module.exports = {
  findTimeZone: async (lat, lng) => {
    return find(lat, lng);
  }
};