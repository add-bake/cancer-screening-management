import axios from 'axios'
import { Message } from 'element-ui'
import session from '../utils/session'
import router from '../router/index.js'

axios.defaults.baseURL = process.env.API_ROOT
axios.interceptors.request.use(config => {
  let token = session('token')
  if (token) config.headers['Authorization'] = token
  return config
}, error => {
  return Promise.reject(error)
})

function redirectToLogin () {
  session('token','')
  router.replace({path: '/login', query: {redirect: window.location.hash.slice(1)}})
}

axios.interceptors.response.use(response => {
  if (response.status === 403 || response.data.code === 500) {
    return redirectToLogin()
  }
  let {token} = response.headers
  if (token) session('token', token)
  return response
}, error => {
  return Promise.reject(error.response)
})

let checkStatus = response => {
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    // 如果不需要除了data之外的数据，可以直接返回 response.data
    return response.data
  }
  Message({
    message: res.msg,
    type: 'warning'
  })
}

export default {
  post (url, data) {
    return axios({
      method: 'post',
      url: url,
      data: data,
    }).then(
      (response) => {
        return checkStatus(response)
      }
    )
  },
  get (url, params) {
    return axios({
      method: 'get',
      url,
      params, // get 请求时带的参数
    }).then(
      (response) => {
        return checkStatus(response)
      }
    )
  }
}
