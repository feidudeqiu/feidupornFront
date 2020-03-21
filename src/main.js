// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/router'
import axios from 'axios'
import VueCookie from "vue-cookie"
Vue.prototype.axios = axios
Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
axios.interceptors.request.use(config => {
	if (/get/i.test(config.method)) { 
		config.params  =  config.params || {};
		config.params.t = Date.parse(new Date()) / 1000;
	}
    return config;
}, error => {
    return Promise.reject(error);
})

