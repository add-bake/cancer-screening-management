import axios from 'axios'
import { Message , Loading } from 'element-ui'
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
  let search = window.location.hash.split('?')[1]
  if (!(search && search.startsWith('redirect'))) {
    router.replace({path: '/login', query: {redirect: window.encodeURI(window.location.hash.slice(1))}})
  }
}

axios.interceptors.response.use(response => {
  if (response.status === 403 || response.data.code === 500) {
    return redirectToLogin()
  }
  let {token} = response.headers
  if (token) session('token', token)
  return response
}, error => {
  if (error.response && (error.response.status === 403 || error.response.status === 500)) redirectToLogin()
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
    ).catch(err => {
      Message({
        message: err.data.msg,
        type: 'warning'
      })
    })
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
  },
  download (url, params, filename) {
    const instance = Loading.service({
      lock: true,
      // text: '加载中...',
      spinner: 'el-icon-loading',
      background: 'rgba(255, 255, 255, 0.7)'
    })
    return axios({
      method: 'get',
      url,
      params, // get 请求时带的参数
      responseType: 'blob'
    }).then(
      (response) => {
        if (!response) {
          return
        }
        let disposition = response.headers['content-disposition']
        let blob = new Blob([response.data], {type: response.headers['content-type']})
        let url = window.URL.createObjectURL(blob)
        let link = document.createElement('a')

        link.style.display = 'none'
        link.href = url
        if(disposition){
          let start = disposition.indexOf('filename')+10
          let end = disposition.length-1
          link.setAttribute('download',window.decodeURI(disposition.substring(start,end)))
          document.body.appendChild(link)
          link.click()
        } else {
          if(filename){
            link.setAttribute('download',filename)
            document.body.appendChild(link)
            link.click()
          } else {
            Message({
              message: '未获取到文件名称',
              type: 'warning'
            })
          }
        }
        instance.close()
      }
    )
  }
}
