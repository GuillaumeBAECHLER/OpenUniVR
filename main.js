require('aframe')
import Vue from 'vue'
import axios from 'axios'
import App from './src/App.vue'
import router from './src/router'
import io from 'socket.io-client'
import store from './src/store'
import { EventBus } from './src/event-bus'

let url = 'http://192.168.43.187:3000'
let socket
let getSocket = function () {
  if (!socket) {
    socket = io(url)
  }
  return socket
}

let colors = [
  '#26547C',
  '#EF476F',
  '#FFD166',
  '#06D6A0',
  '#FFFCF9'
]

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

AFRAME.registerComponent('set-color', {
  init: function () {
    this.el.addEventListener('model-loaded', () => {
      const obj = this.el.getObject3D('mesh')
      obj.children.forEach((node) => {
        let randomColor = Math.floor(Math.random() * Math.floor(colors.length))
        node.material = new THREE.MeshStandardMaterial({
          color: colors[randomColor],
          roughness: 1
        });
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
        store.setUser({
          ...store.state.connectedUser,
          position: newPosition
        })
        EventBus.$emit('move')
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