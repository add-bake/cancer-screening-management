'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"http://192.168.0.79:8080/api"',
  IMG_ROOT: '"https://health.5ishequ.com.cn/upload/health"'
})
