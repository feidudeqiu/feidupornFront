import axios from 'axios';

const instance1 = axios.create({
  baseURL: 'http://localhost:8001/app',
  timeout: 10000,
});

instance1.interceptors.request.use(config => {
  return config;
}, error => Promise.error(error))

instance1.interceptors.response.use(
  res => res.status === 200 ? Promise.resolve(res.data) : Promise.reject(res),
  error => {
    const res = error.response;
    if (res) {
      return Promise.reject(res);
    } else {
      console.log('超时了');
      console.log(error)
    }
  })

export {
  instance1,
};