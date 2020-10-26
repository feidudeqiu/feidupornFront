import { instance1 } from './request';

const uploadApp = (options) => {
  const data = format(options);
  return instance1({
    url: '/uploadapp',
    method: 'POST',
    data,
  });
}

function format (options) {
  const formData = new FormData();
  for (let key in options) {
    let value = options[key]; 
    if (value instanceof Array) {
      for (let item of value) {
        formData.append(key, item);
      }
    } else {
      formData.append(key, value);
    }
  }
  return formData;
}

export { uploadApp };