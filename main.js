require('aframe')
import Vue from 'vue'
import axios from 'axios'
import App from './src/App.vue'
import VueRouter from 'vue-router'
import routes from './src/router'

const router = new VueRouter({
  routes // short for `routes: routes`
})

Vue.use(VueRouter)

const http = axios.create({
  baseURL: 'http://192.168.2.2:3000/api'
})
Vue.prototype.$http = http

new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')