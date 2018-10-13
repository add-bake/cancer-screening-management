import axios from 'axios'
import { Message } from 'element-ui'
import session from '../utils/session'

axios.defaults.baseURL = process.env.API_ROOT
axios.interceptors.request.use(config => {
  let token = session('token')
  if (token) config.headers['Authorization'] = token
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  let {token} = response.headers
  if (token) session('token', token)
  return response
}, error => {
  return Promise.resolve(error.response)
})

let checkStatus = response => {
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
    return response.data
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    msg: '网络异常'
  }
}

function checkCode (res) {
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (res.status === -404) {
    Message({
      message: res.msg,
      type: 'warning'
    })
  }
  return res
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
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  }
}