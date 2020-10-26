import { instance1 } from './request';

const getAppInfo =  (name) => {
  return instance1({
    url: '/appinfo',
    method: 'GET',
    params: {
      name
    }
  });
}

export { getAppInfo };