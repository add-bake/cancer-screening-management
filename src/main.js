import Vue from 'vue'
import ElementUI, {Loading} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './style/my-style.less'
import App from './App'
import router from './router'
import store from './store/index'
import './icons'
import dict from './utils/dict'
import session from './utils/session'

router.beforeEach((to, from, next) => {
  let token = session('token')
  if (to.path === '/login') {
    if (token) {
      return next(false)
    } else {
      return next()
    }
  }
  if (!token) {
    next({path: '/login', replace: true, query: {redirect: window.encodeURI(to.fullPath)}})
  } else {
    next()
  }
})

Vue.prototype.$dict = dict
Vue.prototype.$ctloading = (callback) => {
  const instance = Loading.service({
    lock: true,
    // text: '加载中...',
    spinner: 'el-icon-loading',
    background: 'rgba(255, 255, 255, 0.7)'
  })
  callback().then(() => {
    instance.close()
  })
}
Vue.config.productionTip = false
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
