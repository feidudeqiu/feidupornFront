import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Login from '@/components/Login'
import Register from '@/components/Register'
import UserCenter from '@/components/UserCenter/UserCenter'
import Test from '@/components/Test'
import AddNote from '@/components/Note/AddNote'
import AddNoteSet from '@/components/Note/AddNoteSet'
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
      path: '/userCenter',
      name: 'UserCenter',
      component: UserCenter,
      meta: {
        title: '个人中心'
      }
    },
    {
      path: '/addNote',
      name: 'AddNote',
      component: AddNote,
      meta: {
        title: '添加笔记'
      }
    },
    {
      path: '/test',
      name: 'Test',
      component: Test,
      meta: {
        title: '测试'
      }
    },
    {
      path: '/addNoteSet',
      name: 'AddNoteSet',
      component: AddNoteSet,
      meta: {
        title: '添加笔记集'
      }
    }
  ]
})