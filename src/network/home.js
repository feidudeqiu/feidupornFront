import { instance1 } from './request';

const getApps = () => {
  return instance1({
    url: '/getapp',
    method: 'GET'
  });
}


export { getApps };