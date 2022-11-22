import { find } from 'geo-tz';

const api = {
  findTimeZone: async (lat, lng) => {
    return find(lat, lng);
  }
};

export default api;