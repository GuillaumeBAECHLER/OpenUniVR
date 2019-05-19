require('aframe')
import Vue from 'vue'
import axios from 'axios'
import App from './src/App.vue'
import VueRouter from 'vue-router'
import routes from './src/router'

AFRAME.registerComponent('show-clickable-on-hover', {
  init: function () {
    this.el.addEventListener('model-loaded', () => {
      const obj = this.el.getObject3D('mesh')
      obj.children.forEach((node) => {
        node.el.addEventListener('mouseenter', () => {
          node.material.emissive.set('white')
        })
        node.el.addEventListener('mouseleave', () => {
          node.material.emissive.set('#000')
        })
        node.material.emissiveIntensity = 0.1
      })
      /* obj.traverse(node => {
        console.log(node)
        node.el.addEventListener('mouseenter', () => {
          node.material.emissive.set('white')
        })
        node.el.addEventListener('mouseleave', () => {
          node.material.emissive.set('#000')
        })
        node.material.emissiveIntensity = 0.5
      }) */
    })
  }
})

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