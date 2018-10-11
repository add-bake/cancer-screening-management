import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    orderStatus: ['待支付', '预约成功', '体检成功'] //订单状态 0待支付；1预约成功；2体检成功
  },
  mutations: {
    
  }
})
export default store
