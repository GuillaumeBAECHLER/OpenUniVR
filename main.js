require('aframe')
import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'

const http = axios.create({
  baseURL: 'http://localhost:3000/api'
})
Vue.prototype.$http = http

new Vue({
  components: { App },
  template: '<App/>'
}).$mount('#app')