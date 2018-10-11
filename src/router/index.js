import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/page/Login'
import MainPage from '@/page/MainPage'
import BookingManagement from '@/page/BookingManagement'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: MainPage,
      children: [
        {path: '/bookingManagement', component: BookingManagement}
      ]
    },
    {path: '/login', component: Login}
  ]
})
