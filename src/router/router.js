import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Login from '@/components/Login'
import ForgetPassword from '@/components/ForgetPassword'
import Register from '@/components/Register'
import UserCenter from '@/components/UserCenter/UserCenter'
import Security from '@/components/UserCenter/Security'
import ChangePassword from '@/components/UserCenter/ChangePassword'
import Callback from '@/components/UserCenter/callback'
import AddNote from '@/components/Note/AddNote'
import AddNoteSet from '@/components/Note/AddNoteSet'
import EditNote from '@/components/Note/EditNote'
import EditNoteSet from '@/components/Note/EditNoteSet'
import NoteSet from '@/components/Note/NoteSet'
import NotePlate from '@/components/Note/NotePlate'
import PictureBed from '@/components/Picture/PictureBed'
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
      path: '/forgetPassword',
      name: 'ForgetPassword',
      component: ForgetPassword,
      meta: {
        title: '忘记密码'
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
      path: '/userCenter/callback',
      name: 'Callback',
      component: Callback,
      meta: {
        title: '反馈'
      }
    },
    {
      path: '/userCenter/security',
      name: 'Security',
      component: Security,
      meta: {
        title: '安全中心'
      }
    },
    {
      path: '/userCenter/security/changePassword',
      name: 'ChangePassword',
      component: ChangePassword,
      meta: {
        title: '修改密码'
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
      path: '/addNoteSet',
      name: 'AddNoteSet',
      component: AddNoteSet,
      meta: {
        title: '添加文集'
      }
    },
    {
      path: '/editNoteSet',
      name: 'EditNoteSet',
      component: EditNoteSet,
      meta: {
        title: '编辑文集'
      }
    },
    {
      path: '/editNote',
      name: 'EditNote',
      component: EditNote,
      meta: {
        title: '编辑笔记'
      }
    },
    {
      path: '/noteSet',
      name: 'NoteSet',
      component: NoteSet,
      meta: {
        title: '文集'
      }
    },
    {
      path: '/notePlate',
      name: 'NotePlate',
      component: NotePlate,
      meta: {
        title: '文章面板'
      }
    },
    {
      path: '/pictureBed',
      name: 'PictureBed',
      component: PictureBed,
      meta: {
        title: '图床'
      }
    }

  ]
})