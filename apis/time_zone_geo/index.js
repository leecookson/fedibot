import { find } from 'geo-tz';

const api = {
  findTimeZone: (lat, lng) => {
    return find(lat, lng);
  }
};

export default api;