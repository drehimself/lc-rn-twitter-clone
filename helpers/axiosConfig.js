import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://lc-laravel-twitter-clone.test/api',
});

export default instance;
