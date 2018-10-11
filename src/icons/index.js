import Vue from 'vue'
import IconSvg from '@/component/IconSvg'

Vue.component('icon-svg', IconSvg)

const reqContext = require.context('./svg', false, /.svg$/)
const requireAll = reqContext => reqContext.keys().map(reqContext)
requireAll(reqContext)
