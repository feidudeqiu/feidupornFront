const validateSpace = (rule, value, callback) => {
  if (/\s/.test(value)) callback(new Error('请不要包含空格'));
  else callback();
}

const validateChName = (rule, value, callback) => {
  if (/[^a-zA-Z\d\u4E00-\u9FA5]/u.test(value)) callback(new Error('包含非法字符'));
  else callback();
}

const validateEnName = (rule, value, callback) => {
  if (/\W/.test(value)) callback(new Error('包含非法字符'));
  else callback();
}

const validateIndexPage = (file) => {
  return (rule, value, callback) => {
    if (file.length === 0) return callback(new Error('请上传主页文件'));
    else callback();
  }
}

export {
  validateSpace,
  validateChName,
  validateEnName,
  validateIndexPage,

}