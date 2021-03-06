require('aframe')
import Vue from 'vue'
import axios from 'axios'
import App from './src/App.vue'
import router from './src/router'
import io from 'socket.io-client'

let url = 'http://192.168.2.2:3000'
let socket
let getSocket = function () {
  if (!socket) {
    socket = io(url)
  }
  return socket
}


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
    })
  }
})

AFRAME.registerComponent('move-on-click', {
  schema: {
    movingObject: {default: null},
    marker: {default: null}
  },
  init: function () {
    let data = this.data
    let moving
    this.el.addEventListener('mousedown', (evt) => {
      const moveto = evt.detail.intersection.point
      data.marker.setAttribute(
        'position', 
        {
        ...moveto,
        y: data.marker.getAttribute('position').y
        }
      )
      data.marker.setAttribute('visible', 'true')
      data.marker.dispatchEvent(new Event('moveuser'))
      moving = setTimeout(function(){
        data.marker.setAttribute('visible', 'false')
        let newPosition = {
          ...moveto,
          y: data.movingObject.getAttribute('position').y
        }
        data.movingObject.setAttribute(
          'position', 
          newPosition
        )
        getSocket().emit('move', newPosition)
      }, 1000)
    })
    this.el.addEventListener('mouseup', () => {
      clearTimeout(moving)
      data.marker.setAttribute('visible', 'false')
      data.marker.dispatchEvent(new Event('moveusercancelled'))
      data.marker.setAttribute(
        'scale', {
          x: 1, y: 1, z: 1
        }
      )
      data.marker.setAttribute(
        'position',
        {
        ...(data.movingObject.getAttribute('position')),
        y: data.marker.getAttribute('position').y
        }
      )
    })
  }
})

const http = axios.create({
  baseURL: url+'/api'
})

Vue.prototype.$http = http
Vue.prototype.$socket = getSocket
new Vue({
  components: { App },
  router,
  template: '<App/>'
}).$mount('#app')