import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Login from '@/components/Login'
import Register from '@/components/Register'
import UserInfo from '@/components/UserInfo'
import Test from '@/components/Test'
Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      alias: '/index',
      name: 'Index',
      component: Index,
      meta: {
        title: '首页'
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: '登录'
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: {
        title: '注册'
      }
    },
    {
      path: '/userInfo',
      name: 'UserInfo',
      component: UserInfo,
      meta: {
        title: '个人中心'
      }
    },
    {
      path: '/test',
      name: 'Test',
      component: Test,
      meta: {
        title: '测试'
      }
    }
  ]
})